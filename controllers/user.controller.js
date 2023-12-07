const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { publishEvent } = require('../eventPublisher');
const { DuplicateKeyError,UserAlreadyExistsError,UserNotFoundError,BadRequestError,HttpException, ValidationError, UnauthorizedError } = require('../utils/errors');
const {checkValidation,hashPassword,comparePasswords} = require('../utils/common.utils');
const {auth,generateJwtToken} = require('../middleware/auth.middleware');
const { addGameDataDetailsToUser } = require('../services/gameService');

dotenv.config();

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController {
    getAllUsers = async (req, res, next) => {
        try{
        let userList = await UserModel.find();
        if (!userList.length) {
            throw new HttpException(404, 'Users not found');
        }

        userList = userList.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.status(200).json({data: userList, message: "User List details!"});
        

    } catch (error) {
        console.error('Error during getAllUsers:', error);
        next(error);
      }
    };

    getUserById = async (req, res, next) => {
        try{
        const user = await UserModel.findOne({ id: req.params.id });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }
        const { password, ...userWithoutPassword } = user;
        //add game details to user
        await addGameDataDetailsToUser(userWithoutPassword);
        res.status(200).json({data: userWithoutPassword, message: "User details!"});
    } catch (error) {
        console.error('Error during getUserById:', error);
        next(error);
      }
    };

    getUserByuserName = async (req, res, next) => {
        try{
        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { password, ...userWithoutPassword } = user;
        //add game details to user
        await addGameDataDetailsToUser(userWithoutPassword);
        res.status(200).json({data: userWithoutPassword, message: "User details!"});

    } catch (error) {
        console.error('Error during getUserByuserName:', error);
        next(error);
      }
    };

    getCurrentUser = async (req, res, next) => {
        try{
            const user = await UserModel.findOne({ id: req.currentUser.id });
            if (!user) {
                throw new HttpException(404, 'User not found');
            }

            const { password, ...userWithoutPassword } = user;
            //add game details to user
            await addGameDataDetailsToUser(userWithoutPassword);
            res.status(200).json({data: userWithoutPassword, message: "User details!"});

    } catch (error) {
        console.error('Error during getCurrentUser:', error);
        next(error);
      }
    };

    createUser = async (req, res, next) => {
        try{
        checkValidation(req);

        await hashPassword(req);
        
        const existingUserByEmail = await UserModel.findOne({ email: req.body.email });
        const existingUserByUsername = await UserModel.findOne({ username: req.body.username });
        
        if (existingUserByEmail) {
          // User with this email already exists
          throw new UserAlreadyExistsError('User with this email already exists');
        }
        
        if (existingUserByUsername) {
          // User with this username already exists
          throw new UserAlreadyExistsError('User with this username already exists');
        }

        const result = await UserModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }
        //get user details to publish event 
        let user = await UserModel.findOne({ username: req.body.username });

        const {...userWithoutPassword } = user;

        await publishEvent('user.registered', { userId: user.id, username:user.username, email:user.email });
        res.status(200).json({data: userWithoutPassword, message: "User was created!"});


    } catch (error) {
        console.error('Error during createUser:', error);
        next(error);
      }
    };

    updateUser = async (req, res, next) => {
        try{
        checkValidation(req);

        await hashPassword(req);

        const { confirm_password, ...restOfUpdates } = req.body;
        if(restOfUpdates.role){
            //we need to check if have this permission or not
            const user = await UserModel.findOne({id: req.currentUser.id})
              if(user.role!='SuperUser'){
                throw new UnauthorizedError('You not have permission to change roles.');
              }
            }

        // do the update query and get the result
        // it can be partial edit
        const result = await UserModel.update(restOfUpdates, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong'); 
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

        res.status(200).json({data: info, message: message});

    } catch (error) {
        console.error('Error during updateUser:', error);
        next(error);
      }
    };

    updateProfile = async (req, res, next) => {
        try{
        checkValidation(req);
        await hashPassword(req);

        const { confirm_password, ...restOfUpdates } = req.body;
        if(restOfUpdates.role){
        //we need to check if have this permission or not
        const user = await UserModel.findOne({id: req.currentUser.id})
          if(user.role!='SuperUser'){
            throw new UnauthorizedError('You not have permission to change roles.');
          }
        }

        // do the update query and get the result
        // it can be partial edit
        const result = await UserModel.update(restOfUpdates, req.currentUser.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

        res.status(200).json({data: info, message: message});

    } catch (error) {
        console.error('Error during updateUser:', error);
        next(error);
      }
    };

    deleteUser = async (req, res, next) => {
        try{
        const result = await UserModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'User not found');
        }
        res.status(200).json({data: result, message: 'User has been deleted'});

    } catch (error) {
        console.error('Error during deleteUser:', error);
        next(error);
      }
    };

    userLogin = async (req, res, next) => {
        try{
        await checkValidation(req);

        const { email, password: pass } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new HttpException(401, 'Unable to login!');
        }

        const isMatch = await comparePasswords(pass, user);

        if (!isMatch) {
            throw new HttpException(401, 'Incorrect password!');
        }

        // user matched!
        const token = await generateJwtToken(user); 

        const { password, ...userWithoutPassword } = user;

        res.status(200).json({data: {...userWithoutPassword, token}, message: 'login successful'});

    } catch (error) {
        console.error('Error during userLogin:');
        res.errorOccurred=true;
        return next(error); 
      }
    };

    //testing error
testError = async (req, res, next) => {
    try {
      // Your code that may throw an error
      throw new UserAlreadyExistsError('This is a test error');
    } catch (error) {
      // Pass the error to the next middleware
      next(error);
    } 
  };
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController;
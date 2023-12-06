const UserModel = require('../models/user.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { publishEvent } = require('../eventPublisher');
const { DuplicateKeyError,UserAlreadyExistsError,UserNotFoundError,BadRequestError,HttpException } = require('../utils/errors');


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

        res.send(userList);
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

        res.send(userWithoutPassword);
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

        res.send(userWithoutPassword);
    } catch (error) {
        console.error('Error during getUserByuserName:', error);
        next(error);
      }
    };

    getCurrentUser = async (req, res, next) => {
        try{
        const { password, ...userWithoutPassword } = req.currentUser;

        res.send(userWithoutPassword);
    } catch (error) {
        console.error('Error during getCurrentUser:', error);
        next(error);
      }
    };

    createUser = async (req, res, next) => {
        try{
        this.checkValidation(req);

        await this.hashPassword(req);
        
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

        await publishEvent('user.registered', { userId: user.id, username:user.username, email:user.email });

        res.status(201).send('User was created!');

    } catch (error) {
        console.error('Error during createUser:', error);
        next(error);
      }
    };

    updateUser = async (req, res, next) => {
        try{
        this.checkValidation(req);

        await this.hashPassword(req);

        const { confirm_password, ...restOfUpdates } = req.body;

        // do the update query and get the result
        // it can be partial edit
        const result = await UserModel.update(restOfUpdates, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

        res.send({ message, info });
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
        res.send('User has been deleted');
    } catch (error) {
        console.error('Error during deleteUser:', error);
        next(error);
      }
    };

    userLogin = async (req, res, next) => {
        try{
        this.checkValidation(req);

        const { email, password: pass } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new HttpException(401, 'Unable to login!');
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            throw new HttpException(401, 'Incorrect password!');
        }

        // user matched!
        const secretKey = process.env.SECRET_JWT || "";
        const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
            expiresIn: '24h'
        });

        const { password, ...userWithoutPassword } = user;

        res.send({ ...userWithoutPassword, token });
    } catch (error) {
        console.error('Error during userLogin:', error);
        next(error);
      }
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

    // hash password if it exists
    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController;
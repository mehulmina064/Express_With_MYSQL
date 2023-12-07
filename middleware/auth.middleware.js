const {HttpException, DuplicateKeyError,UserAlreadyExistsError,UserNotFoundError,BadRequestError, UnauthorizedError } = require('../utils/errors');

const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = (...roles) => {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';

            if (!authHeader || !authHeader.startsWith(bearer)) {
                throw new HttpException(401, 'Access denied. No credentials sent!');
            }

            const token = authHeader.replace(bearer, '');
            const secretKey = process.env.JWT_SECRET || "";

            // Verify Token
            const decoded = jwt.verify(token, secretKey);
            const user = await UserModel.findOne({ id: decoded.user_id });

            if (!user) {
                throw new HttpException(401, 'Authentication failed!');
            }

            // check if the current user is the owner user
            const ownerAuthorized = req.params.id == user.id;

            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            if (!ownerAuthorized && roles.length && !roles.includes(user.role)) {
                throw new HttpException(401, 'You not have permission to do this action.');
            }

            // if the user has permissions
            req.currentUser = user;
            next();

        } catch (e) {
            e.status = 401;
            next(new UnauthorizedError(e.message));
            next(e);
        }
    }
}

const generateJwtToken = async (user)=>{
    const secretKey = process.env.JWT_SECRET || "12345";
    return await  jwt.sign({ user_id: user.id.toString() }, secretKey, {
        expiresIn: '24h'
    });

}

module.exports = {auth,generateJwtToken};
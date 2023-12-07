const { validationResult } = require('express-validator');
const { DuplicateKeyError,UserAlreadyExistsError,UserNotFoundError,BadRequestError,HttpException, ValidationError } = require('../utils/errors');
const bcrypt = require('bcrypt');


exports.getPlaceholderStringForArray = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error('Invalid input');
    }

    // if is array, we'll clone the arr 
    // and fill the new array with placeholders
    const placeholders = [...arr];
    return placeholders.fill('?').join(', ').trim();
}


exports.multipleColumnSet = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const values = Object.values(object);

    columnSet = keys.map(key => `${key} = ?`).join(', ');

    return {
        columnSet,
        values
    }
}

//for validations of request properties
exports.checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors);  
    }
}

// hash password if it exists
exports.hashPassword = async (req) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 8);
    }
}

//check passwords compare
exports.comparePasswords= async (pass,user) =>{
    try{
        if (!user || !user.password) {
            throw new BadRequestError('Invalid user or password');
        }
        return await bcrypt.compare(pass, user.password);
    }
    catch(e){
        throw e;
    }
 
}
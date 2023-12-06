const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { validationResult } = require('express-validator');
const { publishEvent } = require('../eventPublisher');
const jwtSecret = process.env.JWT_SECRET;
const { DuplicateKeyError,UserAlreadyExistsError,UserNotFoundError,BadRequestError } = require('../utils/errors');
const authService = require('../services/authService');

const util = require('util');

const verifyToken = util.promisify(jwt.verify);


exports.registerUser = async (req, res,next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;
  try {
    // Create a new user
    const newUser = await authService.registerUser({ username, email, password });
    // throw Error("user not created");

    if(!newUser){
        throw Error("user not created");
    }

    // Publish RabbitMQ event
    await publishEvent('user.registered', { userId: newUser.id, username, email });

    // Generate JWT
    const token = jwt.sign({ id: newUser.id, username, email }, jwtSecret, { expiresIn: '1h' });

    res.json({ message: 'User registered successfully', token });
  }catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Duplicate entry error handling
      next(new DuplicateKeyError('User with this username or email already exists'));
    } else {
      // Other errors
      console.error('Error registering user:', error);
      next(error);
    }
  }
};

exports.login = async (req, res,next) => {
  const { email, password } = req.body;
  try {

    return await authService.loginUser({ username, email, password });
  } catch (error) {
    console.error('Error during login:', error);
    next(error);
  }
};

// Add a route for token refresh
exports.refreshToken = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
  
    if (!refreshToken) {
      return res.status(403).json({ error: 'Refresh token is required' });
    }
  
    try {
      const user = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      
      const accessToken = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: '15m', // Token expires in 15 minutes
      });
  
      res.json({ accessToken });
    } catch (error) {
      console.error('Error during token refresh:', error);
      next(error);
    }
  };



exports.testError = async (req, res, next) => {
    try {
      // Your code that may throw an error
      throw new UserAlreadyExistsError('This is a test error');
    } catch (error) {
      // Pass the error to the next middleware
      next(error);
    } 
  };
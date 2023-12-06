const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { validationResult } = require('express-validator');
const { publishEvent } = require('../eventPublisher');
const jwtSecret = process.env.JWT_SECRET;
const { DuplicateKeyError,UserAlreadyExistsError,UserNotFoundError,BadRequestError } = require('../utils/errors');

exports.registerUser = async (req, res,next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {

    const existingUserByEmail = await userModel.getUserByEmail(email);
    const existingUserByUsername = await userModel.getUserByUserName(username);
    
    if (existingUserByEmail && existingUserByUsername) {
      // User with both email and username already exists
      return res.status(400).json({ error: 'User with this email and username already exists' });
    }
    
    if (existingUserByEmail) {
      // User with this email already exists
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    if (existingUserByUsername) {
      // User with this username already exists
      return res.status(400).json({ error: 'User with this username already exists' });
    }
    console.log("In user registration",existingUserByEmail,existingUserByUsername)

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await userModel.createUser({ username, email, password: hashedPassword });

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
    const user = await userModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: '15m', // Token expires in 15 minutes
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Error during login:', error);
    next(error);
  }
};

// Add a route for token refresh
exports.refreshToken = async (req, res,next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ error: 'Refresh token is required' });
  }

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      const accessToken = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: '15m', // Token expires in 15 minutes
      });

      res.json({ accessToken });
    });
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
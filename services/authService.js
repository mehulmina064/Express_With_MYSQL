// services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { jwtSecret } = require('../config/database');
const { UserNotFoundError, BadRequestError } = require('../utils/errors');

class AuthService {
  async registerUser({ username, email, password }) {
    try {
        const existingUserByEmail = await userModel.getUserByEmail(email);
        const existingUserByUsername = await userModel.getUserByUserName(username);
        
        if (existingUserByEmail && existingUserByUsername) {
          // User with both email and username already exists
          throw new UserAlreadyExistsError('User with this email and username already exists');
        }
        
        if (existingUserByEmail) {
          // User with this email already exists
          throw new UserAlreadyExistsError('User with this email already exists');
        }
        
        if (existingUserByUsername) {
          // User with this username already exists
          throw new UserAlreadyExistsError('User with this username already exists');
        }
        console.log("In Service  user registration ",existingUserByEmail,existingUserByUsername)

        return "has already been";
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      return await userModel.createUser({ username, email, password: hashedPassword });

    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async loginUser({ email, password }) {
    try {
      // Retrieve user by email
      const user = await userModel.getUserByEmail(email);

      if (!user) {
        throw new UserNotFoundError("User not found");
      }

      // Check if the provided password matches the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new BadRequestError("Invalid password");
      }

      // Generate JWT
      const accessToken = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
        expiresIn: '1h',
      });


      const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET);
      return { success: true, message: 'Login successful', accessToken, refreshToken };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();

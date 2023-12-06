// services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { jwtSecret } = require('../config/database');

class AuthService {
  async registerUser({ username, email, password }) {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      await userModel.createUser({ username, email, password: hashedPassword });

      return { success: true, message: 'User registered successfully' };
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
        return { success: false, message: 'User not found' };
      }

      // Check if the provided password matches the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return { success: false, message: 'Incorrect password' };
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
        expiresIn: '1h',
      });

      return { success: true, message: 'Login successful', token };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();

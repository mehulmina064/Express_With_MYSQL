require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'test1234',
  };
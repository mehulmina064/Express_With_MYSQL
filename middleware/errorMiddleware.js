// middleware/errorMiddleware.js
const logger = require('../logger');
const { ValidationError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  console.log('Error middleware reached:'); 

  // Always log errors for tracking and debugging
  if(!err.statusCode){
    logger.error(err.stack);
  }

  // Set a flag to indicate an error occurred
  res.errorOccurred = true;

  // Handle specific error types
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      type: 'error',
      message: err.message,
      errors: err.errors,
    });
  }

  // Generic error response for unhandled errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error'; 
  const errors = err.errors || [message];

  res.status(statusCode).json({
    type: 'error',
    message,
    errors,
  });
};

module.exports = errorHandler;

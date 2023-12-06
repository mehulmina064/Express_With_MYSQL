// middleware/errorMiddleware.js
const logger = require('../logger');

const errorHandler = (err, req, res, next) => {
  if(!err.statusCode){
    logger.error(err.stack);
  console.log('Error middleware reached:', err); 

  }
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error"
  res.status(statusCode).json({ error: message });
};



module.exports = errorHandler;

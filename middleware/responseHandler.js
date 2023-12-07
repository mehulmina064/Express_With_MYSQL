// responseHandler.js
const responseHandler = (req, res, next) => {
    console.log('Response middleware reached:');
  
    // Check if an error occurred in the previous middleware
    if (res.errorOccurred) {
      // Continue to the next middleware for error handling
      return next();
    }
  
    res.defaultSend = res.send;
  
    res.send = (data, message = 'Request successful') => {
       data= typeof data === 'string' ? JSON.parse(data) : data
       let formattedResponse = {
        type: 'success',
        message: message,
        data: data,
      };
      // Check if the data is an error object
      if (data instanceof Error || data.errors) {
        // If it's an error, send it to the error middleware
        console.log('sending  middleware error:');
       formattedResponse = data;
      }
      else{
       formattedResponse = {
        type: 'success',
        message: message,
        data: data,
      };
      }  
      const jsonString = JSON.stringify(formattedResponse);
  
      res.setHeader('Content-Type', 'application/json');
      res.defaultSend(jsonString);
    };
  
    next();
  };
  
  module.exports = responseHandler;
  
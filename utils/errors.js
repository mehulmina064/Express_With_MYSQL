class DuplicateKeyError extends Error {
    constructor(message) {
      super(message);
      this.name = 'DuplicateKeyError';
      this.statusCode = 400; 
    }
  }

class UserAlreadyExistsError extends Error {
    constructor(message) {
      super(message);
      this.name = 'UserAlreadyExists';
      this.statusCode = 400; 
    }
  }

class UserNotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'UserNotFoundError';
      this.statusCode = 400; 
    }
  }

  class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.name = 'BadRequestError';
      this.statusCode = 400; 
    }
  }

  class HttpException extends Error {
    constructor(status, message, data) {
        super(message);
        this.status = status;
        this.message = message;
        this.data = data;
        this.statusCode = status; 
    }
}

// Corrected export statement
module.exports = { DuplicateKeyError, UserAlreadyExistsError, UserNotFoundError, BadRequestError , HttpException };

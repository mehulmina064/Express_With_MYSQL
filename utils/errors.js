class DuplicateKeyError extends Error {
    constructor(message) {
      super(message);
      this.name = 'DuplicateKeyError';
      this.statusCode = 400; 
      this.message = message;
      this.errors=[message];
      Object.setPrototypeOf(this, ValidationError.prototype);
    }
  }

class UserAlreadyExistsError extends Error {
    constructor(message) {
      super(message);
      this.name = 'UserAlreadyExists';
      this.statusCode = 400; 
      this.message = message;
      this.errors=[message];
      Object.setPrototypeOf(this, ValidationError.prototype);
    }
  }

class UserNotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'UserNotFoundError';
      this.statusCode = 400; 
      this.message = message;
      this.errors=[message];
      Object.setPrototypeOf(this, ValidationError.prototype);
    }
  }

  class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.name = 'BadRequestError';
      this.statusCode = 400; 
      this.message = message;
      this.errors=[message];
      Object.setPrototypeOf(this, ValidationError.prototype);
    }
  }

  class HttpException extends Error {
    constructor(status, message, data) {
        super(message);
        this.name = 'HttpException';
        this.status = status;
        this.message = message;
        this.errors=[message];
        this.data = data;
        this.statusCode = status; 
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

class ValidationError extends Error {
  constructor(message, errors) {
      super(message);
      this.name = 'ValidationError';
      this.message = message;
      this.statusCode = 400; 
      this.errors=errors.array();
      Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super();
    this.name = 'UnauthorizedError';
    this.message = message;
    this.statusCode = 401; 
    this.errors=[message];
    Object.setPrototypeOf(this, ValidationError.prototype);
}
}

// Corrected export statement
module.exports = { UnauthorizedError,ValidationError,DuplicateKeyError, UserAlreadyExistsError, UserNotFoundError, BadRequestError , HttpException };

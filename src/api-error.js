"use strict";

module.exports = class ApiError {
  constructor(error) {
    if (error.length) {
      this.errors = error.map(error => new ApiError(error));
    } else if (error.message) {
      this.message = error.message;
      if (error.stack) {
        this.stack = error.stack;
      }
    } else {
      this.message = error;
    }
  }
};

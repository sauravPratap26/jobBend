class ApiError extends Error {
  constructor(
    statusCode,
    message = "something went wrong(default)",
    error = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.error = error;

    Object.defineProperty(this, "message", {
      value: message,
      enumerable: true,
      writable: true,
      configurable: true,
    });
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default ApiError
// server/utils/errorHandling.js

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const formatError = (err) => {
  return {
    status: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };
};

const handleError = (res, error, fallbackMessage = "Something went wrong") => {
  const statusCode = error?.statusCode || 500;

  console.error(fallbackMessage, error);

  return res.status(statusCode).json({
    success: false,
    error: error?.message || fallbackMessage,
  });
};

const ErrorHandling = {
  AppError,
  formatError,
  handleError,
};

export default ErrorHandling;

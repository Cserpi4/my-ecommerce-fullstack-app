// server/utils/errorHandling.js
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Jelezhetjük, hogy "várt" hiba
    Error.captureStackTrace(this, this.constructor);
  }
}

// Standard hiba response formázás
export const formatError = err => {
  return {
    status: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };
};

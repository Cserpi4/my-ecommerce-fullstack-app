// server/middleware/errorMiddleware.js
import { formatError } from '../utils/errorHandling.js';

const errorMiddleware = (err, req, res, _next) => {
  const errorResponse = formatError(err);

  // Log
  console.error(`[${err.statusCode || 500}] ${err.message}`);
  if (err.stack) console.error(err.stack);

  res.status(errorResponse.status).json({
    success: false,
    error: errorResponse.message,
    ...(process.env.NODE_ENV === 'development' && { stack: errorResponse.stack }),
  });
};

export default errorMiddleware;

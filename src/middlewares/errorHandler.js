const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(err.stack);

  // Handle specific error types
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  // Handle MySQL validation errors
  if (err.code === 'ER_BAD_FIELD_ERROR') {
    return res.status(400).json({
      success: false,
      message: 'Invalid field in request',
      errors: [err.message]
    });
  }

  // Handle MySQL duplicate entry errors
  if (err.code === 'ER_DUP_ENTRY') {
    const match = err.message.match(/Duplicate entry .* for key '(.*)'/);
    const field = match ? match[1].split('.').pop() : 'field';
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      errors: [`${field} must be unique`]
    });
  }

  // Handle MySQL connection errors
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed',
      errors: ['Unable to connect to database']
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Handle other errors
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
};

module.exports = errorHandler;
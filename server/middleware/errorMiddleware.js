const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode =
    err.status ||
    err.statusCode ||
    (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message || 'Something went wrong on the server.';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'The supplied identifier is invalid.';
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'value';
    message = `A record with that ${field} already exists.`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(' ');
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session is invalid or has expired. Please log in again.';
  }

  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'The request body contains invalid JSON.';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && statusCode >= 500
      ? { detail: err.message }
      : {}),
  });
};

module.exports = { notFound, errorHandler };

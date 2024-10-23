const AppError = require('../utils/appError');
const sendErrorForDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // RENDERED WEBSITE
  console.error('Error 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something Went Wrong!',
    mesg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // operational trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // unknown error: dont leak details to the client
    // 1) Logging error to console
    console.error('Error 💥', err);
    // 2) send a generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
  // RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something Went Wrong!',
      mesg: err.message,
    });
  }
  // unknown error: dont leak details to the client
  // 1) Logging error to console
  console.error('Error 💥', err);
  // 2) send a generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something Went Wrong!',
    mesg: 'Please try again later.',
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; //trying to match characters between quotes
  const message = `Duplicate Field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  return new AppError('Invalid token. Please login again!', 401);
};

const handleTokenExpiredError = () => {
  return new AppError('Token Expired! Please Login again!', 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsErrorDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJsonWebTokenError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleTokenExpiredError();
    }
    sendErrorProd(err, req, res);
  }
};

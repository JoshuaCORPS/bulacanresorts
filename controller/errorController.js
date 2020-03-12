const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  // search for the value that inside of a quoute ("")
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Dupicate field value: ${value[0]}. Please use another value.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data: ${errors.join(' ')}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid Token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // A. API
    return res.status(err.statusCode).json({
      status: err.status,
      err: err,
      message: err.message,
      stack: err.stack
    });
  }

  // B. RENDERED WEBSITE
  console.error('Error', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // A. API
  if (req.originalUrl.startsWith('/api')) {
    // A. Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    // B. Programming or other unknown error: dont leak error details
    // 1. Log error
    console.error('Error', err);
    // 2. Send generic message
    return res.status(500).json({
      status: 'Error',
      message: 'Something went wrong!'
    });
  }

  // B. RENDERED WEBSITE
  // A. Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }

  // B. Programming or other unknown error: dont leak error details
  // 1. Log error
  console.error('Error', err);
  // 2. Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Failed';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // for invalid IDs/paths ex. tours/:id = tours/wwwww
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    // For duplicate values in MongoDB
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    // For wrong values inserting in MongoDB ex. ratings >=1 && ratings <= 5: ratings: 6
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    // For Wrong JWT Tokens
    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    // For Expired JWT Tokens
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

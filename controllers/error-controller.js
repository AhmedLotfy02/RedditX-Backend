const AppError = require("../utils/app-error");

/**
 * Handles casting errors in mongodb
 * @param {object} error
 * @returns {AppError} res
 */
const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
};

/**
 * Handles duplicate field in mongodb
 * @param {object} error
 * @returns {AppError} res
 */
const handleDuplicateFieldDB = (error) => {
  const message = `Duplicate field value: ${error.keyValue.name}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Handles validation errors in mongodb
 * @param {object} error
 * @returns {AppError} res
 */
const handleValidatorErrorDB = (error) => {
  const errors = Object.values(error.errors).map((val) => val.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

/**
 * Handles invalid token error
 * @returns {AppError} res
 */
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

/**
 * Handles token expiration error
 * @returns {AppError} res
 */
const handleTokenExpiredError = () =>
  new AppError("Token is expired! Please log in again!", 401);

/**
 * Handles errors in development
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object} res
 */
const sendErrorDev = (req, res, err) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Handles errors in production
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object} res
 */
const sendErrorProd = (req, res, err) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  console.error("ERROR 💥", err);
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

/**
 * Handles some errors
 * @param {object} err
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object} res
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV !== "development") {
    let error = { ...err };
    error.message = err.message;
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldDB(error);
    if (err.name === "ValidationError") error = handleValidatorErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleTokenExpiredError();
    sendErrorProd(req, res, error);
  } else sendErrorDev(req, res, err);
};

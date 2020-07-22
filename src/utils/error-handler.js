const errorHandler = (err, req, res, next) => {
  const isOperational = err.statusCode > 0;

  if (isOperational) {
    const {
      statusCode, code, message, moreInfo, source
    } = err;

    return res.status(statusCode).json({
      statusCode,
      code,
      message,
      moreInfo,
      source,
    });
  }

  console.error(err.message);

  res.status(500).send('Service unavailable :(');
  return next();
};

module.exports = errorHandler;

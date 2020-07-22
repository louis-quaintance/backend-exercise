const Joi = require('joi');

const ApiError = require('./error');
const ErrorCodes = require('./error-codes');

const toError = (err) => new ApiError(
  'Invalid route parameters provided. See the error object for more details.',
  ErrorCodes.FAILED_VALIDATION,
  400,
  err.details.map((detail) => ({
    message: detail.message,
    path: detail.path,
  }))
);

const validate = (schema, baseOptions = {}) => {
  // Never abort early
  const options = { ...baseOptions, abortEarly: false };

  return (req, res, next) => {
    if (!schema) {
      throw new Error('No route schema provided.');
    }

    const toValidate = {};
    ['params', 'body', 'query'].forEach((key) => {
      if (schema[key]) {
        toValidate[key] = req[key];
      }
    });

    const validationOptions = {
      ...options,
      context: {
        body: req.body,
        params: req.params,
        query: req.query,
      },
    };

    try {
      const validated = Joi.attempt(
        toValidate,
        Joi.object(schema),
        '',
        validationOptions
      );
      Object.assign(req, validated);
      return next();
    } catch (err) {
      return next(toError(err));
    }
  };
};

module.exports = validate;

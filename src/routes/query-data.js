const { query } = require('../db/manager');
const ErrorCodes = require('../utils/error-codes');
const ApiError = require('../utils/error');

module.exports = async (req, res, next) => {
  try {
    const packets = await query(req.query);
    return res.json({ packets }).end();
  } catch (e) {
    console.error(e.message);
    return next(
      new ApiError(
        'Internal server error',
        ErrorCodes.INTERNAL_SERVER_ERROR,
        500
      )
    );
  }
};

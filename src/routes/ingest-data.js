const { insert, publishWarningToTopic } = require('../db/manager');
const ApiError = require('../utils/error');
const ErrorCodes = require('../utils/error-codes');
const checkThresholds = require('../selectors/check-thresholds-for-sensor');

module.exports = async (req, res, next) => {
  try {
    await insert(req.body);

    const thresholdBreached = checkThresholds(
      req.body.sensorId,
      req.body.value
    );

    if (thresholdBreached) {
      await publishWarningToTopic(
        req.body.sensorId,
        thresholdBreached.reason,
        req.body.value,
        thresholdBreached.transports.join(',')
      );
    }

    return res.status(204).end();
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT') {
      return next(
        new ApiError('Packet already recorded', 'PACKET_ALREADY_RECORDED', 409)
      );
    }
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

const { thresholds } = require('../config/thresholds.json');

module.exports = (sensorId, value) => {
  const threshold = thresholds.find((item) => item.sensorId === sensorId);

  if (!threshold) {
    return null;
  }
  if (value < threshold.lower) {
    return {
      ...threshold,
      reason: 'belowLowerLimit',
    };
  }

  if (value > threshold.upper) {
    return {
      ...threshold,
      reason: 'aboveUpperLimit',
    };
  }
  return null;
};

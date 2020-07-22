const R = require('ramda');

module.exports = ({ sensorId, since, until }) => {
  const params = [];
  const whereClauses = [];

  if (!R.isNil(sensorId)) {
    params.push(sensorId);
    whereClauses.push('sensorId = ?');
  }
  if (!R.isNil(since)) {
    params.push(since);
    whereClauses.push('time >= ?');
  }
  if (!R.isNil(until)) {
    params.push(until);
    whereClauses.push('time <= ?');
  }

  let limitClause = '';
  if (params.length === 0) {
    limitClause = ' LIMIT 100';
  }

  return {
    params,
    whereClauses,
    limitClause,
  };
};

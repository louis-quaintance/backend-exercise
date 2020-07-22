const sqlite3 = require('sqlite3');
const moment = require('moment');
const { open } = require('sqlite');

const env = require('../env-vars');
const queryBuilder = require('../utils/query-builder');

let db;

/**
 * The idea of the threshold_alert_topic is to mimic a notification topic
 * whereby there could be an email publisher and/or sms publisher listening out accordingly
 * in this case i'm just using a sqllite table to illustrate the approach
 */
const init = async () => {
  db = await open({
    filename: env.DB_LOCATION,
    driver: sqlite3.Database,
  });

  await db.exec(
    'CREATE TABLE IF NOT EXISTS ingest_data(sensorId TEXT, time NUMBER, value NUMBER, UNIQUE(sensorId, time))'
  );

  await db.exec(
    'CREATE TABLE IF NOT EXISTS threshold_alert_topic(sensorId TEXT, time NUMBER, value NUMBER, reason TEXT, transports TEXT)'
  );
};

const insert = ({ sensorId, time, value }) =>
  db.run('INSERT INTO ingest_data (sensorId, time, value) VALUES (?,?,?)', [
    sensorId,
    time,
    value,
  ]);

const publishWarningToTopic = (sensorId, reason, value, transports) =>
  db.run(
    'INSERT INTO threshold_alert_topic (sensorId, time, reason, value, transports) VALUES (?,?,?,?,?)',
    [sensorId, moment.utc().unix(), reason, value, transports]
  );

const query = ({ sensorId, since, until }) => {
  const { params, whereClauses, limitClause } = queryBuilder({
    sensorId,
    since,
    until,
  });

  return db.all(
    `select * from ingest_data where ${whereClauses.join(
      ' and '
    )} ${limitClause}`,
    params
  );
};

const clearTable = (tableName = 'ingest_data') =>
  db.run(`DELETE FROM ${tableName}`, []);

const getDb = () => db;

module.exports = {
  getDb,
  insert,
  init,
  clearTable,
  query,
  publishWarningToTopic,
};

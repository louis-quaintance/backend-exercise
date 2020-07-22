const test = require('tape');
const request = require('supertest');
const moment = require('moment');
const tk = require('timekeeper');
const app = require('../../server');
const { clearTable, getDb } = require('../../src/db/manager');
const { keys } = require('ramda');

const testName = 'ingesting-data';

const cleanUp = async () => {
  await clearTable('ingest_data');
  await clearTable('threshold_alert_topic');
};

test(testName, async (assert) => {
  assert.plan(1);

  await cleanUp();

  const { statusCode } = await request(app).put('/data').send({
    sensorId: '100',
    time: 345345345,
    value: 123.23,
  });

  assert.equal(statusCode, 204, '204 returned when data successfully ingested');
});

test(testName, async (assert) => {
  assert.plan(1);

  await cleanUp();

  await request(app).put('/data').send({
    sensorId: '100',
    time: 345345345,
    value: 123.23,
  });

  const { statusCode } = await request(app).put('/data').send({
    sensorId: '100',
    time: 345345345,
    value: 123.23,
  });

  assert.equal(statusCode, 409, '409 returned when packet already exists');
});

test(testName, async (assert) => {
  assert.plan(1);

  await cleanUp();

  const { statusCode } = await request(app).put('/data').send({
    time: 345345345,
    value: 123.23,
  });

  assert.equal(statusCode, 400, '400 returned when no sensor id');
});

test(testName, async (assert) => {
  assert.plan(1);

  await cleanUp();

  const { statusCode } = await request(app).put('/data').send({
    sensorId: '100',
    value: 123.23,
  });

  assert.equal(statusCode, 400, '400 returned when no time');
});

test(testName, async (assert) => {
  await cleanUp();

  tk.freeze(moment.utc('2012-01-01').toDate());

  const { statusCode } = await request(app).put('/data').send({
    sensorId: '123',
    time: 345345345,
    value: -1,
  });

  assert.equal(statusCode, 204, '204 returned when data successfully ingested');

  const topicItems = await getDb().all('select * from threshold_alert_topic');

  assert.deepEqual(
    topicItems,
    [
      {
        sensorId: '123',
        time: 1325376000,
        reason: 'belowLowerLimit',
        transports: 'sms',
        value: -1,
      },
    ],
    'one record written to topic for processing'
  );

  tk.reset();
  assert.end();
});

const test = require('tape');
const request = require('supertest');
const app = require('../../server');
const { clearTable } = require('../../src/db/manager');

const testName = 'query-data';

const cleanUp = async () => {
  await clearTable('ingest_data');
  await clearTable('threshold_alert_topic');
};

test(testName, async (assert) => {
  assert.plan(2);

  await cleanUp();

  await request(app).put('/data').send({
    sensorId: '100',
    time: 345345345,
    value: 123.23,
  });

  const { body, statusCode } = await request(app).get('/data').query({
    sensorId: '100',
  });

  assert.equal(statusCode, 200, 'should return a 200 status code');
  assert.deepEqual(
    body,
    {
      packets: [
        {
          sensorId: '100',
          time: 345345345,
          value: 123.23,
        },
      ],
    },
    'should return one packet'
  );
});

test(testName, async (assert) => {
  assert.plan(2);

  await cleanUp();

  await request(app).put('/data').send({
    sensorId: '100',
    time: 345345345,
    value: 123.23,
  });

  const { body, statusCode } = await request(app).get('/data').query({
    sensorId: 'unknown',
  });

  assert.equal(statusCode, 200, 'should return a 200 status code');
  assert.deepEqual(
    body,
    {
      packets: [],
    },
    'should return zero packets'
  );
});

test(testName, async (assert) => {
  assert.plan(2);

  await cleanUp();

  await request(app).put('/data').send({
    sensorId: '100',
    time: 1,
    value: 123.23,
  });

  await request(app).put('/data').send({
    sensorId: '100',
    time: 10,
    value: 123.23,
  });

  const { body, statusCode } = await request(app).get('/data').query({
    sensorId: '100',
    since: 1,
    until: 9,
  });

  assert.equal(statusCode, 200, 'should return a 200 status code');
  assert.deepEqual(
    body,
    {
      packets: [
        {
          sensorId: '100',
          time: 1,
          value: 123.23,
        },
      ],
    },
    'should return only the first packet which is in range'
  );
});

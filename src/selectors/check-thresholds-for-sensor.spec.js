const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();

test('check-thresholds-for-sensor', (assert) => {
  assert.plan(1);
  const selector = proxyquire('./check-thresholds-for-sensor', {
    '../config/thresholds.json': {
      thresholds: [
        {
          sensorId: '123',
          lower: '0',
          upper: 100,
          transports: ['sms'],
        },
      ],
    },
  });

  assert.deepEqual(
    selector('123', 0),
    null,
    'no threshold when ON lower limit'
  );
});

test('check-thresholds-for-sensor', (assert) => {
  assert.plan(1);
  const selector = proxyquire('./check-thresholds-for-sensor', {
    '../config/thresholds.json': {
      thresholds: [
        {
          sensorId: '123',
          lower: '0',
          upper: 100,
          transports: ['sms'],
        },
      ],
    },
  });

  assert.deepEqual(
    selector('123', -1),
    {
      sensorId: '123',
      lower: '0',
      upper: 100,
      transports: ['sms'],
      reason: 'belowLowerLimit',
    },
    'belowLowerLimit triggered when below lower limit'
  );
});

test('check-thresholds-for-sensor', (assert) => {
  assert.plan(1);
  const selector = proxyquire('./check-thresholds-for-sensor', {
    '../config/thresholds.json': {
      thresholds: [
        {
          sensorId: '123',
          lower: '0',
          upper: 100,
          transports: ['sms'],
        },
      ],
    },
  });

  assert.deepEqual(
    selector('123', 101),
    {
      sensorId: '123',
      lower: '0',
      upper: 100,
      transports: ['sms'],
      reason: 'aboveUpperLimit',
    },
    'aboveUpperLimit triggered when above upper limit'
  );
});

test('check-thresholds-for-sensor', (assert) => {
  assert.plan(1);
  const selector = proxyquire('./check-thresholds-for-sensor', {
    '../config/thresholds.json': {
      thresholds: [
        {
          sensorId: '123',
          lower: '0',
          upper: 100,
          transports: ['sms'],
        },
      ],
    },
  });

  assert.deepEqual(
    selector('123', 100),
    null,
    'no alert triggered when ON upper limit'
  );
});

test('check-thresholds-for-sensor', (assert) => {
  assert.plan(1);
  const selector = proxyquire('./check-thresholds-for-sensor', {
    '../config/thresholds.json': {
      thresholds: [
        {
          sensorId: 'somethingNoThresholdsDefinedFor',
          lower: '0',
          upper: 100,
          transports: ['sms'],
        },
      ],
    },
  });

  assert.deepEqual(
    selector('123', 100),
    null,
    'no alert triggered when nothing defined for particular sensor'
  );
});

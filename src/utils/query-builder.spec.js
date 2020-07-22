const test = require('tape');
const queryBuilder = require('./query-builder');

test('query-builder', (assert) => {
  assert.plan(1);
  const params = queryBuilder({});

  assert.deepEqual(
    params,
    { params: [], whereClauses: [], limitClause: ' LIMIT 100' },
    'only limit clause is set when no params are passed in '
  );
});

test('query-builder', (assert) => {
  assert.plan(1);
  const params = queryBuilder({ sensorId: '123', since: 1, until: 10 });

  assert.deepEqual(
    params,
    {
      params: ['123', 1, 10],
      whereClauses: ['sensorId = ?', 'time >= ?', 'time <= ?'],
      limitClause: '',
    },
    'all params set when all the params passed in'
  );
});

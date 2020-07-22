const Joi = require('joi');

const validator = require('../utils/request-validator');

const injestData = require('./ingest-data');
const queryData = require('./query-data');

module.exports = (app) => {
  app.put(
    '/data',
    validator({
      body: {
        sensorId: Joi.string().required(),
        time: Joi.number().required(),
        value: Joi.number().required(),
      },
    }),
    injestData
  );

  app.get(
    '/data',
    validator({
      query: {
        sensorId: Joi.string().optional(),
        since: Joi.number().optional(),
        until: Joi.number().optional(),
      },
    }),
    queryData
  );
};

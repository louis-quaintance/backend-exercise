const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./src/routes');
const dbManager = require('./src/db/manager');
const errorHandler = require('./src/utils/error-handler');

dbManager.init();

const app = express();

app.use(helmet());
app.use(bodyParser.json());

routes(app);

app.use(errorHandler);

module.exports = app;

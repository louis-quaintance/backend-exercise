const envalid = require('envalid');

const { num, str } = envalid;

const baseEnvVars = {
  PORT: num({ default: '3000' }),
  DB_LOCATION: str({ default: 'database.db' }),
};

const env = envalid.cleanEnv(process.env, {
  ...baseEnvVars,
});

module.exports = { ...env };

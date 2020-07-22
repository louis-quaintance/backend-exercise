require('dotenv').config({ silent: true });

const server = require('./server');
const { PORT } = require('./src/env-vars');

server.listen(PORT, () => {
  console.log('Server running on port %d', PORT);
});

const getPort = require('get-port');

module.exports = async () => {
  const port = await getPort();
  return port;
};

const fs = require('fs');
const path = require('path');

const createCustomScript = (filenames) => (req, res) => {
  const incomingName = path.basename(req.url);
  const foundFilename = filenames.find(filename => path.basename(filename) === incomingName);
  if (foundFilename) {
    const fileContent = fs.readFileSync(foundFilename, { encoding: 'utf8' });
    res.setHeader('content-type', 'text/javascript');
    res.write(fileContent);
    res.end();
  }
};

module.exports = createCustomScript;

const fs = require('fs');
const path = require('path');

const createCustomScript = (script) => (req, res) => {
  const filename = path.basename(script);
  if (req.url.endsWith(filename)) {
    const fileContent = fs.readFileSync(script, { encoding: 'utf8' });
    res.setHeader('content-type', 'text/javascript');
    res.write(fileContent);
    res.end();
  }
};

module.exports = createCustomScript;

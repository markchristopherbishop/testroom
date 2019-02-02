const Command = require('commander').Command;
const express = require('express'); 
const proxy = require('express-http-proxy');
const path = require('path');
const runCommand = require('./runCommand');
const getPort = require('./getPort');
const createInjectionMiddleware = require('./injectionMiddleware');
const createDelayMiddleware = require('./delayMiddleware');
const createServeCustomScript = require('./serveCustomScript');
const package = require('../package');
const { testroomScriptPath } = require('./constants');

const command = new Command();

command
  .version(package.version);

command
  .command('run [command]')
  .description('run a test command against a target host or proxy')
  .option('-h, --host [host]', 'The directory to host for application testing')
  .option('-x, --proxy [proxy]', 'A website to proxy for application testing')
  .option('-i, --inject [inject]', 'Scripts to inject')
  .option('-p, --port [port]', 'The port to use for testing')
  .option('-d, --delayScripts [scriptPattern]', 'Delay loading scripts')
  .action(async (command, options) => {
    const testroomBootstrapScript = path.join(__dirname, 'browserScripts/index.js');
    const filenamesToInject = [testroomBootstrapScript];
    const host = 'localhost';
    const port = parseFloat(options.port) || await getPort();
    process.env.TEST_PORT = port;
    const app = express();
    
    if (!options.host && !options.proxy) {
      console.log('You must supply either -h (--host) or -x (--proxy) options with the run command');
      process.exit(1);
    } else if (options.host && options.proxy) {
      console.log('You cannot supply both -h (--host) and -x (--proxy) options with the run command. It must be one or the other.');
      process.exit(1);
    }
    
    if (options.inject) {
      filenamesToInject.push(...options.inject.split(','));
    }
    
    if (filenamesToInject && filenamesToInject.length > 0) {
      filenamesToInject.forEach((filename) => app.use(createInjectionMiddleware(filename)));
    }
    
    if (options.delayScripts) {
      app.use(createDelayMiddleware());
    }
    
    if (options.host) {
      console.log(`Hosting directory ${options.host} on http://${host}:${port}`);
      app.use(express.static(options.host));
    } else if (options.proxy) {
      console.log(`Proxing ${options.proxy} for test on http://${host}:${port}`);
      app.use('/', proxy(options.proxy))
    }
    
    app.get(`/${testroomScriptPath}*`, createServeCustomScript(filenamesToInject));
    
    app.listen(port, async () => {
      console.log('Testing started');
      const { code } = await runCommand(command);
      console.log('Testing complete');
      process.exit(code);
    });
  });
  
  module.exports = command;
  
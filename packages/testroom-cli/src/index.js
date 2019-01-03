#!/usr/bin/env node
const program = require('commander');
const express = require('express'); 
const proxy = require('express-http-proxy');
const runCommand = require('./runCommand');
const getPort = require('./getPort');
const createInjectionMiddleware = require('./injectionMiddleware');
const createServeCustomScript = require('./serveCustomScript');
const package = require('../package');

program
  .version(package.version);

program
  .command('run [command]')
  .description('run a test command against a target host or proxy')
  .option('-h, --host [host]', 'The directory to host for application testing')
  .option('-x, --proxy [proxy]', 'A website to proxy for application testing')
  .option('-i, --inject [inject]', 'Scripts to inject')
  .option('-p, --port [port]', 'The port to use for testing')
  .action(async (command, options) => {
    const host = 'localhost';
    const port = options.port || await getPort();
    process.env.TEST_PORT = port;
    const app = express();
    
    if (!options.host && !options.proxy) {
      throw new Error('You must supply either -h (--host) or -x (--proxy) options with the run command');
    } else if (options.host && options.proxy) {
      throw new Error('You cannot supply both -h (--host) and -x (--proxy) options with the run command. It must be one or the other.');
    }
    
    if (options.inject) {
      const filenames = options.inject.split(',');
      if (filenames && filenames.length > 0) {
        filenames.forEach((filename) => app.use(createInjectionMiddleware(filename)));
      }
      app.get('/custom*', createServeCustomScript(filenames));
    }
    
    if (options.host) {
      console.log(`Hosting directory ${options.host} on http://${host}:${port}`);
      app.use(express.static(options.host));
    } else if (options.proxy) {
      console.log(`Proxing ${options.proxy} for test on http://${host}:${port}`);
      app.use('/', proxy(options.proxy))
    }
    
    app.listen(port, async () => {
      console.log('Testing started');
      const { code } = await runCommand(command);
      console.log('Testing complete');
      process.exit(code);
    });
  });

program.parse(process.argv);

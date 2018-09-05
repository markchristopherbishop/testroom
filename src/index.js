#!/usr/bin/env node
const program = require('commander');
const express = require('express'); 
const runCommand = require('./runCommand');
const getPort = require('./getPort');
const createInjectionMiddleware = require('./injectionMiddleware');
const proxy = require('express-http-proxy');

program
  .version('0.0.1');

program
  .command('run [command]')
  .description('run a test command against a target host or proxy')
  .option('-h, --host [host]', 'The directory to host for application testing')
  .option('-p, --proxy [proxy]', 'A website to proxy for application testing')
  .option('-i, --inject [inject]', 'Script to inject')
  .action(async (command, options) => {
    const host = 'localhost';
    const port = await getPort();
    process.env.TEST_PORT = port;
    const app = express();
    
    if (!options.host && !options.proxy) {
      throw new Error('You must supply either -h (--host) or -p (--proxy) options with the run command');
    } else if (options.host && options.proxy) {
      throw new Error('You cannot supply both -h (--host) and -p (--proxy) options with the run command. It must be one or the other.');
    }
    
    if (options.inject) {
      app.use(createInjectionMiddleware(options.inject));
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

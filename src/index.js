#!/usr/bin/env node
const program = require('commander');
const express = require('express'); 
const runCommand = require('./runCommand');
const getPort = require('./getPort');
const createInjectionMiddleware = require('./injectionMiddleware');

program
  .version('0.1.0');

program
  .command('run [command]')
  .description('run a test command against a target host or proxy')
  .option('-h, --host [host]', 'The directory to host the application for testing', './dist')
  .option('-i, --inject [inject]', 'Script to inject')
  .action(async (command, options) => {
    const host = 'localhost';
    const port = await getPort();
    process.env.TEST_PORT = port;
    const app = express();
    
    if (options.inject) {
      app.use(createInjectionMiddleware(options.inject));
    }
    app.use(express.static(options.host));
    app.listen(port, async () => {
      console.log(`Hosting directory ${options.host} on http://${host}:${port}`);
      console.log('Testing started');
      const { code } = await runCommand(command);
      console.log('Testing complete');
      process.exit(code);
    });
  });

program.parse(process.argv);

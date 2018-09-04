#!/usr/bin/env node
const program = require('commander');
const express = require('express'); 
const runCommand = require('./runCommand');
const getPort = require('./getPort');
const injectionMiddleware = require('./injectionMiddleware');

program
  .version('0.1.0');

program
  .command('run [command]')
  .description('run a test command against a target host or proxy')
  .option('-h, --host [command]', 'The directory to host the application for testing', './dist')
  .action(async (command, options) => {
    const port = await getPort();
    process.env.TEST_PORT = port;
    const app = express();
    
    app.use(injectionMiddleware);
    app.use(express.static(command));
    app.listen(port, async () => {
      console.log(`Hosting app for test on port ${port}!`);
      console.log('Testing started');
      const { code } = await runCommand(command);
      console.log('Testing complete');
      process.exit(code);
    });
  });

program.parse(process.argv);

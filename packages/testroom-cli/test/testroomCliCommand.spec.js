const chai = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const spies = require('chai-spies')

chai.use(spies);
const expect = chai.expect;
const originalExit = process.exit;
const originalLog = console.log;

describe('testroom-cli', () => {
  describe('run', () => {
    let dependencies;
    let app;
    
    beforeEach(() => {
      const getPort = () => 5000;
      const listen = (port, callback) => callback();
      app = { get: chai.spy(), use: chai.spy(), listen: chai.spy(listen) };
      const express = () => app;
      express.static = chai.spy();
      dependencies = {
        express,
        './getPort': getPort,
        './runCommand': chai.spy.returns({ code: 0 }),
        'express-http-proxy': chai.spy(),
        './serveCustomScript': chai.spy(),
        './injectionMiddleware': chai.spy(),
      };
      command = proxyquire('../src/testroomCliCommand', dependencies);
      process.exit = chai.spy();
    });
    
    afterEach(() => {
      process.exit = originalExit;
      console.log = originalLog;
    });
    
    it('should print error and exit process if no -x or -h options are given', () => {
      console.log = chai.spy();
      command.parse(['', '', 'run', 'echo test', '-p', '3000']);
      expect(console.log).to.have.been.called.with('You must supply either -h (--host) or -x (--proxy) options with the run command');
      expect(process.exit).to.have.been.called.with(1);
    });
    
    it('should print error and exit process if both -x and -h options are given', () => {
      console.log = chai.spy();
      command.parse(['', '', 'run', 'echo test', '-h', './dist', '-x', 'http://localhost:8080', '-p', '3000']);
      expect(console.log).to.have.been.called.with('You cannot supply both -h (--host) and -x (--proxy) options with the run command. It must be one or the other.');
      expect(process.exit).to.have.been.called.with(1);
    });
    
    it('should add middleware to serve custom scripts', () => {
      command.parse(['', '', 'run', 'echo test', '-h', './dist', '-p', '3000', '-i', './test.js']);
      expect(dependencies['./serveCustomScript']).to.have.been.called.with(['./test.js']);
    });
    
    it('should add middleware to inject custom script tags in responses for each script', () => {
      command.parse(['', '', 'run', 'echo test', '-h', './dist', '-p', '3000', '-i', './test.js,./test2.js']);
      expect(dependencies['./injectionMiddleware']).to.have.been.called.with('./test.js');
      expect(dependencies['./injectionMiddleware']).to.have.been.called.with('./test2.js');
    });
    
    it('should set the process.env.TEST_PORT to a random port if port parameter not given', (done) => {
      command = proxyquire('../src/testroomCliCommand', dependencies);
      command.parse(['', '', 'run', 'echo test', '-h', './dist']);
      setTimeout(() => { expect(process.env.TEST_PORT).to.eq('5000'); done(); });
    });
    
    it('should set the process.env.TEST_PORT to a port parameter', () => {
      command.parse(['', '', 'run', 'echo test', '-h', './dist', '-p', '3000']);
      expect(process.env.TEST_PORT).to.eq('3000');
    });
    
    it('should start hosting app on given port', () => {
      command.parse(['', '', 'run', 'echo test', '-h', './dist', '-p', '3000']);
      expect(app.listen).to.have.been.called.with(3000);
    });
    
    it('should start hosting static files for given directory if -h option is given', () => {
      command.parse(['', '', 'run', 'echo test', '-h', './dist', '-p', '3000']);
      expect(app.use).to.have.been.called();
      expect(dependencies.express.static).to.have.been.called.with('./dist');
    });
    
    it('should start proxying files for given site if -x option is given', () => {
      command.parse(['', '', 'run', 'echo test', '-x', 'http://localhost:8080', '-p', '3000']);
      expect(app.use).to.have.been.called();
      expect(dependencies['express-http-proxy']).to.have.been.called.with('http://localhost:8080');
    });
    
    it('should run the given command once the files are hosted', () => {
      command.parse(['', '', 'run', 'echo test', '-h', './dist', '-p', '3000']);
      expect(dependencies['./runCommand']).to.have.been.called.with('echo test');
    });
    
    it('should stop the process once the test command has run', (done) => {
      command.parse(['', '', 'run', 'echo test', '-h', './dist', '-p', '3000']);
      setTimeout(() => { expect(process.exit).to.have.been.called(); done(); });
    });
  });
});

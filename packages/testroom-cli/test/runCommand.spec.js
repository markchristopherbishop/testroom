const chai = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const spies = require('chai-spies')

chai.use(spies);
const expect = chai.expect;

describe('runCommand', () => {
  let runCommand;
  let child_process;
  
  beforeEach(() => {
    child_process = { spawn: chai.spy.returns({ on: () => undefined })};
    runCommand = proxyquire('../src/runCommand', { child_process });
  });
  
  it('should spawn new process with given command', () => {
    runCommand('test');
    expect(child_process.spawn).of.have.been.called.with('test');
  });
  
  it('should resolve promise with exit code when process is closed', async () => {
    child_process.spawn = chai.spy.returns({ on: (event, callback) => callback(5) });
    runCommand = proxyquire('../src/runCommand', { child_process });
    const code = await runCommand('test');
    expect(code).to.eql({ code: 5 });
  });
});

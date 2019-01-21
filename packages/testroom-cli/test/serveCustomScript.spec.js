const chai = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const spies = require('chai-spies')
const { testroomScriptPath } = require('../src/constants');

chai.use(spies);
const expect = chai.expect;

describe('serveCustomScript', () => {
  let serveCustomScript;
  let req;
  let res;
  
  const customContent = 'console.log("time")';
  
  beforeEach(() => {
    req = { url: `http://localhost:8080/${testroomScriptPath}/test.js` };
    res = { setHeader: chai.spy(), write: chai.spy(), end: chai.spy() };
    fs = { readFileSync: chai.spy.returns(customContent) };
    serveCustomScript = proxyquire('../src/serveCustomScript', { fs });
  });
  
  it('should not serve file if it is not in the custom file list', () => {
    serveCustomScript(['./nottest.js'])(req, res);
    expect(res.setHeader).to.not.have.been.called();
    expect(res.write).to.not.have.been.called();
    expect(res.end).to.not.have.been.called();
  });
  
  it('should serve file if is given in the custom file list', () => {
    serveCustomScript(['./test.js'])(req, res);
    expect(res.setHeader).to.have.been.called();
    expect(res.write).to.have.been.called();
    expect(res.end).to.have.been.called();
  });
  
  it('should read contents of the file and write it to stream', () => {
    serveCustomScript(['./test.js'])(req, res);
    expect(res.write).to.have.been.called.with(customContent);
  });
});

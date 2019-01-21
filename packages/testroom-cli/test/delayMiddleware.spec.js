const chai = require('chai');
const spies = require('chai-spies');
const proxyquire = require('proxyquire').noCallThru();

chai.use(spies);
const expect = chai.expect;

describe('delayMiddleware', () => {
  let req;
  let res;
  let endMock = chai.spy();
  let delayMiddleware;
  
  const testFile = './test/mock/test.js';
  const next = chai.spy();
  
  beforeEach(() => {
    req = { url: '/index.html' };
    res = { removeHeader: () => undefined, end: endMock};
    delayMiddleware = proxyquire('../src/delayMiddleware', { fs: { existsSync: chai.spy.returns(true) }});
  });
  
  it('should modify script tags to remove src attribute and replace with data-delayed-script attribute', () => {
    delayMiddleware()(req, res, next);
    res.end(`<html><head><script src="hello.js"></script></head><body></body></html>`, 'utf-8');
    expect(endMock).to.have.been.called.with(
      `<html><head><script data-delayed-script="hello.js"></script></head><body></body></html>`);
  });
  
  it('should not inject scripts if the file is not html', () => {
    req.url = 'something.js'
    delayMiddleware(testFile)(req, res, next);
    res.end(`<html></html>`, 'utf-8');
    expect(endMock).to.have.been.called.with(`<html></html>`);
  });
  
  it('should only modify scripts that satisfy delayPattern regex', () => {
    req.url = 'myhtml.html';
    delayMiddleware()(req, res, next);
    res.end(`<html><head><script src="hello.js"></script></head><body></body></html>`, 'utf-8');
    expect(endMock).to.have.been.called.with(
      `<html><head><script data-delayed-script="hello.js"></script></head><body></body></html>`);
  });
  
  it('should not inject scripts that do not satisfy delayPattern regex', () => {
    delayMiddleware('goodbye.js')(req, res, next);
    res.end(`<html><head><script src="hello.js"></script></head><body></body></html>`, 'utf-8');
    expect(endMock).to.have.been.called.with(`<html><head><script src="hello.js"></script></head><body></body></html>`);
  });
});

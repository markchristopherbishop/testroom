const chai = require('chai');
const spies = require('chai-spies');
const proxyquire = require('proxyquire').noCallThru();

chai.use(spies);
const expect = chai.expect;

describe('injectionMiddleware', () => {
  let req;
  let res;
  let endMock = chai.spy();
  let injectionMiddleware;
  
  const testFile = './test/mock/test.js';
  const script = `<script type="text/javascript" src="app.js"></script>`;
  const next = chai.spy();
  
  beforeEach(() => {
    req = { url: '/index.html' };
    res = { removeHeader: () => undefined, end: endMock};
    injectionMiddleware = proxyquire('../src/injectionMiddleware', { fs: { existsSync: chai.spy.returns(true) }});
  });
  
  it('should modify returned html to include the given script', () => {
    injectionMiddleware(testFile)(req, res, next);
    res.end(`<html></html>`, 'utf-8');
    const injectedScript = `<script type="text/javascript" src="custom/test.js"></script>`;
    expect(endMock).to.have.been.called.with(
      `<html><head>${injectedScript}</head><body></body></html>`);
  });
  
  it('should insert given script before any other scripts in the page', () => {
    injectionMiddleware(testFile)(req, res, next);
    const injectedScript = `<script type="text/javascript" src="custom/test.js"></script>`;
    res.end(`<html><head>${script}</head><body></body></html>`, 'utf-8');
    expect(endMock).to.have.been.called.with(
      `<html><head>${injectedScript}${script}</head><body></body></html>`);
  });
  
  it('should not inject scripts if the file is not html', () => {
    req.url = 'something.js'
    injectionMiddleware(testFile)(req, res, next);
    res.end(`<html></html>`, 'utf-8');
    expect(endMock).to.have.been.called.with(`<html></html>`);
  });
  
  it('should throw an exception if an invalid file is given', () => {
    injectionMiddleware = proxyquire('../src/injectionMiddleware', { fs: { existsSync: chai.spy.returns(false) }});
    expect(() => injectionMiddleware('')).to.throw(`the given script "" does not exist`);
  });
});

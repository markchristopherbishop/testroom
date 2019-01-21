const { expect } = require('chai');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe('browserScripts.index', () => {
  let oldWindow;
  let oldDocument;
  let dom;
  
  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <head>
        <script data-delayed-script="test.js"></script>
      </head>
      <body>
        <script data-delayed-script="testing/test2.js"></script>
      <body>
    `);
    global.window = dom.window;
    global.document = dom.window.document;
    require('../../src/browserScripts/index.js');
  });
  
  afterEach(() => {
    delete require.cache[require.resolve('../../src/browserScripts/index.js')];
    global.window = oldWindow;
    global.document = oldDocument;
  });
  
  it('should inject loadDelayedScripts function to testroom.loadDelayedScripts', () => {
    expect(window.testroom.loadDelayedScripts).to.be.a('function');
  });
  
  describe('loadDelayedScripts', () => {
    it('should replace all delayed scripts (data-delayed-script) with src paths', () => {
      window.testroom.loadDelayedScripts();
      const scripts = dom.window.document.querySelectorAll('script');
      expect(scripts[0].getAttribute('data-delayed-script')).to.be.eq(null);
      expect(scripts[0].getAttribute('src')).to.be.eq('test.js');
      expect(scripts[1].getAttribute('data-delayed-script')).to.be.eq(null);
      expect(scripts[1].getAttribute('src')).to.be.eq('testing/test2.js');
    });
  });
});

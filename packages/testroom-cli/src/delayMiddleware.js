const interceptor = require('express-interceptor');
const cheerio = require('cheerio'); 
const { testroomScriptPath } = require('./constants');

const isHtml = (req) => req.url.endsWith('/') || req.url.endsWith('.html');

const createDelayMiddleware = (delayPattern = `^((?!${testroomScriptPath}\/).)*$`) => {
  const delayPatternRegex = new RegExp(delayPattern);
  return interceptor((req) => {
    return {
      isInterceptable: () => isHtml(req),
      intercept: (body, send) => {
        const $ = cheerio.load(body);
        const scripts = $('script');
        scripts && scripts.each((index, node) => {
          const $script = $(node);
          const scriptSource = $script.prop('src');
          if (delayPatternRegex.test(scriptSource)) {
            console.log('delaying script', scriptSource);
            const original = $script.attr('src');
            $script.removeAttr('src');
            $script.attr('data-delayed-script', original)
          }
        });
        send($.html());
      }         
    };
  });
};

module.exports = createDelayMiddleware;

const interceptor = require('express-interceptor');
const cheerio = require('cheerio'); 

const createScript = (script) => {
  return `<script>${script}</script>`;
};

const isHtml = (req) => req.url.endsWith('/') || req.url.endsWith('.html');

const createInjectionMiddleware = (script) => interceptor(function(req, res){
  return {
    isInterceptable: function(){
      return isHtml(req);
    },
    intercept: function(body, send) {
      console.log('Injecting script', script, 'into', req.url);
      const $document = cheerio.load(body);
      const firstScripts = $document('head script');
      if (firstScripts && firstScripts.length > 0) {
        firstScripts.first().before(createScript(script));
      } else {
        $document('head').append(createScript(script));
      }
      
      send($document.html());
    }
  };
});

module.exports = createInjectionMiddleware;

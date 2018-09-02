const interceptor = require('express-interceptor');
const cheerio = require('cheerio'); 

const injectionMiddleware = interceptor(function(req, res){
  return {
    // Only HTML responses will be intercepted
    isInterceptable: function(){
      return /text\/html/.test(res.get('Content-Type'));
    },
    // Appends a paragraph at the end of the response body
    intercept: function(body, send) {
      var $document = cheerio.load(body);
      $document('body').append('<p>From interceptor!</p>');
      send($document.html());
    }
  };
});

module.exports = injectionMiddleware;

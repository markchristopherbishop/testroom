(function() {
  window.testroom = window.testroom || {};
  window.testroom.loadDelayedScripts = function () {
    var scripts = document.querySelectorAll('script[data-delayed-script]');
    if (scripts && scripts.length > 0) {
      for (var index = 0; index < scripts.length; ++index) {
        const existingScript = scripts[index];
        var newScript = document.createElement('script');
        newScript.setAttribute('src', existingScript.getAttribute('data-delayed-script'));
        existingScript.replaceWith(newScript);
      }
    }
  };
})();

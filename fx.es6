var app = require('app').default
var Plugin = require('plugin').default;

app.register('.sticky', function (view) {

  var top = view.css('top');

  view.on('scroll', function() {

    if (view.rect().top <= top) {
      view.css({
        position: 'fixed',
        left: view.rect().left,
      });
    }

  });
});


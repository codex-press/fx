import app from 'app';


app.register('.sticky', view => {

  var top = view.css('top');

  view.on('scroll', () => {

    if (view.rect().top <= top) {
      view.css({
        position: 'fixed',
        left: view.rect().left,
      });
    }

  });

});


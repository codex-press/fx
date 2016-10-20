import article from 'article';
import Plugin from 'plugin';


article.register('.onscreen', class Onscreen extends Plugin {

  constructor(args) {
    super(args);
    this.removeClass('onscreen');
    this.bind({
      onscreen: rect => {
        if (article.hasState('focus'))
          this.addClass('onscreen');
      },
      offscreen: rect => this.removeClass('onscreen'),
    });

    article.on('focus', () => {
      this.removeClass('onscreen');
      let rect = this.rect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0)
        this.addClass('onscreen');
    });

  }

});

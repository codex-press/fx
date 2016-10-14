import article from 'article';
import Plugin from 'plugin';


article.register('.onscreen', class Onscreen extends Plugin {

  constructor(args) {
    super(args);
    this.removeClass('onscreen');
    this.bind({
      onscreen: rect => this.addClass('onscreen'),
      offscreen: rect => this.removeClass('onscreen'),
    });
  }

});

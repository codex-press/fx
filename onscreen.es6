import article from 'article';
import Plugin  from 'plugin';

article.register('.onscreen', class Onscreen extends Plugin {

  initialize() {
    this.removeClass('onscreen');
  }

  onscreen() {
    this.addClass('onscreen');
  }

  offscreen() {
    this.removeClass('onscreen');
  }

});

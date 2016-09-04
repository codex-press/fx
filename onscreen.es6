import app    from 'app';
import Plugin from 'plugin';

app.register('.onscreen', class Onscreen extends Plugin {

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

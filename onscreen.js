import { article } from '/app/index.js';
import Plugin from '/app/src/plugin.js'

article.register('.onscreen', class Onscreen extends Plugin {

  constructor(args) {
    super(args);
    this.bind({onscreen: 'onscreen', offscreen: 'offscreen'});
    this.removeClass('onscreen');
  }

  onscreen(rect) {
    this.addClass('onscreen');
  }

  offscreen(rect) {
    this.removeClass('onscreen');
  }

});

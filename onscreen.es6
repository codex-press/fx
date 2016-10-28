import article from 'article';
import Plugin from 'plugin';


article.register('.onscreen', class Onscreen extends Plugin {

  constructor(args) {
    super(args);
    this.bind({
      onscreen: 'onscreen',
      offscreen: 'offscreen',
    });
    this.bind({focus: 'focus'}, article);
  }


  onscreen(rect) {
    if (article.hasState('focus'))
      this.addClass('onscreen');
  }


  offscreen(rect) {
    this.removeClass('onscreen');
  }


  focus() {

    if (!this.is('.onscreen'))
      return;

    this.removeClass('onscreen');
    // trigger reflow
    void this.el.offsetHeight;
    let rect = this.rect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0)
      this.addClass('onscreen');
  }

});

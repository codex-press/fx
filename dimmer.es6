import Plugin from 'plugin';
import article from 'article';
import dom from 'dom';

// window.dom = dom;

article.register('.dimmer', class Dimmer extends Plugin {

  constructor(args) {
    super(args);

    this.mask = dom.create('<div class=dimmer-mask></div>')
    this.insertAfter(this.mask);
    this.setMask = dom.setCSS(this.mask, 'opacity');

    // window.dimmer = this;

    this.resize();
    this.bind({ offscreen: 'render', scroll: 'render', });
  }


  remove() {
    dom(this.mask).remove();
    super.remove();
  }


  resize(rect = this.rect()) {
    dom.setCSS(this.mask, {height: 4 * window.innerHeight});
    dom.setTransform(this.mask, {
      y: -(rect.height/2 + 2 * window.innerHeight)
    });
  }


  render(rect = this.rect()) {

    // when the target is near the bottom of the screen, the mask
    // starts fading in
    let topFadeStart = window.innerHeight;
    let topFadeEnd = (window.innerHeight / 2) + (rect.height / 2);

    // when the el is near the top of the screen, the blackness is 
    // fading out
    let bottomFadeStart = (window.innerHeight / 2) - (rect.height / 2);
    let bottomFadeEnd = 0;

    let y = rect.centerY;

    let fadeLength = (window.innerHeight / 2) - (rect.height / 2);

    // console.log({topFadeStart,topFadeEnd,bottomFadeStart,bottomFadeEnd,y,});

    // ---- (topFadeStart)
    //
    // fade in the mask
    //
    // ---- (topFadeEnd)
    // XXX
    // XXX target / this.el
    // XXX
    // ---- (bottomFadeStart)
    //
    // fade out the mask
    //
    // --- (bottomFadeEnd)

    // target is near the *bottom* of screen, fade in
    if (y < topFadeStart && y > topFadeEnd)
      this.setMask( -(y - topFadeStart) / fadeLength);
    // middle of screen is within the target, it has full blackness
    else if (y <= topFadeEnd && y >= bottomFadeStart)
      this.setMask(1);
    // target is near the *top* of the screen, fade out
    else if (y < bottomFadeStart && y > bottomFadeEnd)
      this.setMask(y / fadeLength);
    // not close, so no blackness
    else
      this.setMask(0);
  }

});


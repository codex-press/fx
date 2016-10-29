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

    if (this.is('.background')) {
      let bg = dom(document.documentElement).css('background-color');
      dom.setCSS(this.mask, 'background-color', bg);
    }

    // window.dimmer = this;

    this.bind({ offscreen: 'render', scroll: 'render', });
  }


  remove() {
    dom(this.mask).remove();
    super.remove();
  }


  render(rect = this.rect()) {

    let tight = this.is('.tight');

    let fadeLength;
    if (tight)
      fadeLength = rect.height / 2;
    else
      fadeLength = (window.innerHeight - rect.height) / 2;

    let middle = window.innerHeight / 2;

    // when the target is near the bottom of the screen, the mask
    // starts fading in

    // when the el is near the top of the screen, the blackness is 
    // fading out
    let bottomFadeStart, bottomFadeEnd, topFadeStart, topFadeEnd;
    if (tight) {
      topFadeStart = middle + fadeLength;
      topFadeEnd = middle;
      bottomFadeStart = middle;
      bottomFadeEnd = middle - fadeLength;
    }
    // the non-tight one starts when middle of it hits the screen
    else {
      topFadeStart = window.innerHeight;
      // ends when the top of the target hits the middle of the screen
      topFadeEnd = middle + rect.height/2;
      // i.e. here when the object is centered. there's no transparency for it
      // now fade out:
      bottomFadeStart = middle - rect.height/2;
      bottomFadeEnd = 0;
    }

    let y = rect.centerY;

    // target is near the *bottom* of screen, fade in
    if (y < topFadeStart && y > topFadeEnd)
      this.setMask((topFadeStart - y) / fadeLength);
    // middle of screen is within the target, it has full blackness
    else if (y <= topFadeEnd && y >= bottomFadeStart)
      this.setMask(1);
    // target is near the *top* of the screen, fade out
    else if (y < bottomFadeStart && y > bottomFadeEnd)
      this.setMask((y - bottomFadeEnd) / fadeLength);
    // not close, so no blackness
    else
      this.setMask(0);

    // console.log({opacity: dom(this.mask).getCSS('opacity'), fadeLength, topFadeStart,topFadeEnd,bottomFadeStart,bottomFadeEnd,y,middle});
  }

});


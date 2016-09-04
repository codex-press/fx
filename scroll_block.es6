import log          from 'log';
import dom          from 'dom';

import Plugin       from './plugin';

var events = {
  onscreen: 'fix',
  offscreen: 'unfix'
};


article.register('.scroll-block', class FigureBlockScroller extends Plugin {

  constructor(content) {
    super();
    this.content = content;
    this.hook(events, content);
    this.cropCSS = dom.setCSS(content.find('.crop'));

    this.shim = dom.create('<div class=shim></div>');
    this.insertAfter(this.shim);
    window.plugin = this;

    // give the shim height
    var shimHeight = (
      this.find('.block').scrollHeight + (this.find('.block').clientHeight/2)
    );
    dom.style(this.shim, {height: shimHeight + 'px'});

    // push the block down a bit, the same as its height
    // TODO could do this as 
    dom.style(this.find('.block'),{transform: 'translateY(100%)'});
  }


  remove() {
    dom.remove(this.shim);
  }


  fix() {
    if (this.rect().top < 0)
      this.cropCSS({position: 'fixed', top: '0px'});
    else
      this.cropCSS({position: '', top: ''});
  }


  unfix() {
    this.cropCSS({position: '', top: ''});
  }

});


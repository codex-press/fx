import article from 'article';
import dom, {DomWrapper} from 'dom';
import log from 'log';
import './lib/polyfill.js';

let stickies = [];


class Sticky extends DomWrapper() {

  constructor(el) {
    super();
    this.el = el;
    this.shim = document.createElement('div');
    this.insertBefore(this.shim);
    this.resize();
  }


  resize() {
    //console.log('resize');
    this.state = undefined;
    this.css({position: '', top: '', left: ''});
    this.style = this.css('top right bottom left marginTop marginLeft');
    let shimStyles =  this.css('float clear width height marginTop marginRight marginBottom marginLeft');
    dom.css(this.shim, shimStyles);
    this.scroll();
  }


  scroll() {
    let parent = dom(this.parent());
    let isTop = dom(this.shim).rect().top > this.style.top;
    let isBottom = (
      parent.rect().bottom - this.style.bottom
      < this.outerHeight() + this.style.top
    );
    let isFixed = !isTop && !isBottom;

    if (isTop && this.state !== 'top')
      this.stickTop();
    else if (isBottom && this.state != 'bottom')
      this.stickBottom();
    else if (isFixed && this.state != 'fixed')
      this.stickFixed();
  }


  stickFixed() {
    // log('fixed', this);
    this.state = 'fixed';
    this.css({
      position: 'fixed',
      top: this.style.top,
      height: this.el.offsetHeight,
      left: this.el.offsetLeft - this.style.marginLeft,
    });
  }


  stickTop() {
    // log('top', this);
    this.state = 'top';
    this.css({
      position: 'absolute',
      top: this.shim.offsetTop,
      height: this.shim.offsetHeight,
      left: this.shim.offsetLeft - this.style.marginLeft,
    });
  }


  stickBottom() {
    // log('bottom', this);
    this.state = 'bottom';
    let parent = this.parent();
    let top;
    top = parent.offsetHeight - this.outerHeight() - this.style.bottom;
    if (this.shim.offsetParent !== parent)
      top += parent.offsetTop;
    this.css({
      position: 'absolute',
      top,
      height: this.el.offsetHeight,
      left: this.el.offsetLeft - this.style.marginLeft,
    });
  }


  remove() {
    log('removed',this.el);
    this.css({position: '', top: '', left: ''});
    dom(this.shim).remove();
  }

}


article.ready.then(() => {

  let test = document.createElement('div');

  test.style.position = 'sticky';
  if (test.style.position === 'sticky')
    return;

  test.style.position = `-${dom.prefix}-sticky`;
  if (test.style.position === `-${dom.prefix}-sticky`)
    return;

  // log('polyfilling position:sticky');

  Polyfill({declarations: ['position:sticky']})
  .doMatched(rules => rules.each(r => {
    // console.log(r);
    stickies = stickies.concat(
      dom(r.getSelectors()).map(el => new Sticky(el))
    );
  }))
  .undoUnmatched(rules => rules.each(r => {
    stickies = stickies.reduce((list, s) => {
      if (s.is(r.getSelectors()))
        s.remove();
      else
        list.push(s);
      return list;
    }, []);
  }));

  article.on('scroll', () => stickies.map(s => s.scroll()));
  article.on('resize', () => stickies.map(s => s.resize()));
});


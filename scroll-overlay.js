import article from '/app/article.js';
import Plugin from '/app/plugin.js';
import dom from '/app/dom.js';

article.register('.scroll-overlay', class ScrollOverlay extends Plugin {

  constructor(args) {
    super(args);

    if (this.props.type === 'Video') {
      this.container = this.el;
      return;
    }

    this.overlay = this.first('[x-cp-overlay]');
    this.height = Math.max(this.el.clientHeight,
      this.overlay.scrollHeight
      + this.el.clientHeight
    );

    // wrap this in another layer that will be for positioning this
    this.container = dom.create('<div>');
    dom(this.container).css({height: this.height, position: 'relative'});
    this.insertAfter(this.container);
    dom(this.container).append(this.el);

    this.canvas = dom.create('<canvas>');
    this.canvas.style.position = 'absolute';
    this.append(this.canvas);
    let img = this.first('img.full');

    if (img.complete)
      article.ready.then(() => this.drawCanvas());
    else
      dom.once(img, 'load', () => this.drawCanvas());

    this.bind({
      offscreen: 'scroll',
      scroll: 'scroll',
    });
  }


  drawCanvas() {
    this.canvas.height = this.el.clientHeight;
    this.canvas.width = this.el.clientWidth;

    let context = this.canvas.getContext('2d');

    let img = this.first('img.full');

    let d = dom.css(img, 'width top left');
    let scale = d.width / img.naturalWidth;
    let top = -d.top * scale;
    let left = -d.left * scale;

    context.drawImage(
      img,
      left,
      top,
      img.naturalWidth - left,
      img.naturalHeight - top,
      0,
      0, 
      this.canvas.width,
      this.canvas.height
    );

    context.globalCompositeOperation = 'destination-in';

    let pos = dom(this.overlay).css('top left width height');

    // this is bad news
    if (pos.top === 'auto')
      return;

    let h = this.canvas.height;
    let gradient = context.createLinearGradient(0, 0, 0, h);
    let gap = this.css('line-height');
    if (gap === 'normal')
      gap = this.em() * 1.14;

    gradient.addColorStop( (pos.top - gap) / h, 'black');
    gradient.addColorStop( (pos.top + 2*gap) / h, 'transparent');
    gradient.addColorStop( (pos.top + pos.height - 2*gap) / h, 'transparent');
    gradient.addColorStop( (pos.top + pos.height + gap) / h, 'black');

    context.fillStyle = gradient;
    context.fillRect(0, 0, this.canvas.width, h);

    dom(this.overlay).css({overflow: 'visible'})
  }

  rect() {
    return dom.rect(this.container);
  }

  fix() {
    this.select('.crop, canvas').css({position: 'fixed', top: 0});
  }
  
  unfixTop() {
    this.select('.crop, canvas').css({position: '', top: ''});
  }

  unfixBottom() {
    let top = this.height - this.el.clientHeight;
    this.select('.crop, canvas').css({position: '', top});
  }

  scroll(rect) {
    let y = -1 * rect.top;
    if (y < 0)
      this.unfixTop();
    else if (y < this.height - this.el.clientHeight)
      this.fix();
    else
      this.unfixBottom();
  }

});



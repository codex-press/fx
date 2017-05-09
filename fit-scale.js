import article from '/app/article.js';
import dom from '/app/dom.js';
import Plugin from '/app/plugin.js';

window.dom = dom;

article.register('.scale-to-parent', class Scale extends Plugin {

  constructor(args) {
    super(args);
    this.bind({resize: 'resize'});
    this.css({position: 'absolute', top: '50%', left: '50%'});
    article.plugins.ready.then(() => this.resize());
  }

  resize() {
    this.setTransform({});
    let scale = 1;
    let rect = this.rect();
    let parentRect = this.parentW().rect();
    let hScale = parentRect.height / rect.height;
    let wScale = parentRect.width / rect.width;
    this.setTransform({
      x: '-50%',
      y: '-50%',
      scale: .95 * Math.min(hScale, wScale)
    });
  }

});

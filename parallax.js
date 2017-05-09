import Plugin from '/app/plugin.js';
import article from '/app/article.js';
import dom from '/app/dom.js';
import animate from '/app/animate.js';

window.dom = dom;

article.register('.parallax', class Parallax extends Plugin {

  constructor(args) {
    super(args);

    console.log(this);
    this.style = {y: 0};
    this.bind({ offscreen: 'render', scroll: 'render', resize: 'render', });
  }

  render(rect = this.rect()) {

    let pos = rect.top - this.style.y;
    // let wHeight = window.innerHeight * .3;
    // let wHeight = window.innerHeight * .3;

    if (pos < 0) { //  && pos > -wHeight) {
      // console.log(this.el, pos, this.style.y);
      // this.style.y = -pos;
      // this.style.y = -pos * .3;

      // let wHeight = window.innerHeight * .3;
      // this.style.y = animate.cubicOut(0, wHeight, -1 * pos / window.innerHeight);
      // console.log(this.index(), this.style.y);

      // // moving up 15%
      // // fading out
      // opacity: cp.easing.easeInQuint(time, 1, -0.35, 1),
      // // moving backward

      let time = -1 * pos / window.innerHeight;
      let slide = animate.circOut(0, window.innerHeight * .3);
      this.style.y = slide(time);
      let fade = animate.quintIn(1, 0.2);
      //console.log(this.index(), pos, fade(time));
      // this.css({opacity: fade(time)});
      // cp.easing.easeOutCirc(time, 0, this.height * -0.1, 2),
      // opacity: cp.easing.easeInQuint(time, 1, -0.35, 1),

    }

    this.setTransform(this.style);
    // let y = this.rect()
    // this.style.y
  }

});


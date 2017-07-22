import { article, Plugin } from '/app/index.js';

class Stagger extends Plugin {

  constructor(args) {
    super(args);
    let classes = this.el.className.split(' ');
    let speed = classes.find(c => /^stagger-/.test(c)).slice(8);
    console.log(this, speed);
  }

};


article.register(
  '[class*=" stagger-"], [class^="stagger-"]',
  Stagger
);


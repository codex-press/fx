import article from 'article';
import Plugin from 'plugin';

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


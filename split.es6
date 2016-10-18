import article from 'article';
import Plugin from 'plugin';

class Split extends Plugin {

  constructor(args) {
    super(args);
    let classes = this.el.className.split(' ');
    let delimiter = classes.find(c => /^split-/.test(c)).slice(6);
    console.log(this, delimiter);
  }

};

article.register('[class*=" split-"], [class^="split-"]', Split);


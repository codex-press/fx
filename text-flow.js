import { dom, article } from '/app/index.js';
import Plugin from '/app/src/plugin.js'

article.register('.flow-source', class Flow extends Plugin {

  constructor(args) {
    super(args);
    this.css({display: 'none'});
    this.targets = dom('.flow-target');
    this.reflow();
  }

  reflow() {

    let isOverflowing = target => {
      //console.log(target, target.scrollHeight,' > ',target.clientHeight);
      return target.scrollHeight > target.clientHeight;

      // this one is maybe better but doesn't work with columns:
 
      // var range = document.createRange();
      // range.selectNodeContents(target);
      // var contentRect = range.getBoundingClientRect();
      // var targetRect = dom(target).rect();

      // console.log(
      //   contentRect.height,' > ',targetRect.height,' || ',
      //   contentRect.width,' > ',targetRect.width
      // );

      // if (target.className === 'root-snakes flow-target')
      //   return false;

      // return (
      //   contentRect.height > targetRect.height ||
      //   contentRect.width > targetRect.width
      // );
    }

    let clones = this.children().map(el => el.cloneNode(true));

    this.targets.find(target => {

      while (clones.length > 0) {
        dom(target).append(clones[0]);
        if (isOverflowing(target)) {
          dom(clones[0]).remove();
          break;
        }
        else {
          clones.shift(); 
        }
      }

      return clones.length === 0;
    });

  }

});


import article from 'article';
import dom from 'dom';

// inspired by Typeset.js
// https://blot.im/typeset/

let replace = function(old, nu) {
  if (nu instanceof Node)
    old.parentNode.replaceChild(nu, old);
  else if (typeof nu === 'string') {
    let temp = document.createElement('div');
    temp.innerHTML = nu;
    let frag = document.createDocumentFragment();
    let child;
    while (child = temp.firstChild) {
      frag.appendChild(child);
    }
    old.parentNode.replaceChild(frag, old);
  }
};

        let meh=0;

article.ready.then(() => {
  let time = performance.now();

  dom('p').map(el => {

    let first = true;
    dom.textNodes(el).map(n => {
      let index = (
        n.textContent.indexOf('‘') >= 0 ||
        n.textContent.indexOf('“') >= 0
      );

      if (index >= 0) {

        let html = n.textContent.replace(/“/g, (match, offset, string) => {
          if (first && /^\s*“/.test(string))
            return '<span class=pull-double>“</span>';
          else
            return '<span class=push-double></span> <span class=pull-double>“</span>';
        });

        html = html.replace(/‘/g, (match, offset, string) => {
          if (first && /^\s*‘/.test(string))
            return '<span class=pull-single>‘</span>';
          else
            return '<span class=push-single></span> <span class=pull-single>‘</span>';
        });

        replace(n, html);
      }

      if (/[^\s]/.test(n.textContent))
        first = false;

    });

    // adding non-breaking space between two last words to prevent widowed 
    // words
    dom.textNodes(el).reverse().find(n => {
      if (/[^\s]\s[^\s]/.test(n.textContent)) {
        n.textContent = n.textContent.replace(/(.*)\s([^\s])/, '$1\u00A0$2');
        return true;
      }
    });

  });

  // console.log(`time to run: ${ Math.round(performance.now() - time) }ms`);
});


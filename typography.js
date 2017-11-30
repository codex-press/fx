import { dom, article } from '/app/index.js';

// inspired by Typeset.js
// https://blot.im/typeset/

let replace = function(old, nu) {
  if (nu instanceof Node)
    old.parentNode.replaceChild(nu, old);
  else if (typeof nu === 'string') {
    var frag = document.createDocumentFragment();
    let temp = document.createElement('div');
    temp.innerHTML = nu;
    let child;
    while (child = temp.firstChild) {
      frag.appendChild(child);
    }
    old.parentNode.replaceChild(frag, old);
  }
};

let s = (klas, chr) => `<span class=${klas}>${chr}</span>`;

article.ready.then(() => {
  let time = performance.now();

  dom('p').map(el => {

    let first = true;
    dom.textNodes(el).map(n => {
      let needsPush = (
        n.textContent.indexOf('‘') >= 0 ||
        n.textContent.indexOf('“') >= 0
      );

      if (needsPush) {
        let html = n.textContent;

        html = html.replace(/(^|\s)(“‘|‘“)/g, (m, p1, p2, offset, string) => {
          if (first && /^\s*$/.test(string.slice(0, offset)))
            return s('pull-triple', p2);
          else if (/\s/.test(string.slice(offset - 1, offset)))
            return s('push-triple','') + ' ' + s('pull-double', p2);
        });

        html = html.replace(/(^|\s)“/g, (m, p1, offset, string) => {
          if (first && /^\s*$/.test(string.slice(0, offset)))
            return s('pull-double','“');
          else
            return s('push-double','') + ' ' + s('pull-double','“')
        });

        html = html.replace(/(^|\s)‘/g, (m, p1, offset, string) => {
          if (first && /^\s*$/.test(string.slice(0, offset)))
            return s('pull-single','‘');
          else
            return s('push-single','') + ' ' + s('pull-single','‘')
        });

        replace(n, html);
      }

      if (/[^\s]/.test(n.textContent))
        first = false;

    });

    // adding non-breaking space between two last words to prevent 
    // single-word lines (widowed words)
    dom.textNodes(el).reverse().find(n => {
      if (/[^\s]\s[^\s]/.test(n.textContent)) {
        n.textContent = n.textContent.replace(/(.*)\s([^\s])/, '$1\u00A0$2');
        return true;
      }
    });

  });

  // console.log(`time to run: ${ Math.round(performance.now() - time) }ms`);
});


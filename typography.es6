import article from 'article';
import dom from 'dom';

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
    // temp.innerHTML = arg;
    // let newNodes = temp.childNodes;
    // node.insertAdjacentHTML('afterend', arg);
    // node.parentNode.removeChild(node);
  }
  // else if (arg instanceof Array) {
  //   arg.forEach(n => node.)
  // }
};


article.ready.then(() => {
  let time = performance.now();

  dom('p').map(el => {

    let first = true;
    dom.textNodes(el).map(n => {
      let index = n.textContent.indexOf('‘');

      if (index >= 0) {
        let html = n.textContent.replace(/‘/g, (match, offset, string) => {
          //console.log(`meh: "${string.slice(0,offset)}"`);
          if (first && /^\s*‘/.test(string.slice(0,offset)))
            return '<span class=push-single></span> <span class=pull-single>‘</span>';
          else
            return '<span class=pull-single>‘</span>';
        });
        // n.parentNode.innerHTML = html;
        console.log(n, html);
        replace(n, html);
      }

      if (/[^\s]/.test(n.textContent))
        first = false;

    });
  });

  console.log(`time to run: ${ Math.round(performance.now() - time) }ms`);
});


import article from 'article';
import dom from 'dom';

import './lib/polyfill.js';
import Hypher from 'hypher';
import english from 'hyphenation.en-us';

let hypher = new Hypher(english);


article.ready.then(() => {

  // no need
  if (dom.cssSupports('hyphens'))
    return;

  Polyfill({declarations: ['hyphens:auto']})
  .doMatched(rules => rules.each(r => {
    dom(r.getSelectors()).map(el => {
      dom.textNodes(el).map(n => {
        n.textContent = hypher.hyphenateText(n.textContent);
      });
    });
  }));

});


import { dom, article, Plugin } from '/app/index.js';

// N.B. for .split-lines this completely resets contents after a resize so
// might cause compatibility issues with other plugins
export class Split extends Plugin {

  constructor(args) {
    super(args);

    let classes = this.el.className.split(' ');
    this.delimiter = classes.find(c => /^split-/.test(c)).slice(6);

    // line breaks can change on resize
    if (this.delimiter === 'lines') {
      this.originalHTML = this.el.innerHTML;
      this.bind({resize: 'resize'});
    }

    // split(this.el, this.delimiter)
    setTimeout(() => split(this.el, this.delimiter), 100);
  }

  resize() {
    this.el.innerHTML = this.originalHTML;
    split(this.el, this.delimiter);
  }

};

article.register('[class*=" split-"], [class^="split-"]', Split);

export default function split(el, delimiter) {

  if (delimiter === 'words') {
    dom.textNodes(el).forEach(text => {
      let pos = text.data.search(/\w[\s-]/);
      while (pos >= 0) {
        let remaining = text.splitText(pos + 1);
        let word = dom.create('<span class=word>');
        text.parentNode.insertBefore(word, text);
        word.appendChild(text);
        text = remaining
        pos = text.data.search(/[\s-]/);
      }
    });
  }
  else if (delimiter === 'lines') {

    let range = document.createRange();

    let moreThanOneLine = () => {
      let rects = range.getClientRects();
      if (rects.length === 1)
        return false;
      else {
        let last = rects[rects.length - 1];
        return rects[0].bottom < last.top;
      }
    }

    let makeLine = () => {
      if (!/[^\s]/.test(range.toString()))
        return;
      let line = dom.create('<span class=line>');
      //console.log('line created', line, range.toString());
      line.appendChild(range.extractContents());
      range.insertNode(line)
      range.collapse();
    }

    // gets called recusively for every block element
    let splitBlockElement = el => {
      range.setStart(el, 0);

      Array.from(el.childNodes).forEach((node, i) => {

        if (node instanceof Element &&
            dom(node).css('display') === 'block') {
          splitBlockElement(node);
          range.setEnd(el, i);
          range.collapse();
        }
        else {

          // called recursively for all inline elements and text nodes
          let splitNode = node => {

            // it's an element, so recurse with childNodes
            if (node.nodeType === 1)
              Array.from(node.childNodes).forEach(splitNode);
            // text node, where real work gets done
            else if (node.nodeType === 3) {
              let re = /[^\s]($|[\s-])/g;
              let lastPos = 0;
              let result;
              while (result = re.exec(node.data)) {
                let pos = Math.min(node.data.length, result.index + 1);
                range.setEnd(node, pos); 

                if (moreThanOneLine()) {
                  range.setEnd(node, lastPos); 
                  makeLine();
                  re.lastIndex = 0;
                }
                lastPos = pos;
              }
            }
          };

          splitNode(node);
        }

      });

      // finish existing line
      makeLine();
    };

    splitBlockElement(el);
  }

}

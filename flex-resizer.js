import { dom, article } from '/app/index.js';
import Plugin from '/app/src/plugin.js'

let readoutHTML = `
  <div class=flex-readout>
    <div class=mobile></div>
    <div class=tablet></div>
    <div class=laptop></div>
    <div class=desktop></div>
    <div class=screen-size></div>
  </div>
`;

let options = [
  [450,      'mobile'],
  [800,      'tablet'],
  [1100,     'laptop'],
  [Infinity, 'desktop'],
];


article.register('.flex:not(.static)', class ResizableFlex extends Plugin {

  constructor(args) {
    super(args);

    // wrap the thing to apply the @media classes on the parent so the
    // responsiveness happens
    this.wrap = dom.create('<div class=wrapper>');
    this.insertAfter(this.wrap);
    this.wrap.appendChild(this.el);

    // dotted thing on the right to resize it
    let handle = dom.create('<div class=flex-handle>');
    this.append(handle);
    if (this.is('.show-readout')) {
      this.readout = dom.create(readoutHTML);
      dom(this.readout).bind({
        'click div': e => this.setBreakpoint(e.target.className)
      });
      this.insertAfter(this.readout);
      this.updateReadout();
    }

    // hook events for drag handle
    this.bind({mousedown: 'startDrag'}, handle);
    this.drag = this.drag.bind(this);
    this.endDrag = this.endDrag.bind(this);

    // bind resize event
    this.bind({resize: 'resize'});
  }


  resize(rect) {
    this.updateReadout(rect.width);
    if (rect.width > this.parentW().rect().width)
      this.css({width: ''});
  }


  setBreakpoint(breakpointName) {
    let width = options.find(([w, name]) => name == breakpointName)[0] - 1;
    if (width > this.parentW().rect().width)
      this.css({width: ''});
    else
      this.css({width});

    this.updateReadout();

    // 'mobile tablet laptop desktop'.split(' ').forEach(c =>
    //   dom(this.wrap).removeClass(c)
    // );
    // dom(this.wrap).addClass(breakpointName);
  }


  updateReadout(width = this.rect().width) {
    if (!this.readout)
      return;

    if (window.innerWidth > 950)
      dom(this.readout).select('.screen-size').css({width: width * 0.4});
    else
      dom(this.readout).select('.screen-size').css({width: width * 0.15});

    'mobile tablet laptop desktop'.split(' ').forEach(c =>
      dom(this.wrap).removeClass(c)
    );

    options.find(([breakpoint, name]) => {
      if (breakpoint > width) {
        dom(this.wrap).addClass(name);
        return true;
      }
    });
  }


  startDrag(e) {
    if (e.which == 1) {
      dom(document).on('mousemove', this.drag);
      dom(document).once('mouseup', this.endDrag);
    }
  }


  drag(e) {
    // This keeps the selection from happening
    e.preventDefault();
    let width = Math.max(300, e.clientX - this.rect().left);
    this.css({width});
    this.updateReadout(width);
  }


  endDrag(e) {
    dom(document).off('mousemove', this.drag);
  }

});


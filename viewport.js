import { registerDecorator, Decorator } from './decorators.js';

registerDecorator('.in-viewport', class InViewport extends Decorator {

  constructor(el) {
    super(el)
    this.dom.removeClass('in-viewport')
    this.observer = new IntersectionObserver(this.callback.bind(this), { })
    this.observer.observe(this.el)
  }


  remove() {
    super.remove()
    this.dom.addClass('in-viewport')
    this.observer.disconnect()
  }


  callback(entries) {
    entries.map(e => {
      if (e.isIntersecting)
        this.dom.addClass('in-viewport')
      else
        this.dom.removeClass('in-viewport')
    })
  }

})


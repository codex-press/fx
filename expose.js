import { article } from '/app/index.js';
import Plugin from '/app/src/plugin.js'


article.register('.fx-expose', class FXExpose extends Plugin {

  constructor(args) {
    super(args)
    this.button = document.createElement('div')
    this.el.parentNode.insertBefore(this.button, this.el)
    this.button.addEventListener('click', () => this.toggle())
    this.button.classList.add('expose-button')
    this.button.innerHTML = 'Read More'
    this.el.style.height = '0px'
  }


  toggle() {
    if (this.button.classList.contains('open')) {
      this.button.classList.remove('open')
      this.button.innerHTML = 'Read More'
      this.el.style.transition = 'height 0.3s ease-out'
      this.el.style.height = '0px'
      this.expanded = false
    }
    else {
      this.button.innerHTML = 'Read Less'
      this.button.classList.add('open')
      this.el.style.transition = ''
      this.el.style.height = 'auto'
      let height = this.el.clientHeight
      this.el.style.height = '0px'
      void this.el.clientHeight
      this.el.style.transition = 'height 1s ease-out'
      this.el.style.height = height + 'px'
      this.expanded = true
    }
  }

})



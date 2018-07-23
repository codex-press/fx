import { article } from '/app/index.js';
import Plugin from '/app/src/plugin.js'


article.register('.fx-expose', class FXExpose extends Plugin {

  constructor(args) {
    super(args)
    this.button = document.createElement('div')
    this.el.parentNode.insertBefore(this.button, this.el)
    this.button.addEventListener('click', () => this.toggle())
    this.button.innerHTML = '<p class="expose-button">Read More</p>'
    this.el.style.height = '0px'
    this.expanded = false
  }


  toggle() {
    if (this.expanded) {
      this.el.style.transition = 'height 0.3s ease-out'
      this.el.style.height = '0px'
      this.expanded = false
    }
    else {
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



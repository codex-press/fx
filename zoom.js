

class Zoom extends HTMLElement {

  constructor() {
    super()
  }


  connectedCallback() {
    const img = this.children[0]
    if (img.complete) setup()
    else img.addEventListener('load', e => this.setup())
  }


  disconnectedCallback() {

  }


  setup() {
    const img = this.children[0]
    this.style.paddingTop = Math.round(img.naturalHeight / img.naturalWidth * 1000)/10 + '%'
    img.style.position = 'absolute'
    img.style.top = 0
    img.style.transform = 'scale(1.5)'
    console.log(img)
  }


}


window.customElements.define('fx-zoom', Zoom)



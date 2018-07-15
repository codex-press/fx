

class Overlay extends HTMLElement {

  constructor() {
    super()
  }


  connectedCallback() {
    console.log('hi', this.children)
  }


  disconnectedCallback() {

  }

}


window.customElements.define('fx-overlay', Overlay)



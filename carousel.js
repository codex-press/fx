/*

js animations for slide - easing functions

play and pause functions

look into other constructors, etc


*/


class FXCarousel extends HTMLElement {


  constructor() {
    super() 
    this._slideIndex = 0
    this._loop = false
    this._arrow = 'carot'
  }


  connectedCallback() {
    this.attachShadow({ mode: 'open' })

    this.shadowRoot.innerHTML = `
      <style>

        :host {
          display: block;
          overflow: hidden;
        }

        .strip {
          position: relative;
          display: flex;
          flex-flow: row nowrap;
          transition: transform 0.3s ease-out;
        }

        ::slotted(*) {
          flex: 0 0 100%;
          margin: 0;
        }

        .previous-slide, .next-slide {
          display: flex;
          position: absolute;
          z-index: 10;
          width: 100px;
          height: 100%;
          align-items: center;
          cursor: pointer;
        }

        .next-slide {
          right: 0;
        }

      </style>

      <div class="previous-slide">
        <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" fill="#fff"></path></svg>
      </div>

      <div class="next-slide">
        <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" fill="#fff"></path></svg>
      </div>

      <div class="strip">
        <slot></slot>
      </div>
    `

    this.shadowRoot
      .querySelector('.previous-slide')
      .addEventListener('click', event => this.goToPrevious())

    this.shadowRoot
      .querySelector('.next-slide')
      .addEventListener('click', event => this.goToNext())

    this._init()
  }

  _init() {
    // check for loop
    const carousel = document.querySelector('fx-carousel')
    if (carousel.hasAttributes()) {
      const attrs = carousel.attributes
      const output = []
      for(let i = attrs.length - 1; i >= 0; i--) {
        // if loop or loop="true" is in attributes
        // then set loop to true
        if(
          attrs[i].name === 'loop' ||
          (attrs[i].name === 'loop' && attrs[i].value === true)
        ) this._loop = true
        // otherwise set to false
        else this._loop = false

        output.push(attrs[i])
      }
      console.log(output)
    }
  }


  get slideIndex() {
    return this._slideIndex
  }


  set slideIndex(value) {
    if (!Number.isInteger(value))
      throw TypeError('slideIndex must be an integer')
    value = Math.max(0, Math.min(value, this.children.length - 1))
    this._slideIndex = value
    const strip = this.shadowRoot.querySelector('.strip')
    if (value === 0)
      strip.style.transform = 'translateX(0)'
    else
      strip.style.transform = `translateX(-${ value }00%)`
  }


  goToNext() {
    if (this._loop && this.slideIndex === this.children.length - 1)
      this.slideIndex = 0 
    else this.slideIndex += 1
  }


  goToPrevious() {
    if (this._loop && this.slideIndex === 0)
      this.slideIndex = this.children.length - 1
    else this.slideIndex -= 1
  }


}


customElements.define('fx-carousel', FXCarousel)


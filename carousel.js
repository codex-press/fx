/*
<fx-carousel>
attributes:
1. height
2. img paths

* shadow dom
* slot for all the images
* next and prev buttons
* div that holds all of 

*/

customElements.define('fx-carousel', class extends HTMLElement {
  constructor () {
    super()

    var fxCarousel = document.createElement('template')
    var prevArrow = document.createElement('div')
    prevArrow.setAttribute('class', 'fx-carousel-previous')
    var leftArrow = document.createElement('span')
    var centerSection = document.createElement('slot')
    centerSection.setAttribute('name', 'current-image')
    var nextArrow = document.createElement('div')
    prevArrow.setAttribute('class', 'fx-carousel-next')
    var rightArrow = document.createElement('span')

    // set arrow svg
    leftArrow.innerHTML = '<svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" fill="#fff"/></svg>'
    rightArrow.innerHTML = '<svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" fill="#fff"/></svg>'

    // shadow root style
    const style = document.createElement('style')
    style.textContent = `
      template {
        display: inherit;
        height: 500px;
      }
    `

    // set first image
    let sliderImages = this.querySelectorAll('fx-carousel img')
    centerSection.innerHTML = sliderImages[0].outerHTML

    // shadow root
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(style)
    shadowRoot.appendChild(fxCarousel)
    fxCarousel.appendChild(prevArrow)
    prevArrow.appendChild(leftArrow)
    fxCarousel.appendChild(centerSection)
    fxCarousel.appendChild(nextArrow)
    nextArrow.appendChild(rightArrow)

    console.log(this)
  }
  
  connectedCallback () {

  }
})

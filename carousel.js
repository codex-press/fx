/*
cases

flex-container for images, not display-none

js animations for slide - easing functions

play and pause functions

look into other constructors, etc


*/

class FxCarousel extends HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    this.totalSlideWidth = 0
    this.currentSlideLocation = 0

  }

  connectedCallback() {

    this.shadowRoot.innerHTML = `
      <div class="image-strip">
        <slot></slot>
      </div>
      <div class="prev-slide">
        <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" fill="#fff"/></svg>
      </div>
      <div class="next-slide">
        <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" fill="#fff"/></svg>      
      </div>
    `

    // shadow root style
    const style = document.createElement('style')

    this.sliderImages = Array.from(document.querySelectorAll('fx-carousel img'))

    this.sliderImages.forEach(img => {

      setTimeout(() => {
        this.totalSlideWidth += img.clientWidth

        style.textContent += `
          .image-strip {
            display: flex;
            transform: translate(${((this.totalSlideWidth - this.sliderImages[0].clientWidth) / 2)}px);
            transition: transform .5s ease-out;
          }
        `
      }, 10)
    })

    style.textContent = `
      :host {
        display: flex;
        position: relative;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        align-content: center;
        padding: 1em;
        margin: 0 auto;
        overflow: hidden;
      }

      ::slotted(img) {
        display: flex;
        box-shadow: 5px 5px 7px 0 rgba(94,47,59,0.2);
        z-index: 1;
      }

      .prev-slide, .next-slide {
        display: flex;
        position: absolute;
        z-index: 10;
      }

      .prev-slide {
        left: 0%;
        top: 0%;
        padding-left: -3em;
        width: 49%;
        height: 100%;
        align-items: center;
      }

      .next-slide {
        top: 0%;
        left: 50%;
        padding-right: -3em;
        width: 49%;
        height: 100%;
        align-items: center;
        justify-content: flex-end;
      }
    `

    this.shadowRoot.appendChild(style)

    this.previousSlide = this.shadowRoot.querySelector('.prev-slide')
    this.nextSlide = this.shadowRoot.querySelector('.next-slide')
    this.slotImages = this.shadowRoot.querySelector('.image-strip')
    this.fxCarousel = document.querySelector('fx-carousel')

    this.previousSlide.addEventListener('click', () => this.previousSlideShift())
    this.nextSlide.addEventListener('click', () => this.nextSlideShift())

    this.hideSlides(this.currentSlideLocation)
  }

  hideSlides(selectedSlide) {
    setTimeout(() => {
      let slideWidth = this.sliderImages[this.currentSlideLocation].clientWidth
      this.fxCarousel.style.maxWidth = `${slideWidth}px`
    }, 10)

    if (this.currentSlideLocation >= this.sliderImages.length - 1) this.nextSlide.style.visibility = 'hidden'
    else this.nextSlide.style.visibility = 'visible'

    if (this.currentSlideLocation < 1) this.previousSlide.style.visibility = 'hidden'
    else this.previousSlide.style.visibility = 'visible'
  }

  nextSlideShift() {
    this.currentSlideLocation++
    let nextSlideWidth = this.sliderImages[this.currentSlideLocation].clientWidth

    this.fxCarousel.style.maxWidth = `${nextSlideWidth}px`

    let values = window.getComputedStyle(this.slotImages).getPropertyValue('transform')
        values = values.split(')')[0]
        values = values.split(', ')

    var translateValue = parseInt(values[4])

    this.slotImages.style.transform = `translate(${translateValue - nextSlideWidth}px)`

    this.hideSlides(this.currentSlideLocation)
  }

  previousSlideShift() {
    this.currentSlideLocation--
    let nextSlideWidth = this.sliderImages[this.currentSlideLocation].clientWidth
    console.log('nSW', nextSlideWidth)

    let values = window.getComputedStyle(this.slotImages).getPropertyValue('transform')
        values = values.split(')')[0]
        values = values.split(', ')

    var translateValue = parseInt(values[4])

    this.slotImages.style.transform = `translate(${translateValue + nextSlideWidth}px)`

    this.hideSlides(this.currentSlideLocation) 
  }

}

customElements.define('fx-carousel', FxCarousel)

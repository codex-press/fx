/*
cases

half page for prev - next

flex-container for images, not display-none

js animations for slide - easing functions

play and pause functions

look into other constructors, etc


*/

class FxCarousel extends HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    this.currentSlide = 0
    
  }

  connectedCallback() {

    this.shadowRoot.innerHTML = `
      <div class="fx-carousel-holder">
        <div class="prev-slide">
          <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" fill="#fff"/></svg>
        </div>
        <slot></slot>
        <div class="next-slide">
          <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" fill="#fff"/></svg>      
        </div>
      </div>
    `

    // shadow root style
    const style = document.createElement('style')

    style.textContent = `
      .fx-carousel-holder {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        align-content: center;
        height: 600px;
      }

      img {
        width: 500px;
      }

      .prev-slide, .next-slide {

      }

      .prev-slide svg, .next-slide svg {
        
      }
    `

    this.shadowRoot.appendChild(style)

    this.previousSlide = this.shadowRoot.querySelector('.prev-slide')
    this.nextSlide = this.shadowRoot.querySelector('.next-slide')
    this.sliderImages = Array.from(document.querySelectorAll('fx-carousel img'))

    this.previousSlide.addEventListener('click', () => this.changeSlides('prevSlide'))
    this.nextSlide.addEventListener('click', () => this.changeSlides('nextSlide'))

    this.hideSlides(this.currentSlide)
  }

  // get nextSlide() {
  //   this.changeSlides('nextSlide')
  // }

  // get previousSlide() {
  //   this.changeSlides('prevSlide')
  // }

  hideSlides(selectedSlide) {

    this.sliderImages.forEach(img => {
      if (img !== this.sliderImages[selectedSlide]) img.style.display = 'none'
      else img.style.display = 'flex'
    })

    this.nextSlide.style.display = 'inherit'
    this.previousSlide.style.display = 'inherit'

    if (this.currentSlide >= sliderImages.length - 1) nextSlide.style.display = 'none'
    if (this.currentSlide <= 0) previousSlide.style.display = 'none'
  }

  changeSlides(eventName) {
    if (eventName === 'nextSlide') {
      this.currentSlide++
      this.hideSlides(this.currentSlide)
    } else if (eventName === 'prevSlide') {
      this.currentSlide--
      this.hideSlides(this.currentSlide)
    } else {
      console.warn('Error with carousel selection')
    }
  }

}

customElements.define('fx-carousel', FxCarousel)

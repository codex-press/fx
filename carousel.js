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

    const shadowRoot = this.attachShadow({mode: 'open'})

    const fxCarousel = document.createElement('div')
    fxCarousel.setAttribute('class', 'fx-carousel-holder')
    fxCarousel.innerHTML = `
      <div class="prevSlide">
        <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" fill="#fff"/></svg>
      </div>
      <slot></slot>
      <div class="nextSlide">
        <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" fill="#fff"/></svg>      
      </div>
    `

    let sliderImages = this.querySelectorAll('fx-carousel img')

    // shadow root style
    const style = document.createElement('style')
    style.textContent = `
      .fx-carousel-holder {
        display: inline-flex;
      }

      .fx-carousel-holder img {
        width: 100%;
      }

      .prevSlide, .nextSlide {
        position: relative;
      }

      .prevSlide svg, .nextSlide svg {
        position: absolute;
        top: 50%;
        bottom: 50%;
        transform: translate(-50%, -50%)
      }
    `

    shadowRoot.appendChild(fxCarousel)
    shadowRoot.appendChild(style)

    let currentSlide = 0

    function hideSlides(selectedSlide) {
      sliderImages.forEach(img => {
        if (img !== sliderImages[selectedSlide]) img.style.display = 'none'
        else img.style.display = 'flex'
      })

      nextSlide.style.display = 'inherit'
      previousSlide.style.display = 'inherit'
      console.log(currentSlide, sliderImages.length)
      if (currentSlide >= sliderImages.length - 1) nextSlide.style.display = 'none'
      if (currentSlide <= 0) previousSlide.style.display = 'none'
    }

    function changeSlides(eventName) {
      if (eventName === 'nextSlide') {
        currentSlide++
        hideSlides(currentSlide)
      } else if (eventName === 'prevSlide') {
        currentSlide--
        hideSlides(currentSlide)
      } else {
        console.warn('Error with carousel selection')
      }
    }

    let previousSlide = this.shadowRoot.querySelector('.prevSlide')
    previousSlide.addEventListener('click', () => changeSlides('prevSlide'))

    let nextSlide = this.shadowRoot.querySelector('.nextSlide')
    nextSlide.addEventListener('click', () => changeSlides('nextSlide'))

    hideSlides(currentSlide)
  }
})

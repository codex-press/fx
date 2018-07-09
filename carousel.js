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

customElements.define('fx-carousel', class FxCarousel extends HTMLElement {
  constructor () {
    super()
    // shadow root
    const shadow = this.attachShadow({mode: 'open'})

    // create spans
    const wrapper = document.createElement('span')
    wrapper.setAttribute('class', 'wrapper')

    // assign height attribute to varible
    const carouselHeight = this.getAttribute('height')

    // current image
    let imgArray = Array.from(document.querySelectorAll('fx-carousel img'))
    console.log(imgArray)

    // set styles
    let style = document.createElement('style')
    style.textContent = `
      .wrapper { width: 100vw; }
      .wrapper img { width: 100vh; }
    `


    console.log(this)

    // append children to shadow root
    shadow.appendChild(style)
    shadow.appendChild(wrapper)
    imgArray.forEach(img => {
      wrapper.appendChild(img)
    })
  }
  
  // connectedCallback () {
  //   this.innerHTML = `<div>${}</div`
  // }
})

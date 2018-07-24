/* @jsx NotReact.createElement */
import * as animate from '/parent/core/animate.js'
import Snabbdom from '/parent/lib/snabbdom.js'
import NotReact from './lib/snabbdom-pragma.js'


class FXCarousel extends HTMLElement {

  constructor() {
    super() 
    this._slideIndex = 0
    this._slidePosition = 0
    this._loop = false
    this._hidePrevious = true
    this._hideNext = false
    this.goToNext = this.goToNext.bind(this)
    this.goToPrevious = this.goToPrevious.bind(this)
    this.saveSlidePositions = this.saveSlidePositions.bind(this)
    this.isButtonHidden = this.isButtonHidden.bind(this)
    window.addEventListener('resize', () => {
      this.saveSlidePositions()
      this.renderSlides()
    })
  }


  connectedCallback() {
    this.attachShadow({ mode: 'open' })
    this.vnode = document.createElement('div')
    this.shadowRoot.appendChild(this.vnode)
    this.render()
    this.saveSlidePositions()
    this.renderSlides()
  }


  render() {
    this.vnode = Snabbdom.patch(
      this.vnode,
      <div>
        <link
          rel="stylesheet"
          href="/fx/carousel.css"
          on-load={ this.saveSlidePositions }
        />

        <div
          class={{
            'previous-slide': true,
            'hidden-button': this.isButtonHidden('previous')
          }}
          on-click={ this.goToPrevious }
        >
          { this.previousButton() }
        </div>

        <div
          class={{
            'next-slide': true,
            'hidden-button': this.isButtonHidden('next') }}
          on-click={ this.goToNext }
        >
          { this.nextButton() }
        </div>

        <div className="strip">
          <slot></slot>
        </div>
      </div>
    )
  }


  static get observedAttributes() {
    return ['button', 'loop']
  }


  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'loop' && (newValue || newValue === '')) {
      this._loop = true
      this._hidePrevious = false
      this._hideNext = false
    }
    this.render()
  }


  isButtonHidden(value) {
    if (value === 'previous')
      return this._hidePrevious
    else if (value === 'next')
      return this._hideNext
    else 
      throw TypeError('button value must be left or right')
  }


  get loop() {
    return this._loop
  }


  set loop(value) {
    this._loop = value
  }


  get button() {
    return this.getAttribute('button')
  }


  set button(value) {
    this.setAttribute('button', value)
  }


  get slideIndex() {
    return this._slideIndex
  }


  set slideIndex(value) {
    if (!Number.isInteger(value))
      throw TypeError('slideIndex must be an integer')
    this._slideIndex = Math.max(0, Math.min(value, this.children.length - 1))
    const ease = animate.cubicOut(this._slidePosition, this._slideIndex)
    const duration = 300
    const tick = time => {
      this._slidePosition = ease(time)
      this.renderSlides()
    }
    if (this._timer)
      this._timer.cancel()
    this._timer = animate.timer({ duration, tick })
  }


  saveSlidePositions() {
    const thisLeft = this.getBoundingClientRect().left
    this._slidePositions = Array.from(this.children).map(slide => {
      slide.style.transform = 'none'
      const left = slide.getBoundingClientRect().left - thisLeft
      slide.style.transform = ''
      return left
    })
  }


  renderSlides() {
    const width = this.clientWidth
    const pos = this._slidePosition - Math.floor(this._slidePosition)
    Array.from(this.children).forEach((slide, index) => {
      const left = this._slidePositions[index]
      if (index == this._slidePosition)
        slide.style.transform = `translateX(${ -left }px)`
      else if (index == Math.floor(this._slidePosition))
        slide.style.transform = `translateX(${ - Math.round(pos * width) - left }px)`
      else if (index == Math.ceil(this._slidePosition))
        slide.style.transform = `translateX(${ width - Math.round(pos * width) - left }px)`
      else
        slide.style.transform = 'translateX(100vw)'
    })
  }


  previousButton() {
    switch (this.button) {

      case 'circle':
        return <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1037 1395l102-102q19-19 19-45t-19-45l-307-307 307-307q19-19 19-45t-19-45l-102-102q-19-19-45-19t-45 19l-454 454q-19 19-19 45t19 45l454 454q19 19 45 19t45-19zm627-499q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"></path></svg>

      case 'arrow':
        return <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z"></path></svg>

      case 'triangle':
        return <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z"></path></svg>

      default:
        return <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" fill="#fff"></path></svg>

    }
  }


  nextButton() {
    switch (this.button) {

      case 'circle':
        return <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1037 1395l102-102q19-19 19-45t-19-45l-307-307 307-307q19-19 19-45t-19-45l-102-102q-19-19-45-19t-45 19l-454 454q-19 19-19 45t19 45l454 454q19 19 45 19t45-19zm627-499q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"></path></svg>

      case 'arrow':
        return <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z"></path></svg>

      case 'triangle':
        return <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293h-704q-52 0-84.5-37.5t-32.5-90.5v-128q0-53 32.5-90.5t84.5-37.5h704l-293-294q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z"/></svg>

      default:
        return <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" fill="#fff"></path></svg>

    }  
  }


  goToNext() {
    let startNext = this._hideNext

    if (this.loop && this.slideIndex === this.children.length - 1) {
      this.slideIndex = 0
      this._hideNext = false
    } else if (!this.loop && this.slideIndex === this.children.length - 2) {
      this.slideIndex += 1
      this._hideNext = true
    } else {
      this.slideIndex += 1
      this._hideNext = false
    }

    if (startNext !== this._hideNext) {
      this.render()
    }

    if (this._hidePrevious === true) {
      this._hidePrevious = false
      this.render()
    }
  }


  goToPrevious() {
    let startPrevious = this._hidePrevious

    if (this.loop && this.slideIndex === 0) {
      this.slideIndex = this.children.length - 1
      this._hidePrevious = false
    } else if (!this.loop && this.slideIndex === 1) {
      this.slideIndex -= 1
      this._hidePrevious = true
    } else {
      this.slideIndex -= 1
      this._hidePrevious = false
    }

    if (startPrevious !== this._hidePrevious) {
      this.render()
    }

    if (this._hideNext === true) {
      this._hideNext = false
      this.render()
    }
  }


}


customElements.define('fx-carousel', FXCarousel)



/* @jsx NotReact.createElement */
import * as animate from '/parent/core/animate.js'
import Snabbdom from '/parent/lib/snabbdom.js'
import NotReact from './lib/snabbdom-pragma.js'
import { arrows, indicators } from './carousel-svgs.js'


class FXCarousel extends HTMLElement {

  constructor() {
    super()
    this._slideIndex = 0
    this._slidePosition = 0
    this._loop = false
    this.goToNext = this.goToNext.bind(this)
    this.goToPrevious = this.goToPrevious.bind(this)
    // this.goToSlide = this.goToSlide.bind(this, i)
    this.saveSlidePositions = this.saveSlidePositions.bind(this)
    window.addEventListener('resize', () => {
      this.saveSlidePositions()
      this.renderSlides()
    })
    this.attachShadow({ mode: 'open' })
    this.vnode = document.createElement('div')
    this.shadowRoot.appendChild(this.vnode)
    this.render()
  }


  connectedCallback() {
    this.saveSlidePositions()
    this.renderSlides()
  }


  render() {
    
    const previousArrow = (
      arrows[this.getAttribute('button') + '_previous'] ||
      arrows['caret_previous']
    )

    const nextArrow = (
      arrows[this.getAttribute('button') + '_next'] ||
      arrows['caret_next']
    )

    const activeIndicator = (
      indicators[this.getAttribute('indicator') + '_active'] ||
      indicators['circles_active']
    )

    const inactiveIndicator = (
      indicators[this.getAttribute('indicator') + '_inactive'] ||
      indicators['circles_inactive']
    )

    this.vnode = Snabbdom.patch(
      this.vnode,
      <div>
        <link
          rel="stylesheet"
          href="/fx/carousel.css"
          on-load={ this.saveSlidePositions }
        />

        { (this.slideIndex > 0 || this.loop) &&
          <div className="previous-slide" on-click={ this.goToPrevious }>
            <div props-innerHTML={ previousArrow } />
          </div>
        }

        { (this.slideIndex < this.children.length - 1 || this.loop) &&
          <div className="next-slide" on-click={ this.goToNext }>
            <div props-innerHTML={ nextArrow } />
          </div>
        }

        <div className="slide-indicator">
          { Array.from(this.children).map((el, i) => 
              i === this.slideIndex ?
              <div props-innerHTML={ activeIndicator } /> :
              <div
                props-innerHTML={ inactiveIndicator }
                on-click={ this.goToSlide.bind(this, i) }
              />
            )
          }
        </div>

        <div className="strip">
          <slot></slot>
        </div>
      </div>
    )

  }


  static get observedAttributes() {
    return ['button', 'loop', 'indicator']
  }


  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'loop' && (newValue || newValue === '')) {
      this._loop = true
    }
    this.render()
  }


  get loop() {
    return this._loop
  }


  set loop(value) {
    this._loop = value
  }


  get indicator() {
    return this.getAttribute('indicator')
  }


  set indicator(value) {
    this.setAttribute('indicator', value)
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
    console.log('sI', this._slideIndex)
    if (this._slideIndex === 0 || this.children.length - 1)
      this.render()
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


  goToNext() {
    if (this.slideIndex === this.children.length - 1 && !this.loop)
      return
    this.slideIndex === this.children.length - 1
      ? this.slideIndex = 0
      : this.slideIndex += 1
  }


  goToPrevious() {
    if (this.slideIndex === 0 && !this.loop)
      return
    this.slideIndex === 0
      ? this.slideIndex = this.children.length - 1
      : this.slideIndex -= 1
  }

  goToSlide(index) {
    this.slideIndex = index
  }

}


customElements.define('fx-carousel', FXCarousel)



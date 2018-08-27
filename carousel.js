/* @jsx NotReact.createElement */
import * as animate from '/parent/core/animate.js'
import Snabbdom from './lib/snabbdom.js'
import NotReact from './lib/snabbdom-pragma.js'
import { arrows, indicators } from './carousel-icons.js'
import { debounce } from '/app/src/utility.js'

const INDICATORS = [ 'circles', 'dashes', 'rings', 'plus' ]
const DEFAULT_INDICATOR = 'circles'

const BUTTONS = [ 'caret', 'circle', 'arrow', 'circle-arrow' ]
const DEFAULT_BUTTON = 'caret'

const WHEEL_DELAY = 300

class FXCarousel extends HTMLElement {

  constructor() {
    super()

    this.goToNext = this.goToNext.bind(this)
    this.goToPrevious = this.goToPrevious.bind(this)
    this._render = this._render.bind(this)
    this._saveSlideOffsets = this._saveSlideOffsets.bind(this)
    this._wheelScroll = this._wheelScroll.bind(this)

    this._slideIndex = 0
    this._position = 0
    this._initialPosition = undefined
    this._initialClientX = undefined
    this._lastClientX = undefined
    this._lastDeltaX = undefined
    this._initialClientY = undefined
    this._lastClientY = undefined
    this._scrollClientX = 0
    this._initialScroll = 0
    this._positionChange = 0
    this._wheelEnd = debounce(
      WHEEL_DELAY, event => { this._wheelScroll(event) }
    )

    window.addEventListener('resize', this._saveSlideOffsets)
    this.addEventListener('touchstart', this._onTouchStart)
    this.addEventListener('touchmove', this._onTouchMove)
    this.addEventListener('touchend', this._onTouchEnd)
    this.addEventListener('touchcancel', this._onTouchEnd)
    this.addEventListener('wheel', this._onWheelEvent)
    this.addEventListener('keydown', this._onKeyboardEvent)

    this.attachShadow({ mode: 'open' })
    this._vnode = document.createElement('div')
    this.shadowRoot.appendChild(this._vnode)
    this._render()
  }


  connectedCallback() {
    this._saveSlideOffsets()
  }


  static get observedAttributes() {
    return [ 'button', 'loop', 'indicator' ]
  }


  attributeChangedCallback(name, oldValue, newValue) {
    this._render()
  }


  get loop() {
    return this.hasAttribute('loop')
  }


  set loop(value) {
    if (value)
      this.setAttribute('loop', '')
    else
      this.removeAttribute('loop')
  }


  get indicator() {
    const value = this.getAttribute('indicator')
    return INDICATORS.includes(value) ? value : DEFAULT_INDICATOR
  }


  set indicator(value) {
    value = INDICATORS.includes(value) ? value : DEFAULT_INDICATOR
    this.setAttribute('indicator', value)
  }


  get button() {
    const value = this.getAttribute('button')
    return BUTTONS.includes(value) ? value : DEFAULT_BUTTON
  }


  set button(value) {
    value = BUTTONS.includes(value) ? value : DEFAULT_BUTTON
    this.setAttribute('button', value)
  }


  get slideIndex() {
    return this._slideIndex
  }


  set slideIndex(value) {
    if (!Number.isInteger(value))
      throw TypeError('slideIndex must be an integer')
    value  = Math.max(0, Math.min(value, this.children.length - 1))
    if (value === this._slideIndex)
      return
    this._slideIndex = value
    this._render() // renders everything except the slides
    const ease = animate.cubicOut(this._position, this._slideIndex)
    const duration = 300
    const tick = time => {
      this._position = ease(time)
      this._renderSlides()
    }
    if (this._timer)
      this._timer.cancel()
    this._timer = animate.timer({ duration, tick })
  }


  goToNext() {
    if (this.slideIndex === this.children.length - 1 && this.loop)
      this.slideIndex = 0
    else
      this.slideIndex += 1
  }


  goToPrevious() {
    if (this.slideIndex === 0 && this.loop)
      this.slideIndex = this.children.length - 1
    else
      this.slideIndex -= 1
  }


  _onKeyboardEvent(event) {
    if(event.key === 'RightArrow') this.slideIndex =+ 1
    if(event.key === 'LeftArrow') this.slideIndex =- 1
  }


  _wheelScroll(event) {
    let angle = Math.abs(Math.atan2(event.deltaY, event.deltaX))

    let isX = (angle < 30 * Math.PI/180 || angle > 150 * Math.PI/180)

    if (isX) {
      event.preventDefault()
      let slideScroll = (
        this._scrollClientX / this.clientWidth > 0 ?
          Math.ceil(this._scrollClientX / this.clientWidth) :
          Math.floor(this._scrollClientX / this.clientWidth)
      )
      const newIndex = this.slideIndex + slideScroll

      if(newIndex > this.children.length - 1) {
        this.slideIndex = this.children.length - 1
        this._position = this.children.length - 1
      } else if(newIndex < 0) {
        this.slideIndex = 0
        this._position = 0
      }
      else
        this.slideIndex = newIndex
      this._renderSlides()
    }

    this._scrollClientX = 0
  }


  _onWheelEvent(event) {
    // this is a scroll by lines (firefox w/ a real wheel)
    if (event.deltaMode === 1) {
      event.deltaX *= 24;
      event.deltaY *= 24;
    }

    this._scrollClientX += event.deltaX
    this._positionChange += event.deltaX / this.clientWidth
    this._position += event.deltaX / this.clientWidth
    this._renderSlides()
    this._wheelEnd(event)
  }


  _onTouchStart(event) {
    this._initialPosition = this._position
    this._initialClientX = event.touches[0].clientX
    this._lastClientX = event.touches[0].clientX
    this._initialClientY = event.touches[0].clientY
  }


  _onTouchMove(event) {
    const deltaX = this._lastClientX - event.touches[0].clientX
    this._position += deltaX / this.clientWidth
    this._lastClientY = event.touches[0].clientY
    if (Math.abs(this._lastClientY - this._initialClientY) > 80) {
      this._position = this._initialPosition
      this._renderSlides()
      return
    }
    this._renderSlides()
    this._lastClientX = event.touches[0].clientX
    this._lastDeltaX = deltaX
  }


  _onTouchEnd(event) {
    if (Math.abs(this._lastClientY - this._initialClientY) > 100)
      return

    if (Math.abs(this._lastClientX - this._initialClientX) < 50) {
      this._position = this._initialPosition
      this._renderSlides()
      return
    }

    if(!this.loop && this.slideIndex !== (0 || this.children.length - 1))
      this.slideIndex = this._lastDeltaX > 0 ?
          Math.ceil(this._position) :
          Math.floor(this._position)
    else
      this._position = this._initialPosition
      this._renderSlides()
  }


  _render() {
    const { loop, button, indicator, slideIndex, children } = this
    const previousIcon = arrows[button + 'Previous']
    const nextIcon = arrows[button + 'Next']
    const activeIcon = indicators[indicator + 'Active']
    const inactiveIcon = indicators[indicator + 'Inactive']

    this._vnode = Snabbdom.patch(
      this._vnode,
      <div>

        <link
          rel="stylesheet"
          href="/fx/carousel.css"
          on-load={ this._saveSlideOffsets }
        />

        <div
          className="previous-slide"
          hidden={ !loop && slideIndex === 0 }
          on-click={ this.goToPrevious }
          props-innerHTML={ previousIcon }
        />

        <div
          className="next-slide"
          hidden={ !loop && slideIndex === children.length - 1 }
          on-click={ this.goToNext }
          props-innerHTML={ nextIcon }
        />

        <div className="slide-indicator">
          { Array.from(children).map((el, i) => 
            <div
              on-click={ () => this.slideIndex = i }
              props-innerHTML={ i === slideIndex ? activeIcon : inactiveIcon }
            />)
          }
        </div>

        <div className="strip">
          <slot on-slotchange={ this._render }></slot>
        </div>

      </div>
    )
    
  }


  _saveSlideOffsets() {
    this._slideOffsets = Array.from(this.children)
      .map(slide => Math.max(0, slide.offsetLeft))
    this._renderSlides()
  }


  _renderSlides() {
    const width = this.clientWidth
    const pos = this._position - Math.floor(this._position)
    Array.from(this.children).forEach((slide, index) => {
      const left = this._slideOffsets[index]
      let x
      if (index == this._position)
        x = - left + 'px'
      else if (index == Math.floor(this._position))
        x = - Math.round(pos * width) - left + 'px'
      else if (index == Math.ceil(this._position))
        x = width - Math.round(pos * width) - left + 'px'
      else
        x = '100vw'
      slide.style.transform = `translateX(${ x })`
    })
  }


}


customElements.define('fx-carousel', FXCarousel)



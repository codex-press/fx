/* @jsx NotReact.createElement */
import * as animate from '/parent/core/animate.js'
import Snabbdom from './lib/snabbdom.js'
import NotReact from './lib/snabbdom-pragma.js'
import icons from './icons/index.js'
import { debounce } from '/app/src/utility.js'
import { assetOrigin } from '/app/src/env.js'
import * as env from '/app/src/env.js'

export const INDICATOR_TYPES = [ 'circle', 'dash' ]
const DEFAULT_INDICATOR = 'circle'

export const BUTTON_TYPES = [ 'caret', 'arrow', 'hand' ]
const DEFAULT_BUTTON = 'caret'


class FXCarousel extends HTMLElement {

  constructor() {
    super()

    this.goToNext = this.goToNext.bind(this)
    this.goToPrevious = this.goToPrevious.bind(this)
    this._render = this._render.bind(this)
    this._saveSlideOffsets = this._saveSlideOffsets.bind(this)
    this._onWheelEnd = debounce(400, this._onWheelEnd, this)
    this._onKeyDown = this._onKeyDown.bind(this)
    this._onSlotChange = this._onSlotChange.bind(this)

    this._position = 0
    this._slideIndex = 0

    this._lastClientX = undefined
    this._lastClientY = undefined
    this._lastDeltaX = undefined
    this._touchThresholdMet = false

    window.addEventListener('resize', this._saveSlideOffsets)
    this.addEventListener('touchstart', this._onTouchStart)
    this.addEventListener('touchmove', this._onTouchMove)
    this.addEventListener('touchend', this._onTouchEnd)
    this.addEventListener('touchcancel', this._onTouchEnd)
    this.addEventListener('wheel', this._onWheel)

    this.attachShadow({ mode: 'open' })
    this._vnode = document.createElement('div')
    this.shadowRoot.appendChild(this._vnode)
    this._render()
  
    const observerCallback = entries => entries.forEach(entry =>
      entry.isIntersecting ?
        document.addEventListener('keydown', this._onKeyDown) :
        document.removeEventListener('keydown', this._onKeyDown)
    )
    new IntersectionObserver(observerCallback).observe(this)

  }


  connectedCallback() {
    this._saveSlideOffsets()
  }


  static get observedAttributes() {
    return [ 'buttons', 'loop', 'indicators' ]
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


  get indicators() {
    const value = this.getAttribute('indicators')
    return INDICATOR_TYPES.includes(value) ? value : DEFAULT_INDICATOR
  }


  set indicators(value) {
    value = INDICATOR_TYPES.includes(value) ? value : DEFAULT_INDICATOR
    this.setAttribute('indicators', value)
  }


  get buttons() {
    const value = this.getAttribute('buttons')
    return BUTTON_TYPES.includes(value) ? value : DEFAULT_BUTTON
  }


  set buttons(value) {
    value = BUTTON_TYPES.includes(value) ? value : DEFAULT_BUTTON
    this.setAttribute('buttons', value)
  }


  get slideIndex() {
    return this._slideIndex
  }


  set slideIndex(value) {
    if (!Number.isInteger(value))
      throw TypeError('slideIndex must be an integer')

    value  = clamp(value, 0, this.children.length - 1)
    this._slideIndex = value
    this._render()

    // animate the slide positions
    if (value === this._position) return
    const ease = animate.cubicOut(this._position, value)
    if (this._timer && this._timer.active) this._timer.cancel()
    this._timer = animate.timer({
      duration: 300,
      tick: time => {
        this._position = ease(time)
        this._renderSlides()
      },
      done: this._render,
    })
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


  _onKeyDown(event) {
    if (event.key === 'ArrowRight') this.slideIndex += 1
    if (event.key === 'ArrowLeft') this.slideIndex -= 1
  }


  _onWheel(event) {
    if (this._timer && this._timer.active) this._timer.cancel()

    let { deltaX, deltaY } = event

    // this is a scroll by lines (firefox w/ a real wheel)
    if (event.deltaMode === 1) {
      deltaX *= 24;
      deltaY *= 24;
    }

    if (isX(deltaX, deltaY)) {
      event.preventDefault()
      let positionMultiplier = 1
      this._position += deltaX / this.clientWidth
      this._lastDeltaX = deltaX
      this._renderSlides()
      this._onWheelEnd()
    }
  }


  _onWheelEnd() {
    this.slideIndex = this._lastDeltaX > 0 ?
        Math.ceil(this._position) :
        Math.floor(this._position)
  }


  _onTouchStart(event) {
    if (this._timer && this._timer.active) this._timer.cancel()
    this._lastClientX = event.touches[0].clientX
    this._lastClientY = event.touches[0].clientY
    this._touchThresholdMet = false
  }


  _onTouchMove(event) {
    const deltaX = this._lastClientX - event.touches[0].clientX
    const deltaY = this._lastClientY - event.touches[0].clientY

    this._touchThresholdMet = this._touchThresholdMet || Math.abs(deltaX) > 10
    if (!this._touchThresholdMet) return
    
    if (isX(deltaX, deltaY)) {
      event.preventDefault()
      this._position += deltaX / this.clientWidth
      this._renderSlides()
    }

    this._lastClientX = event.touches[0].clientX
    this._lastClientY = event.touches[0].clientY
    this._lastDeltaX = deltaX
  }


  _onTouchEnd(event) {
    if (!this._touchThresholdMet) return
    this.slideIndex = this._lastDeltaX > 0 ?
        Math.ceil(this._position) :
        Math.floor(this._position)
  }


  _onSlotChange(event) {
    this._render()
    this._saveSlideOffsets() 
  }


  _render() {
    const { loop, buttons, indicators, slideIndex, children } = this
    const previousIcon = icons[buttons + '-left']
    const nextIcon = icons[buttons + '-right']
    const indicatorIcon = icons[indicators]

    this._vnode = Snabbdom.patch(
      this._vnode,
      <div>

        <link
          rel="stylesheet"
          href={ assetOrigin + '/fx/carousel.shadow.css' }
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
              class-active={ this.slideIndex === i }
              on-click={ () => this.slideIndex = i }
              props-innerHTML={ indicatorIcon }
            />)
          }
        </div>

        <div className="strip">
          <slot on-slotchange={ this._onSlotChange }></slot>
        </div>

      </div>
    )
    
  }


  _saveSlideOffsets() {
    this._slideOffsets = Array.from(this.children).map(s => s.offsetLeft)
    this._slideWidths = Array.from(this.children).map(s => s.clientWidth)
    this._renderSlides()
  }


  _renderSlides() {
    const width = this.clientWidth
    this._position = clamp(this._position, 0, this.children.length - 1)
    const pos = this._position - Math.floor(this._position)
    Array.from(this.children).forEach((slide, index) => {
      const offset = (width - this._slideWidths[index]) / 2
      const left = this._slideOffsets[index] - offset
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



function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function isX(dX, dY) {
  const angle = Math.abs(Math.atan2(dY, dX))
  return angle < 30 * Math.PI/180 || angle > 150 * Math.PI/180
}

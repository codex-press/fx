/* @jsx NotReact.createElement */


/*

js animations for slide - easing functions

play and pause functions

look into other constructors, etc


*/
// this._leftButton = `<svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" fill="#fff"></path></svg>`
//     this._rightButton = `<svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" fill="#fff"></path></svg>`


import Snabbdom from '/parent/lib/snabbdom.js'
import NotReact from './lib/snabbdom-pragma.js'

class FXCarousel extends HTMLElement {


  constructor() {
    super() 
    this._slideIndex = 0
    this._loop = false
    this._arrow = 'carot'
  }


  connectedCallback() {
    this.attachShadow({ mode: 'open' })
    this.vnode = document.createElement('div')
    this.shadowRoot.appendChild(this.vnode)
    this.render()
  }


  render() {
    Snabbdom.patch(
      this.vnode,
      <div>
        <link rel="stylesheet" href="/fx/carousel.css" />

        <div className="previous-slide" on-click={this.goToPrevious}>
          { this.previousButton() }
        </div>

        <div className="next-slide" on-click={this.goToNext}>
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
    if (name === 'loop' && (newValue || newValue === ''))
      this.loop = true
    this.render()
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
    value = Math.max(0, Math.min(value, this.children.length - 1))
    this._slideIndex = value
    const strip = this.shadowRoot.querySelector('.strip')
    if (value === 0)
      strip.style.transform = 'translateX(0)'
    else
      strip.style.transform = `translateX(-${ value }00%)`
  }


  previousButton() {
    const value = this.button
    switch(value) {
      case 'circle':
        return <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1037 1395l102-102q19-19 19-45t-19-45l-307-307 307-307q19-19 19-45t-19-45l-102-102q-19-19-45-19t-45 19l-454 454q-19 19-19 45t19 45l454 454q19 19 45 19t45-19zm627-499q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"></path></svg>
        break
      case 'arrow':
        return <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z"></path></svg>
        break
      case 'triangle':
        return <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z"></path></svg>
        break
      default:
        return <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" fill="#fff"></path></svg>
        break
    }
  }


  nextButton() {
    const value = this.button
    switch(value) {
      case 'circle':
        return <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1037 1395l102-102q19-19 19-45t-19-45l-307-307 307-307q19-19 19-45t-19-45l-102-102q-19-19-45-19t-45 19l-454 454q-19 19-19 45t19 45l454 454q19 19 45 19t45-19zm627-499q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"></path></svg>
        break
      case 'arrow':
        return <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z"></path></svg>
        break
      case 'triangle':
        return <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293h-704q-52 0-84.5-37.5t-32.5-90.5v-128q0-53 32.5-90.5t84.5-37.5h704l-293-294q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z"/></svg>
        break
      default:
        return <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" fill="#fff"></path></svg>
        break
    }  
  }


  goToNext() {
    if (this.loop && this.slideIndex === this.children.length - 1)
      this.slideIndex = 0 
    else
      this.slideIndex += 1
  }


  goToPrevious() {
    if (this.loop && this.slideIndex === 0)
      this.slideIndex = this.children.length - 1
    else
      this.slideIndex -= 1
  }


  get loop() {
    return this._loop
  }


  set loop(value) {
    this._loop = value
  }


}


customElements.define('fx-carousel', FXCarousel)



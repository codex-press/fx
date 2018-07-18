import { dom, env, article } from '/app/index.js';
import Plugin from '/app/src/plugin.js'
import * as Kaleidoscope from './lib/kaleidoscope.js';

// must request devicemotion events from the parent frame
window.top.postMessage({ event: 'requestDeviceMotion' }, '*')
window.addEventListener('message', event => {
  if (event.data.event == 'parentReady')
    window.top.postMessage({ event: 'requestDeviceMotion' }, '*')
})



article.register('.spherical-video', class SphericalVideo extends Plugin {

  constructor(args) {
    super(args)

    window.addEventListener('resize', () => this.resize())
    this.el.addEventListener('mousedown', event => this.mousedown(event))
    this.el.addEventListener('mouseup', event => this.mouseup(event))
    this.el.addEventListener(
      'touchmove',
      event => event.preventDefault(),
      { passive : false }
    )

    this.videoElem = this.el.children[0]
    this.videoElem.mute = true
    this.videoElem.style.display = 'none'

    this.playButton = document.createElement('div')
    this.playButton.setAttribute('class', 'play-button')
    this.playButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path d="M3.4 16.14V2.52a.8.8 0 0 1 1.2-.69l11.78 6.8 11.82 6.82a.8.8 0 0 1 0 1.39l-11.8 6.8-11.8 6.8a.8.8 0 0 1-1.2-.69z"/>
      </svg>
      <svg class="spherical-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 91.4 64.2">
        <path d="M87.6,20c0-0.1,0-0.3,0-0.4c0,0,0,0,0,0c0-0.1,0-0.2,0-0.3C87.3,11.3,69.3,5,46.7,5c-23,0-41,6.4-41,14.6 c0,0.1,0,0.3,0,0.4v26c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0.2,0,0.3,0,0.5c0,5.3,7.5,10,20.1,12.6c0.1,0,0.1,0,0.2,0 c0.5,0,0.9-0.3,1-0.8c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.1V35.9c5.8-1.1,12.5-1.8,19.6-1.8c7.2,0,13.9,0.7,19.8,1.8v22.3 c0,0.1,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0.1,0.5,0.5,0.8,1,0.8c0.1,0,0.1,0,0.2,0c12.6-2.6,20.1-7.3,20.1-12.6c0-0.2,0-0.5-0.1-0.7 c0,0,0,0,0-0.1L87.6,20L87.6,20z M68.3,34.3V32c8.3-1.8,14.3-4.5,17.2-7.8v17.9C82.6,38.8,76.5,36.1,68.3,34.3z M25,34.3 C17,36,10.8,38.7,7.7,42V24.2c2.9,3.2,8.9,6,17.2,7.8V34.3z M25,57.1C14.5,54.8,7.7,50.7,7.7,46.7c0-0.1,0-0.2,0-0.3 c0-0.1,0-0.2,0-0.2c0-0.1,0-0.1,0-0.2v-0.6C7.9,45.2,7.9,45.1,8,45c1.7-3.6,8.1-6.7,17-8.6L25,57.1L25,57.1z M46.6,32.2 c-7.1,0-13.7,0.6-19.6,1.7v-2.5c0,0,0,0,0,0c0.1-0.5-0.3-1-0.8-1.1C15.3,28,8.1,24,7.7,19.9v-0.6c0,0,0,0,0,0 C8.3,13.3,23.8,7,46.7,7c21.7,0,36.9,5.7,38.8,11.4c0,0.1,0,0.1,0,0.2c0.1,0.2,0.1,0.4,0.1,0.6c0,0,0,0,0,0.1v0.6 c-0.4,4-7.5,8-18.4,10.3c-0.5,0.1-0.8,0.6-0.8,1.1c0,0,0,0,0,0v2.6C60.5,32.8,53.8,32.2,46.6,32.2z M68.3,57.1V36.4 c9.8,2.2,16.6,5.8,17.2,9.8c0,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2,0,0.3C85.6,50.7,78.9,54.8,68.3,57.1z"/>
        <path d="M50.6,15.6c-0.4-0.4-1-0.4-1.4,0l-6.7,6.7l-2.7-2.7c-0.4-0.4-1-0.4-1.4,0l-8.7,8.7c-0.4,0.4-0.4,1,0,1.4 c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l8-8l2.7,2.7c0,0,0,0,0,0l4,4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L44,23.7l6-6L61.6,29c0.4,0.4,1,0.4,1.4,0s0.4-1,0-1.4L50.6,15.6z"/>
        <path d="M38.7,16.5c2,0,3.7-1.7,3.7-3.7s-1.7-3.7-3.7-3.7S35,10.7,35,12.8S36.7,16.5,38.7,16.5z M38.7,11.1c0.9,0,1.7,0.8,1.7,1.7 s-0.8,1.7-1.7,1.7S37,13.7,37,12.8S37.8,11.1,38.7,11.1z"/>
      </svg>`
    this.el.appendChild(this.playButton)

    // XXX
    // this.videoElem.muted = true

    this.viewer = new Kaleidoscope.Video({
      source: this.videoElem,
      container: this.el,
      width: this.el.clientWidth,
      // XXX assumes 16:9 aspect ratio is desired
      height: this.el.clientWidth * 0.5625,
    })

    if (this.videoElem.readyState >= 2)
      this.viewer.render()
    else
      this.videoElem.addEventListener('canplay', () => this.viewer.render())

    this.bind({ onscreen: 'onscreen' })
  }


  mousedown({ clientX, clientY, timeStamp }) {
    this.mouse = { clientX, clientY, timeStamp }
  }


  mouseup({ clientX, clientY, timeStamp }) {
    const isClick = (
      Math.abs(this.mouse.clientX - clientX) < 10 &&
      Math.abs(this.mouse.clientY - clientY) < 10 &&
      timeStamp - this.mouse.timeStamp < 400
    )
    if (isClick) this.playPause()
  }


  resize() {
    this.viewer.setSize({ 
      width: this.el.clientWidth,
      // XXX assumes 16:9 aspect ratio is desired
      height: this.el.clientWidth * 0.5625,
    })
  }


  playPause() {
    if (this.videoElem.paused) {
      this.viewer.play()
      this.el.classList.add('playing')
    }
    else {
      this.viewer.pause()
      this.el.classList.remove('playing')
    }
  }


})



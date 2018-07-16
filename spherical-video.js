import { dom, env, article } from '/app/index.js';
import Plugin from '/app/src/plugin.js'
import * as Kaleidoscope from './lib/kaleidoscope.js';

window.top.postMessage({ event: 'requestDeviceMotion' }, '*')

window.addEventListener('message', event => {
  console.log('message', event.data)
  if (event.data.event == 'readyCheck')
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
    this.playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M3.4 16.14V2.52a.8.8 0 0 1 1.2-.69l11.78 6.8 11.82 6.82a.8.8 0 0 1 0 1.39l-11.8 6.8-11.8 6.8a.8.8 0 0 1-1.2-.69z"/></svg>`
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



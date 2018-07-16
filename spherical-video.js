import { dom, env, article } from '/app/index.js';
import Plugin from '/app/src/plugin.js'
import * as Kaleidoscope from './lib/kaleidoscope.js';

window.top.postMessage({ event: 'requestDeviceMotion' }, '*')

article.register('.spherical-video', class SphericalVideo extends Plugin {

  constructor(args) {
    super(args)

    window.addEventListener('resize', () => this.resize())
    this.el.addEventListener(
      'touchmove',
      event => event.preventDefault(),
      { passive : false }
    )

    this.videoElem = this.el.children[0]
    this.videoElem.style.display = 'none'

    // XXX
    // this.videoElem.muted = true

    this.viewer = new Kaleidoscope.Video({
      source: this.videoElem,
      container: this.el,
      width: this.el.clientWidth,
      height: this.el.clientWidth * 0.5625,
    })

    this.bind({ onscreen: 'onscreen' })
  }

  resize() {
    console.log('resize')
    this.viewer.setSize({ 
      width: this.el.clientWidth,
      // XXX assumes 16:9 aspect ratio is desired
      height: this.el.clientWidth * 0.5625,
    })
  }

  offscreen() {
    this.isOnscreen = false
  }


  onscreen() {
    this.isOnscreen = true
    if (this.videoElem.readyState === 2)
      this.play()
    else
      this.videoElem.addEventListener('canplay', () => {
        if (this.isOnscreen)
          this.play()
      })
  }


  play() {
    console.log('play')
    this.viewer.render()
    this.viewer.play()
  }


})



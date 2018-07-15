import { dom, env, article } from '/app/index.js';
import Plugin from '/app/src/plugin.js'
import * as Kaleidoscope from './lib/kaleidoscope.js';


article.register('.v360', class v360 extends Plugin {

  constructor(args) {
    super(args)

    // so it plays on mobile
    this.el.children[0].muted = true

    this.viewer = new Kaleidoscope.Video({
      source: this.el.children[0],
      verticalPanning: false,
      container: this.el,
      width: this.el.clientWidth,
      height: this.el.clientHeight,
    })

    this.viewer.render()

    this.viewer.texture.minFilter = THREE.NearestFilter
    this.viewer.texture.magFilter = THREE.NearestFilter

    this.bind({ onscreen: 'onscreen' })
  }

  onscreen() {
    this.viewer.play()
  }

})



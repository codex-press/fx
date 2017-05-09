import dom from '/app/dom.js';
import Plugin from '/app/plugin.js';
import * as u from '/app/utility.js';
import * as env from '/app/env.js';
import article from '/app/article.js';

import * as Kaleidoscope from 'kaleidoscopejs';

article.register('[x-cp-video].v360', class v360 extends Plugin {

  constructor(args) {
    super(args);

    this.el.innerHTML = ''

    // issue where it will only work with 'medium' source because of weird 
    // issue with dimensions.... Ideally this should keep the video in place
    // and just use all the functionality of the other player like sizing
    // autoplay on scroll etc.
    let source = (
      env.contentOrigin +
      u.findSourceByQuality(this.props.media.srcset, 'medium').url
    );

    this.viewer = new Kaleidoscope.Video({source, container: this.el});

    this.bind({onscreen: 'onscreen'})
    this.viewer.render();
  }

  onscreen() {
    this.viewer.play();
  }

});

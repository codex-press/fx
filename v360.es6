import dom from 'dom';
import Plugin from 'plugin';
import * as u from 'utility';
import * as env from 'env';
import article from 'article';

import * as Kaleidoscope from 'kaleidoscopejs';

article.register('[x-cp-video].v360', class v360 extends Plugin {

  constructor(args) {
    super(args);

    this.el.innerHTML = ''

    this.viewer = new Kaleidoscope.Video({
      source: env.contentOrigin + u.findSourceByQuality(this.props.media.srcset, 'medium').url,
      container: this.el,
    });

    this.bind({onscreen: 'onscreen'})
    this.viewer.render();
  }

  onscreen() {
    this.viewer.play();
  }

});

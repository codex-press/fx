import moment from 'moment';

import article from 'article';
import dom from 'dom';

article.ready.then(() => {

  dom('.counter').map(el => {

    //let d = moment(el.textContent);
    let d = moment(Date.now() + 10000);

    setInterval(() => {

      if (d.diff(now, 'seconds') > 0)
        dom(el).removeClass('up').addClass('down');
      else
        dom(el).removeClass('down').addClass('up');

      let now = Date.now();
      let years = d.diff(now, 'years');
      let days = d.diff(now, 'days');
      let hours = d.diff(now, 'hours') - (days*24);
      let minutes = d.diff(now, 'minutes') - (d.diff(now, 'hours')*60);
      let seconds = d.diff(now, 'seconds') - (d.diff(now, 'minutes')*60);

      el.innerHTML = `
        <span class=years>${years}</span><span class=days>${days}</span><span class=hours>${hours}</span><span class=minutes>${minutes}</span><span class=seconds>${seconds}</span>
      `;

    }, 1000);

  });

});


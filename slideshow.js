import article from 'article';
import dom from 'dom';
import {contentOrigin} from 'env';

let arrow = `
  <svg class="arrow" viewBox="0 0 100 125" xmlns="http://www.w3.org/2000/svg"><path d="M91.9,62.5L50,86.7L8.1,110.9c0,0,10.2-20,10.2-48.4S8.1,14.1,8.1,14.1L50,38.3L91.9,62.5z"/></svg>
`;

let html = `
  <div class=slideshow>
    <div class=close>&times;</div>
    <div class=left>${arrow}</div>
    <div class=right>${arrow}</div>
    <div class=position></div>
  </div>
`;

let slideshowIcon = `
  <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 1632v-1088q0-13-9.5-22.5t-22.5-9.5h-1088q-13 0-22.5 9.5t-9.5 22.5v1088q0 13 9.5 22.5t22.5 9.5h1088q13 0 22.5-9.5t9.5-22.5zm128-1088v1088q0 66-47 113t-113 47h-1088q-66 0-113-47t-47-113v-1088q0-66 47-113t113-47h1088q66 0 113 47t47 113zm-384-384v160h-128v-160q0-13-9.5-22.5t-22.5-9.5h-1088q-13 0-22.5 9.5t-9.5 22.5v1088q0 13 9.5 22.5t22.5 9.5h160v128h-160q-66 0-113-47t-47-113v-1088q0-66 47-113t113-47h1088q66 0 113 47t47 113z"/></svg>
`;


let buttonHTML = `
  <div class=slideshow-button>
    ${slideshowIcon}
    <div class=text>Start Slideshow</div>
  </div>
`;

let images;

article.ready.then(() => {
  dom('[x-cp-background-image]').append(buttonHTML);
  dom('figure[x-cp-image] .frame').append(buttonHTML);

  images = article.attrs.content.filter(c => c.type === 'Image');

  dom(window).bind({
    'click .slideshow-button' : start,
    'click .slideshow .close' : end,
    'click .slideshow .left'  : previous,
    'click .slideshow .right' : next,
  });

});


let index = 0;
let el;
function start(e) {
  let target = dom(e.target).parents('[x-cp-image],[x-cp-background-image]')[0];
  let id = target.getAttribute('x-cp-id');
  index = images.findIndex(i => i.id == id) || 0;

  el = dom.create(html);
  dom(el).append(
    images.map(i => {
      let url = i.media.srcset.slice().reverse()[0].url;
      let caption = '';
      let figure = dom(`[x-cp-id="${i.id}"]`).path('figure');
      if (figure) {
        let figcaption = dom(figure).first('figcaption');
        if (figcaption)
          caption = figcaption.innerHTML;
      }
      return `
        <div class=image>
          <div class=wrap>
            <img src=${contentOrigin + url}>
          </div>
          <figcaption>${caption}</figcaption>
        </div>
      `;
    }).join('')
  );
  dom.body().append(el);
  update();
  dom.body().css({overflow: 'hidden'});
  dom(window).on('keyup', key);
}

function key(e) {
  if ([32, 39, 13].includes(e.which)) {
    e.preventDefault();
    next();
  }
  else if (e.which == 37) {
    e.preventDefault();
    previous();
  }
}

function next(e) {
  if (index < images.length - 1) {
    index += 1;
    update();
  }
  else {
    let last = dom(el).select('.image')[images.length-1]
    dom(last).addClass('bounce-animate');
    dom(last).once('animationend', () => {
      dom(last).removeClass('bounce-animate')
    });
  }
}

function previous(e) {
  if (index > 0) {
    index -= 1;
    update();
  }
  else {
    let first = dom(el).select('.image')[0]
    dom(first).addClass('bounce-animate');
    dom(first).once('animationend', () => {
      dom(first).removeClass('bounce-animate')
    });
  }
}

function update() {
  dom(el).select('.image').css({opacity: ''});
  dom(el).select('.image')[index].style.opacity = 1;
  dom(el).select('.position').text(`${index + 1} / ${ images.length}`);
}

function end(e) {
  dom('.slideshow').remove();
  dom.body().css({overflow: ''});
  dom(window).off('keyup', key);
}



import dom from 'dom';


// feature detect mix-blend-mode
let test = document.createElement('div');

test.style.mixBlendMode = 'screen';
if (test.style.mixBlendMode === 'screen')
  dom(document.documentElement).addClass('no-mix-blend-mode');


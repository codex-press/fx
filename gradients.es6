import dom from 'dom';

let test = document.createElement('div');

// feature detect mix-blend-mode
test.style.mixBlendMode = 'screen';
if (test.style.mixBlendMode !== 'screen')
  dom(document.documentElement).addClass('no-mix-blend-mode');

// feature detect background-clip
test.style.webkitBackgroundClip = 'text';
if (test.style.webkitBackgroundClip !== 'text')
  dom(document.documentElement).addClass('no-background-clip');


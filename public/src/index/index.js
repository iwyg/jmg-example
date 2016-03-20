import 'modernizr';
import 'styles/index';
import {document, window} from 'global';
import debounce from 'lodash.debounce';
import difference from 'lodash.difference';
import Prism from 'prismjs';
import {php, bash, sh} from 'prism-languages';
import 'babel-polyfill';
import ViewPort, {
  EVENT_VIEWPORT, EVENT_VIEWPORT_ENTER, EVENT_VIEWPORT_LEAVE
} from './modules/ViewPort';
import Q, {select, selectAll, addClass, removeClass} from './modules/Dom';
import {requestAnimationFrame} from 'polyfill/animation-frame';
import scroll from 'scroll';
import { createHistory } from 'history';

let el = Q('section.container .animateable');
let codeBlocks = document.querySelectorAll('code[class*="language-"]');
let viewPort = new ViewPort;

const scrollTarget = (function () {
  return /Firefox/.test(navigator.userAgent) ?
  document.documentElement :
  document.body
}());

const scrollHandler = (targetId) => {
  let target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  doScroll(target.offsetTop);
};

const doScroll = (top) => {
  scroll.top(scrollTarget, top, {ease: 'inOutQuart', duration: 1200});
};

const history = createHistory();
const historyStop = history.listen(location => {
  if (location.hash) {
    scrollHandler(location.hash.split('#')[1]);
  } else {
    doScroll(0);
  }
});

const handler = function (event) {
  let element = event.target;
  requestAnimationFrame(() => {
    addClass(element, 'anim-in');
    //element.removeEventListener(EVENT_VIEWPORT, handler);
  });
};

el.get().forEach((element) => {
  element.addEventListener(EVENT_VIEWPORT, handler);
});

viewPort.registerElements(el, null, (e) => {
  removeClass(e.target, 'anim-in');
});


const handleClick = (e) => {
  e.preventDefault();
  let targetId = e.target.href.split('#')[1];
  history.push({
    hash: e.target.hash
  });
  //let top = document.getElementById(targetId).offsetTop;
  //scroll.top(scrollTarget, top, {duration: 2000});
};

Q('.link.int').get().forEach((element) => {
  element.addEventListener('click', handleClick);
});

//document.addEventListener('DOMContentLoaded', Prism.fileHighlight);

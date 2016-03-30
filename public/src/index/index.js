import 'modernizr';
import 'styles/index';
import {document, window} from 'global';
import debounce from 'lodash.debounce';
import difference from 'lodash.difference';
import Prism from 'prismjs';
import {php, bash, sh} from 'prism-languages';
import 'babel-polyfill';
import ViewPort, {tick} from './modules/ViewPort';
import {EVENT_VIEWPORT, EVENT_VIEWPORT_ENTER, EVENT_VIEWPORT_LEAVE,
  EVENT_VIEWPORT_SCROLL_START, EVENT_VIEWPORT_SCROLL_STOP
} from './modules/Events';

import Q, {select, selectAll, addClass, removeClass} from './modules/Dom';
import {requestAnimationFrame} from 'polyfill/animation-frame';
import scroll from 'scroll';
import { createHistory } from 'history';

let animateable = Q('section.container .animateable');
let sections = Q('#fold, section.container');
let fold  = Q('#fold').get(0);
let feature  = Q('#features').get(0);
let codeBlocks = document.querySelectorAll('code[class*="language-"]');
let viewPort = new ViewPort;

const scrollTarget = (function () {
  return /Firefox/.test(navigator.userAgent) ?
  document.documentElement :
  document.body
}());

const S_STACK = [];

const HASH_SPLIT = '#s';

const smon = {
  scrolling: false
};

// debounced scroll animation.
const doScroll = debounce(function (scroller) {
  let scrolling = false;

  return (top) => {
    if (scrolling || scroller.scrolling) {
      return;
    }

    scrolling = true;
    history.locked = true;
    requestAnimationFrame(() => {
      scroll.top(scrollTarget, top, {ease: 'inOutQuart', duration: 1200}, (error, scrollTop) => {
        history.locked = false;
        scrolling = false;
      });
    })
  };
}(smon), 300);

const scrollHandler = (targetId) => {
  let target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  doScroll(target.offsetTop);
};

// wrapper for history, can lock pushes.
const history = {
  locked: false,
  history: createHistory(),
  push() {
    if (this.locked) {
      return;
    }
    this.history.push.apply(this.history, arguments);
  }
};

const handleClick = (e) => {
  e.preventDefault();
  let targetId = e.target.href.split('#')[1];

  history.push({
    hash: HASH_SPLIT + targetId
  });

  S_STACK.pop().call(null);
};

const handler = function (event) {
  let element = event.target;
  requestAnimationFrame(() => {
    addClass(element, 'anim-in');
  });
};

animateable.get().forEach((element) => {
  element.addEventListener(EVENT_VIEWPORT, handler);
});

viewPort.registerElements(animateable, null, (e) => {
  removeClass(e.target, 'anim-in');
});

viewPort.registerElements(sections, (e) => {

  e.preventDefault();
  e.stopPropagation();

  if (e.target === fold) {
    history.push({
      hash: ''
    });
  } else if (!!e.target.id) {
    history.push({
      hash: HASH_SPLIT + e.target.id
    });
  }
});

// hadle internal reference links
Q('.link.int').get().forEach((element) => {
  element.addEventListener('click', handleClick);
});

const historyHandler = (location) => {
  if (location.hash) {
    scrollHandler(location.hash.split(HASH_SPLIT)[1]);
  } else {
    doScroll(0);
  }
};

let hstop = history.history.listen(function (location) {
  S_STACK.push(historyHandler.bind(null, location));
});

window.addEventListener(EVENT_VIEWPORT_SCROLL_START, (e) => {
  smon.scrolling = true;
  S_STACK.splice(0, S_STACK.length);
});

window.addEventListener(EVENT_VIEWPORT_SCROLL_STOP, (e) => {
  smon.scrolling = false;
  let func = S_STACK.pop();
  if (func !== undefined) {
    func.call(null);
  }
});

tick.start();

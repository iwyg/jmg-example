import {document, window} from 'global';
import {requestAnimationFrame} from 'polyfill/animation-frame';

export const select = (selector) => {
  return document.querySelector(selector);
};

export const selectAll = (selector) => {
  return document.querySelectorAll(selector);
};

export const addClass = (el, className) => {
  el.className = el.className.split(' ').concat(className.split(' ')).join(' ').trim();
};

export const removeClass = (el, className) => {
  if (!el.className.length || !className.length) {
    return;
  }

  let classNames = el.className.split(' ');
  let rmClassNames = className.split(' ');
  let newName = classNames.filter((n) => {
    return rmClassNames.indexOf(n) < 0;
  }).join(' ').trim();

  if (newName.length) {
    el.className = newName;
  } else {
    el.removeAttribute('class');
  }
};

function Q (selector = '') {
  let el = selector.length ? Array.prototype.slice.call(selectAll(selector)) : [];
  Array.prototype.push.apply(this, el, 0);
}

Q.prototype = {

  addClass(className) {
    Array.prototype.forEach.call(this, el => addClass(el, className));
  },

  removeClass(className) {
    Array.prototype.forEach.call(this, el => removeClass(el, className));
  },

  forEach(fn) {
    Array.prototype.forEach.call(this, fn);
  },

  map(fn) {
    return Array.prototype.map.call(this, fn);
  },

  slice(index, offset) {
    let newQ = new Q;
    Array.prototype.push.apply(newQ, this.get().slice(index, offset));
    return newQ;
  },

  get(index) {
    return index ? (this[index] || null) : Array.prototype.slice.call(this, 0);
  },

};

export default (selector) => {
  return new Q(selector);
}

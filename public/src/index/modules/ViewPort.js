import {document, window} from 'global';
import {isFunc} from 'lib/assert';
import debounce from 'lodash.debounce';

export const EVENT_VIEWPORT = 'viewport';
export const EVENT_VIEWPORT_ENTER = 'viewportenter';
export const EVENT_VIEWPORT_LEAVE = 'viewportleave';

const {CustomEvent} = window;

const getViewPort = (el) => {
  let {innerWidth, innerHeight, scrollX, scrollY} = el;
  return {
    width: innerWidth,
    height: innerHeight,
    offsetX: scrollX,
    offsetY: scrollY
  };
};

let top = window.scrollY;

const loop = () => {
  loop.canceled = window.scrollY === top;
  top = window.scrollY
  updateViewPort();

  if (!loop.canceled) {
    requestAnimationFrame(loop);
  } else {
    document.addEventListener('scroll', startLoop);
  }
};

loop.canceled = false;

const startLoop = () => {
  loop.canceled = false;
  requestAnimationFrame(loop);
  document.removeEventListener('scroll', startLoop);
};

const updateViewPort = (function (element = window) {
  let viewport = getViewPort(element);

  const isdiff = (function () {
    let keys = Object.keys(viewport);
    return (a, b) => {
      return keys.filter((key) => {
        return a[key] === b[key];
      }).length > 0;
    };
  }());

  return (forceUpdate  = false) => {
    let n = getViewPort(element);

    if (!forceUpdate && !isdiff(viewport, n)) {
      return;
    }

    let d = n.direction = {
      down:  false,
      up:    false,
      left:  false,
      right: false,
      still: true
    };

    if (n.offsetY > viewport.offsetY) {
      d.down  = true;
      d.still = false;
    } else if (n.offsetY < viewport.offsetY) {
      d.up    = true;
      d.still = false;
    }

    if (n.offsetX > viewport.offsetX) {
      d.left  = true;
      d.still = false;
    } else if (n.offsetX < viewport.offsetX) {
      d.right = true;
      d.still = false;
    }

    viewport = n;
    element.dispatchEvent(new CustomEvent(EVENT_VIEWPORT, {detail: n}));
  };
}());

const inRange = (a, b, range = 20) => {
  return a === b || (a < b && (a + range) > b);
};

const entersViewPort = (el, viewPort) => {
  if (el.inViewport) {
    return false;
  }

  return inViewport(el, viewPort);
};

const leavesViewPort = (el, viewPort) => {
  if (!el.inViewport) {
    return false;
  }

  return !inViewport(el, viewPort);
};

const inViewport = (el, viewPort) => {
  return (el.props.offsetTop - el.props.offsetHeight < viewPort.offsetY &&
    el.props.offsetTop > viewPort.offsetY - el.props.offsetHeight) ||
    ((viewPort.direction.left || viewPort.direction.right)  && (el.props.offsetLeft - el.props.offsetWidth < viewPort.offsetX) &&
    (el.props.offsetLeft > viewPort.offsetX - el.props.offsetWidth));
}

const updateElement = (event, element) => {
  if (entersViewPort(element, event.detail)) {
    element.enter(event);
  }

  if (leavesViewPort(element, event.detail)) {
    element.leave(event);
  }
};

function updateViewPortElement() {
    let {offsetTop, offsetHeight, offsetLeft, offsetWidth} = this.el;
    this.props = {offsetTop, offsetHeight, offsetLeft, offsetWidth};
}

function update(event) {
  this.viewPort = event.detail;
  this.elements.forEach(el => updateElement(event, el));
};

export default class ViewPort {
  constructor() {
    this.elements = [];
    this.viewPort = {};
    this.updateElements = this.updateElements.bind(this);
    window.addEventListener(EVENT_VIEWPORT, update.bind(this));
    window.addEventListener('resize', this.updateElements)
  }

  updateElements(event) {
    this.elements.forEach((el) => {
      el.update(this.viewPort, event);
    });
  }

  registerElements(elements, onEnter, onLeave) {
    Array.prototype.slice.call(elements, 0)
      .forEach(el => this.registerElement(el, onEnter, onLeave));
  }

  removeElements(elements, onEnter, onLeave) {
    Array.prototype.slice.call(elements, 0)
      .forEach(el => this.removeElement(el, handler));
  }

  registerElement(element, onEnter, onLeave) {
    let index = this.elements.length;

    this.elements.push(new ViewPortElement(element, function (n) {
      this.elements.splice(n, 1);

      if (isFunc(onEnter)) {
        element.removeEventListener(EVENT_VIEWPORT_ENTER, onEnter);
      }

      if (isFunc(onLeave)) {
        element.removeEventListener(EVENT_VIEWPORT_LEAVE, onLeave);
      }
    }.bind(this, index)));

    if (isFunc(onEnter)) {
      element.addEventListener(EVENT_VIEWPORT_ENTER, onEnter);
    }

    if (isFunc(onLeave)) {
      element.addEventListener(EVENT_VIEWPORT_LEAVE, onLeave);
    }

    updateViewPort(true);
    this.updateElements(true);
  }

  removeElement(element) {
    let res = this.elements.reduce((a, b) => {
      return a && a.el === element ? a : (b && b.el === element ? b : null);
    });

    if (res !== null && res.el === element) {
      res.tearDown();
    }
  }

  tearDown() {
    this.elements.forEach(element => element.tearDown());
  }
};

class ViewPortElement {
  constructor(element, remove) {

    if (!(element instanceof Element)) {
      throw new Error('element must be instance of Element.');
    }

    this.el = element;
    this.inViewport = false;
    this.remove = remove;
    this.props = {};
  }

  update(viewPort, event) {

    updateViewPortElement.call(this);

    if (!this.inViewport && inViewport(this, viewPort)) {
      this.enter(event);
    } else if (this.inViewport && !inViewport(this, viewPort)) {
      this.leave(event);
    }
  }

  enter(event) {
    this.inViewport = true;
    requestAnimationFrame(() => {
      this.el.dispatchEvent(new CustomEvent(EVENT_VIEWPORT_ENTER, {detail: {viewportEvent: event}}));
    });
  }

  leave(event) {
    this.inViewport = false;
    requestAnimationFrame(() => {
      this.el.dispatchEvent(new CustomEvent(EVENT_VIEWPORT_LEAVE, {detail: {viewportEvent: event}}));
    });
  }

  tearDown() {
    if (isFunc(this.remove)) {
      this.remove.call(null);
    }
  }
}

window.addEventListener('resize', debounce(updateViewPort, 200));
startLoop();

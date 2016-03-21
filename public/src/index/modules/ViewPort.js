import {document, window} from 'global';
import {isFunc, isObject, isDefined} from 'lib/assert';
import debounce from 'lodash.debounce';

export const EVENT_VIEWPORT = 'viewport';
export const EVENT_VIEWPORT_ENTER = 'viewportenter';
export const EVENT_VIEWPORT_LEAVE = 'viewportleave';

const {CustomEvent} = window;
const offsetElement = isDefined(document.documentElement) ? document.documentElement : document.body;

const getViewPort = (el = window) => {
  let {innerWidth, innerHeight, scrollX, scrollY} = el;
  return {
    width: innerWidth,
    height: innerHeight,
    offsetX: scrollX,
    offsetY: scrollY,
    scrollsY: offsetElement.scrollHeight > innerHeight,
    scrollsX: offsetElement.scrollWidth > innerWidth,
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

const viewPortDirection = () => {
    return {
      down:  false,
      up:    false,
      left:  false,
      right: false,
      still: true
    };
};

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

    let d = n.direction = viewPortDirection();

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


    n.speed = {
      y: 100 / (n.height / Math.max(1, Math.abs(viewport.offsetY - n.offsetY))),
      x: 100 / (n.width / Math.max(1, Math.abs(viewport.offsetX - n.offsetX)))
    }

    viewport = n;
    element.dispatchEvent(new CustomEvent(EVENT_VIEWPORT, {detail: n}));
  };
}());

const syntesizeEvent = () => {
  let vp = Object.assign({}, getViewPort(), {direction: viewPortDirection(), speed: {y: 0, x: 0}});
  return new CustomEvent(EVENT_VIEWPORT, {detail: vp});
};

/**
 * Test if a number is within a given range.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} range
 * @returns {boolean}
 */
const inRange = (a, b, range = 20) => {
  return a === b || (a < b && (a + range) > b);
};

/**
 * Test if a element enters viewport
 *
 * @param {ViewPortElement} el view port element
 * @param {Object} viewPort viewport
 * @returns {boolean}
 */
const entersViewPort = (el, viewPort) => {
  if (el.inViewport) {
    return false;
  }

  return inViewport(el, viewPort);
};

/**
 * Test if a element leaves viewport
 *
 * @param {ViewPortElement} el view port element
 * @param {Object} viewPort viewport
 * @returns {boolean}
 */
const leavesViewPort = (el, viewPort) => {
  if (!el.inViewport) {
    return false;
  }

  return !inViewport(el, viewPort);
};

/**
 * Test if a element is inViewport
 *
 * @param {ViewPortElement} el view port element
 * @param {Object} viewPort viewport
 * @returns {boolean}
 */
const inViewport = (el, viewPort) => {
  return viewPort.scrollsY && (el.props.offsetTop < viewPort.offsetY + viewPort.height &&
    el.props.offsetTop > viewPort.offsetY - viewPort.height) ||
    viewPort.scrollsX && (el.props.offsetLeft < viewPort.offsetX + viewPort.width &&
    (el.props.offsetLeft > viewPort.offsetX - viewPort.width));
}

const getSensitivity = (viewPort) => {
  return {
    sy: Math.max(1, viewPort.speed.y) * 20,
    sx: Math.max(1, viewPort.speed.x) * 20
  };
}

const inFullViewport = (el, viewPort) => {
  let eH = Math.abs(viewPort.height - el.props.offsetHeight);
  let eW = Math.abs(viewPort.width - el.props.offsetWidth);

  if (isNaN(eH) || isNaN(eW)) {
    return false;
  }

  let {sy, sx} = getSensitivity(viewPort);

  let ny = viewPort.direction.down ? (el.props.offsetTop - eH) : (el.props.offsetTop + eH);
  let nx = viewPort.direction.left ? (el.props.offsetLeft - eW) : (el.props.offsetLeft + eW);

  return !el.inFullViewport && (inRange(viewPort.offsetY, ny, sy) ||
    viewPort.offsetX > 0 && inRange(viewPort.offsetX, nx, sx)
  );
}

/**
 * Updates element satus `inViewport`
 *
 * @param {CustomEvent} event a viewport event.
 * @param {ViewPortElement} el view port element
 * @returns {void}
 */
const updateElement = (event, element) => {
  if (entersViewPort(element, event.detail)) {
    element.enter(event);
    return;
  }

  if (leavesViewPort(element, event.detail)) {
    element.leave(event);
    return;
  }

  if (inFullViewport(element, event.detail)) {
    element.inFullViewport = true;
    element.el.dispatchEvent(new CustomEvent(EVENT_VIEWPORT, event || syntesizeEvent()));
  }
};

function updateViewPortElement(viewPort) {
  let {offsetTop, offsetHeight, offsetLeft, offsetWidth} = this.el;
  this.props = {offsetTop, offsetHeight, offsetLeft, offsetWidth};
  //this.sensitivity = {
  //  y: (100 / Math.max(100, viewPort.height - offsetHeight)) * 10,
  //  x: (100 / Math.max(100, viewPort.width - offsetWidth)) * 10
  //};

  this.sensitivity = {
    y: 10,
    x: 10
  };
  console.log(this.sensitivity);
}

function update(event) {
  this.viewPort = event.detail;
  this.elements.forEach(el => updateElement(event, el));
};

export default class ViewPort {
  constructor() {
    this.elements = [];
    this.viewPort = {};

    this._update = update.bind(this);
    this.updateElements = this.updateElements.bind(this);

    window.addEventListener(EVENT_VIEWPORT, this._update);
    window.addEventListener('resize', this.updateElements)

    updateViewPort(true);
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
    let el = new ViewPortElement(element, function (n) {
      this.elements.splice(n, 1);

      if (isFunc(onEnter)) {
        element.removeEventListener(EVENT_VIEWPORT_ENTER, onEnter);
      }

      if (isFunc(onLeave)) {
        element.removeEventListener(EVENT_VIEWPORT_LEAVE, onLeave);
      }
    }.bind(this, index));

    if (isFunc(onEnter)) {
      element.addEventListener(EVENT_VIEWPORT_ENTER, onEnter);
    }

    if (isFunc(onLeave)) {
      element.addEventListener(EVENT_VIEWPORT_LEAVE, onLeave);
    }

    this.elements.push(el);

    this.viewPort = this.viewPort || syntesizeEvent().detail;
    el.update(this.viewPort);
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
    this.inFullViewport = false;
    this.remove = remove;
    this.props = {};
    this.sensitivity = {};
  }

  update(viewPort, event) {

    updateViewPortElement.call(this, viewPort, event);

    let e = isObject(event) ? event : viewPort;

    console.log(viewPort);

    if (!this.inViewport && inViewport(this, viewPort)) {
      this.enter(e);
      this.el.dispatchEvent(new CustomEvent(EVENT_VIEWPORT, {detail: e}));
    } else if (this.inViewport && !inViewport(this, viewPort)) {
      this.leave(e);
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
    this.inFullViewport = false;
    requestAnimationFrame(() => {
      this.el.dispatchEvent(new CustomEvent(EVENT_VIEWPORT_LEAVE, {detail: {viewportEvent: event}}));
    });
  }

  tearDown() {
    if (isFunc(this.remove)) {
      this.remove.call(null);
    }

    window.removeEventListener(EVENT_VIEWPORT, this._update);
    window.removeEventListener('resize', this.updateElements)
  }
}

window.addEventListener('resize', debounce(updateViewPort, 200));
startLoop();
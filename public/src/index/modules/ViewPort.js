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

function loop() {
  if (window.scrollY === top) {
    loop.canceled = true;
  }

  top = window.scrollY
  updateViewPort();

  if (!loop.canceled) {
    requestAnimationFrame(loop);
  }
}

loop.canceled = false;

function startLoop() {
  loop.canceled = false;
  requestAnimationFrame(loop);
}


//startLoop();


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
      down: false,
      left: false,
      up: false,
      right: false,
      still: false
    };

    if (n.offsetY > viewport.offsetY) {
      d.down = true;
    } else if (n.offsetY < viewport.offsetY) {
      d.up = true;
    } else {
      d.still = true;
    }

    if (n.offsetX > viewport.offsetX) {
      d.left = true;
    } else if (n.offsetX < viewport.offsetX) {
      d.right = true;
    } else {
      d.still = true;
    }

    viewport = n;
    element.dispatchEvent(new CustomEvent(EVENT_VIEWPORT, {detail: n}));
  };
}());

const callEventOnEnter = debounce((element) => {
  element.el.dispatchEvent(new CustomEvent(EVENT_VIEWPORT_ENTER));
}, 10);

const callEventOnLeave = debounce((element) => {
  element.dispatchEvent(new CustomEvent(EVENT_VIEWPORT_LEAVE));
}, 10);


const inRange = (a, b, range = 20) => {
  return a === b || (a < b && (a + range) > b);
};

const entersViewPortY = (el, viewPort) => {
  if (el.inViewport) {
    return false;
  }

  if (viewPort.direction.down) {
    //console.log(viewPort.offsetY, el.props.offsetTop - el.props.offsetHeight, el.props.offsetTop);
    return inRange(viewPort.offsetY, el.props.offsetTop - el.props.offsetHeight);
  }

  if (viewPort.direction.up) {
    return inRange(Math.max(0, viewPort.offsetY - el.props.offsetHeight), el.props.offsetTop);
  }

  return false;
};

const entersViewPortX = (el, viewPort) => {
  //if (el.inViewport) {
  //  return false;
  //}

  //if (viewPort.direction.left) {
  //  return inRange(el.props.offsetLeft - viewPort.offsetX, el.props.offsetWidth);
  //}

  //if (viewPort.direction.right) {
  //  return inRange(Math.max(viewPort.offsetX - el.props.offsetWidth), el.props.offsetLeft);
  //}

  return false;
};

const leavesViewPortY = (el, viewPort) => {
  if (!el.inViewport) {
    return false;
  }

  if (viewPort.direction.down) {
    return inRange(el.props.offsetTop, Math.max(viewPort.offsetY - el.props.offsetHeight));
  }

  if (viewPort.direction.up) {
    return inRange(el.props.offsetTop - el.props.offsetHeight, viewPort.offsetY);
    //return inRange(el.props.offsetHeight, el.props.offsetTop - viewPort.offsetY);
  }

  return false;
};

const leavesViewPortX = (el, viewPort) => {
  //if (!el.inViewport) {
  //  return false;
  //}

  //if (viewPort.direction.left) {
  //  return inRange(el.props.offsetLeft, Math.max(viewPort.offsetX - el.props.offsetLeft));
  //}

  //if (viewPort.direction.right) {
  //  return inRange(el.props.offsetLeft, el.props.offsetLeft - viewPort.offsetX);
  //}

  return false;
};

const inViewport = (el, viewPort) => {
  return el.props.offsetTop - el.props.offsetHeight < viewPort.offsetY &&
    el.props.offsetTop > viewPort.offsetY - el.props.offsetHeight;
}

function updateElement(event, element) {
  if (entersViewPortY(element, event.detail)) {
    element.enter(event);
  }

  if (leavesViewPortY(element, event.detail)) {
    element.leave(event);
  }

  //if (entersViewPortX(element, event.detail)) {
  //  element.leave(event);
  //}

  //if (leavesViewPortX(element, event.detail)) {
  //  element.leave(event);
  //}
};

function updateViewPortElement() {
    let {offsetTop, offsetHeight, offsetLeft, offsetWidth} = this.el;
    this.props = {offsetTop, offsetHeight, offsetLeft, offsetWidth};
}

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
    this.el.dispatchEvent(new CustomEvent(EVENT_VIEWPORT_ENTER, {detail: {viewportEvent: event}}));
  }

  leave(event) {
    this.inViewport = false;
    this.el.dispatchEvent(new CustomEvent(EVENT_VIEWPORT_LEAVE, {detail: {viewportEvent: event}}));
  }
}

function update(event) {
  this.viewPort = event.detail;
  this.elements.forEach(el => updateElement.call(this, event, el));
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
    this.elements.push(new ViewPortElement(element, () => {
      this.elments = this.elements.slice(0, this.elements.length);
    }));

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
      return a.el === element ? a : (b.el === elment ? b : null);
    });

    if (res !== null) {
      res[1].call(this);
    }
  }
};

window.addEventListener('resize', debounce(updateViewPort, 200));
//window.addEventListener('scroll', updateViewPort);
document.addEventListener('scroll', startLoop);

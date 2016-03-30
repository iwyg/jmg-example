import {window} from 'global';

export const addFlowEvent = (function () {

  const callIfOverflow = (e, type, flow, fn) => {
    if (e.type == (type + 'flow') ||
      ((e.orient === 0 && e.horizontalOverflow === flow) ||
      (e.orient === 1 && e.verticalOverflow === flow) ||
      (e.orient === 2 && e.horizontalOverflow === flow && e.verticalOverflow === flow))) {

      return fn.call(null, e);
    }
  };

  return (element, type, fn) => {
    const flow = type === 'over';
    const event = 'OverflowEvent' in window ? 'overflowchanged' : type + 'flow';
    const handler = (e) => {
      callIfOverflow(e, type, flow, fn);
    };

    element.addEventListener(event, handler, false);

    return (el) => {
      element.removeEventListener(event, handler, false);

      if (el !== undefined && el !== element) {
        el.removeEventListener(event, handler, false);
      }
    }
  };

}());

export const onOverflow = (element, callback) => {
  return addFlowEvent(element, 'over', callback);
};

export const onUnderflow = (element, callback) => {
  return addFlowEvent(element, 'under', callback);
};

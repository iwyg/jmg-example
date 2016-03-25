import {window} from 'global';
import {EVENT_VIEWPORT_SCROLL_START, EVENT_VIEWPORT_SCROLL_STOP} from './Events';

const {CustomEvent} = window;
const ScrollTimer = (function (element) {
  let scrolls = false;
  let timer;

  return (e) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      scrolls = false;
      window.dispatchEvent(new CustomEvent(EVENT_VIEWPORT_SCROLL_STOP))
    }, 250);

    if (!scrolls) {
      scrolls = true;
      window.dispatchEvent(new CustomEvent(EVENT_VIEWPORT_SCROLL_START))
    }
  }
}(window));

// exposes an object capable of starting and stopping
// sroll `EVENT_VIEWPORT_SCROLL_START` and `EVENT_VIEWPORT_SCROLL_STOP` events.
export default (function (window, undefined) {
  let started = false;

  return {
    start () {
      if (started) {
        return false;
      }

      started = true;
      window.addEventListener('scroll', ScrollTimer);
      return true;
    },

    stop() {
      if (!started) {
        return false;
      }
      started = false;
      window.addEventListener('scroll', ScrollTimer);

      return true;
    }
  };
}(window));

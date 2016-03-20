import 'modernizr';
import 'styles/index';
import {document, window} from 'global';
import debounce from 'lodash.debounce';
import difference from 'lodash.difference';
import Prism from 'prismjs';
import {php, bash, sh} from 'prism-languages';
import 'babel-polyfill';
import ViewPort from './modules/ViewPort';
import Q, {select, selectAll, addClass, removeClass} from './modules/Dom';
import {requestAnimationFrame} from 'polyfill/animation-frame';

let viewPort = new ViewPort;
let el = selectAll('#features');

select('#features').addEventListener('viewport', function (e) {
  console.log('Im in viewport');
});

viewPort.registerElements(el, (e) => {
  //console.log('ENTER');
  //console.log(e.target);
  requestAnimationFrame(() => {
    addClass(e.target, 'anim-in');
  });
}, (e) => {
  //console.log('LEAVE');
  //console.log(e.target);
  removeClass(e.target, 'anim-in');
});

let codeBlocks = document.querySelectorAll('code[class*="language-"]');

document.addEventListener('DOMContentLoaded', Prism.fileHighlight);

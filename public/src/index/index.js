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

let viewPort = new ViewPort;
let el = selectAll('section.container');

viewPort.registerElements(el, (e) => {
  console.log('ENTER');
  console.log(e.target);
  addClass(e.target, 'in-viewport');
  viewPort.removeElement(e.target);
}, (e) => {
  console.log('LEAVE');
  console.log(e.target);
  removeClass(e.target, 'in-viewport');
});

let codeBlocks = document.querySelectorAll('code[class*="language-"]');

document.addEventListener('DOMContentLoaded', Prism.fileHighlight);

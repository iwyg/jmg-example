import 'styles/playground';
import 'babel-polyfill';
import 'modernizr';
import ObjectFit from 'object-fit';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from 'playground/components/App';
import configureStore from 'playground/modules/store';
import {ENV, PRODUCTION} from 'runtime/constants';

render(
  <Provider store={configureStore()}>
    <App limitImages={50} defaults={JMG_CONFIG}/>
  </Provider>,
  document.getElementById('main')
);

ObjectFit.polyfill({
  selector: '.preview-image img',
  fittype: 'contain',
  disableCrossdomain: true
});

console.log('%c' + document.title, 'background:#90a4ae;color:white;font-weight: bold;padding:2px 4px');

if (ENV !== PRODUCTION) {
  console.log('%crunning in ', 'color:lime', ENV);
}

import 'styles/playground';
import 'babel-polyfill';
import 'modernizr';

import ObjectFit from 'object-fit';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import App from 'playground/components/App';
import rootReducer from 'playground/modules/reducer';
import {ENV, PRODUCTION} from 'runtime/constants';

const configureStore = (function () {
  if (ENV !== PRODUCTION) {
    return (initialState) => {
      const logger = createLogger();
      return createStore(rootReducer, initialState, applyMiddleware(thunk, logger));
    };
  }
  return (initialState) => {
    return createStore(rootReducer, initialState, applyMiddleware(thunk));
  };
} ());

const store = configureStore();

render(
  <Provider store={store}>
    <App limitImages={50} defaults={JMG_CONFIG}/>
  </Provider>,
  document.getElementById('main')
);

ObjectFit.polyfill({
  selector: '.preview-image img',
  fittype: 'contain',
  disableCrossdomain: true
});

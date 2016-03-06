import 'styles/playground';
import 'babel-polyfill';
import 'modernizr';

import ObjectFit from 'object-fit';
import React from 'react';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import Layout from 'playground/components/Layout';
import rootReducer from 'playground/modules/reducer';

const configureStore = (initialState) => {
  const logger = createLogger();
  return createStore(rootReducer, initialState, applyMiddleware(thunk, logger));
};

const store = configureStore();

const mapStateToProps = function (state) {
  const {fetchUrl, fetching, images} = state;

  return {
    fetchUrl,
    fetching,
    images
  };
};

const App = connect(mapStateToProps)(Layout);

render(
  <Provider store={store}>
    <App limitImages={50}/>
  </Provider>,
  document.getElementById('main')
);


ObjectFit.polyfill({
  selector: '.preview-image img',
  fittype: 'contain',
  disableCrossdomain: true
});

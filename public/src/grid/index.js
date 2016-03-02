require('styles/grid');

import "babel-polyfill";
import React from 'react';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import Layout from 'grid/components/Layout';
import {DEFAULT_STATE} from 'grid/modules/state';
import {selectOuery} from 'grid/modules/actions';
import rootReducer from 'grid/modules/reducer';
import 'modernizr';
import ObjectFit from 'object-fit';


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

//store.dispatch(selectOuery({}));

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('main')
);


ObjectFit.polyfill({
  selector: '.preview-image img',
  fittype: 'contain',
  disableCrossdomain: true
});

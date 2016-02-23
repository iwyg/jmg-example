import "babel-polyfill";
import React from 'react';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from './modules/reducer';
import Layout from './components/Layout.jsx';
import {DEFAULT_STATE} from './modules/state';
import {selectOuery} from './modules/actions';

const configureStore = (initialState) => {
  const logger = createLogger();
  return createStore(rootReducer, initialState, applyMiddleware(thunk, logger));
};

const store = configureStore();



injectTapEventPlugin();

const mapStateToProps = function (state) {
  console.log(state);
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

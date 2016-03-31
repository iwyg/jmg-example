import {ENV, PRODUCTION} from 'runtime/constants';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer';

const configureStore = (function () {
  const middlewares = [thunk];

  if (ENV !== PRODUCTION) {
    middlewares.push(require('redux-logger')());
  }

  return (initialState) => {
    return createStore(rootReducer, initialState, applyMiddleware.apply(null, middlewares));
  };
}());

export default configureStore;

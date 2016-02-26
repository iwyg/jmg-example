import {combineReducers} from 'redux';
import queryString from 'query-string';
import {
  FETCH_RESULT_REQUEST, FETCH_RESULT_SUCCESS,
  FETCH_RESULT_ERROR, SELECT_QUERY
} from './actions';

const getUrl = (query = {}, base = DEFAULT_URL) => {
  if (Object.keys(query).length === 0) {
    return base;
  }

  return base + '?' + queryString.stringify(query);
};

const createUrlFactory = (query) => {
  return () => getUrl(query);
};

const defaultUrl = {
  query: {},
  uri() {
    return DEFAULT_URL;
  }
};

export const fetchUrl = (state = defaultUrl, action) => {
  if (action.type === SELECT_QUERY) {
    const {query} = action.payload;
    const uri = createUrlFactory(query);
    return {query, uri};
  }
  return state;
};

export const fetching  = (state = false, action) => {
  switch (action.type) {
    case FETCH_RESULT_REQUEST:
        let {fetching} = action.payload;
        return fetching;
    case FETCH_RESULT_SUCCESS:
        return false;
  }

  return state;
};

export const images  = (state = [], action) => {
  switch (action.type) {
    case FETCH_RESULT_ERROR:
        return state;
    case FETCH_RESULT_SUCCESS:
        let {images} = action.payload;
        return images;
  }
  return state;
};

const rootReducer = combineReducers({
  fetchUrl,
  fetching,
  images
});

export default rootReducer;

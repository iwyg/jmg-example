import {combineReducers} from 'redux';
import queryString from 'query-string';
import {
  QUERY_ALL_RESULT_REQUEST,  QUERY_ALL_RESULT_SUCCESS,  QUERY_ALL_RESULT_ERROR,
  QUERY_IMAGE_RESULT_REQUEST, QUERY_IMAGE_RESULT_SUCCESS, QUERY_IMAGE_RESULT_ERROR,
  SELECT_QUERY_ALL, SELECT_QUERY_IMAGE, SELECT_MODE,
} from './actions';

const getUrl = (query = {}, image = null, base = DEFAULT_URL) => {
  let uri = image ? base + '/' + image : base;
  if (Object.keys(query).length === 0) {
    return uri;
  }

  return uri + '?' + queryString.stringify(query);
};

const createUrlFactory = (query, image = null) => {
  return () => getUrl(query, image);
};

const defaultUrl = {
  query: {},
  uri() {
    return DEFAULT_URL;
  }
};

export const fetchUrl = (state = defaultUrl, action) => {
  if (action.type === SELECT_QUERY_ALL) {
    const {query} = action.payload;
    const uri = createUrlFactory(query);
    return {query, uri};
  }
  return state;
};

export const fetchImage = (state = {query: null, uri: null}, action) => {
  if (action.type === SELECT_QUERY_IMAGE) {
    const {image, query} = action.payload;
    const uri = createUrlFactory(query, image);
    return {query, uri};
  }
  return state;
};

export const fetching  = (state = false, action) => {
  switch (action.type) {
    case QUERY_ALL_RESULT_REQUEST:
    case QUERY_IMAGE_RESULT_REQUEST:
        let {fetching} = action.payload;
        return fetching;
    case QUERY_ALL_RESULT_SUCCESS:
    case QUERY_IMAGE_RESULT_SUCCESS:
        return false;
  }

  return state;
};

export const images  = (state = [], action) => {
  switch (action.type) {
    case QUERY_ALL_RESULT_ERROR:
        return state;
    case QUERY_ALL_RESULT_SUCCESS:
        let {images} = action.payload;
        return images;
  }
  return state;
};

export const image  = (state = null, action) => {
  switch (action.type) {
    case QUERY_IMAGE_RESULT_ERROR:
        return state;
    case QUERY_IMAGE_RESULT_SUCCESS:
        let {image} = action.payload;
        return image;
  }
  return state;
};

const rootReducer = combineReducers({
  fetchUrl,
  fetchImage,
  fetching,
  images,
  image
});

export default rootReducer;

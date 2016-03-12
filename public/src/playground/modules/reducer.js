import {combineReducers} from 'redux';
import queryString from 'query-string';
import {isObject, isArray} from 'lib/assert';
import {
  QUERY_ALL_RESULT_REQUEST,  QUERY_ALL_RESULT_SUCCESS,  QUERY_ALL_RESULT_ERROR,
  QUERY_IMAGE_RESULT_REQUEST, QUERY_IMAGE_RESULT_SUCCESS, QUERY_IMAGE_RESULT_ERROR,
  SELECT_QUERY_ALL, SELECT_QUERY_IMAGE, SELECT_MODE,
  SET_IMAGE_PARAMS,
  TOGGLE_GRID
} from './actions';

const getUrl = (query = [], image = null, base = DEFAULT_URL) => {
  console.log('QUERY', query);
  let uri = image ? base + '/' + image : base;
  if (query.length === 0) {
    return uri;
  }

  let q = {jmg: query.map((p) => {
    return getParamStrings(p).join('|');
  })}

  return uri + '?' + queryString.stringify(q);
};

const getParamStrings = (param) => {
  let p = filterParam(param);
  return [Object.values(param[0]).join(':')]
}

const filterParam = (param) => {
  if (isObject(param)) {
    return [param, null];
  }

  return param;
};

const createUrlFactory = (query, image = null) => {
  return () => getUrl(query, image);
};

const defaultUrl = {
  query: [],
  uri() {
    return DEFAULT_URL;
  }
};

export const imageParams = (state = [], action) => {
  if (action.type === SET_IMAGE_PARAMS) {
    return action.payload;
  }

  return state;
};

export const fetchImages = (state = defaultUrl, action) => {
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

export const fetchingImages  = (state = false, action) => {
  switch (action.type) {
    case QUERY_ALL_RESULT_REQUEST:
      let {fetching} = action.payload;
      return fetching;
    case QUERY_ALL_RESULT_SUCCESS:
      return false;
  }

  return state;
};

export const fetchingImage  = (state = false, action) => {
  switch (action.type) {
    case QUERY_IMAGE_RESULT_REQUEST:
      let {fetching} = action.payload;
      return fetching;
    case QUERY_IMAGE_RESULT_SUCCESS:
      return false;
  }

  return state;
};

export const images  = (state = [], action) => {
  switch (action.type) {
    case QUERY_ALL_RESULT_SUCCESS:
      let {images} = action.payload;
      return images;
  }
  return state;
};

export const image  = (state = null, action) => {
  switch (action.type) {
    case QUERY_IMAGE_RESULT_SUCCESS:
      let {image} = action.payload;
      return image;
  }
  return state;
};

export const fetchError = (state = {error: false, msg: null}, action) => {
  switch (action.type) {
    case QUERY_ALL_RESULT_ERROR:
    case QUERY_IMAGE_RESULT_ERROR:
      let {error} = action;
      let {msg} = action.payload;
      return {error, msg};
  }

  return state;
};

export const gridVisible = (state = false, action) => {
  if (action.type === TOGGLE_GRID) {
    return !state;
  }

  return state;
}

const rootReducer = combineReducers({
  fetchImages,
  fetchImage,
  fetchingImage,
  fetchingImages,
  fetchError,
  images,
  imageParams,
  image,
  gridVisible
});

export default rootReducer;

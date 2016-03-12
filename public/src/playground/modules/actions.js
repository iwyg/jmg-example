import fetch from 'isomorphic-fetch';
import MODES, {initial, parseValues} from './modes';

export const QUERY_ALL_RESULT_REQUEST   = 'QUERY_ALL_RESULT_REQUEST';
export const QUERY_ALL_RESULT_SUCCESS   = 'QUERY_ALL_RESULT_SUCCESS';
export const QUERY_ALL_RESULT_ERROR     = 'QUERY_ALL_RESULT_ERROR';

export const QUERY_IMAGE_RESULT_REQUEST = 'QUERY_IMAGE_RESULT_REQUEST';
export const QUERY_IMAGE_RESULT_SUCCESS = 'QUERY_IMAGE_RESULT_SUCCESS';
export const QUERY_IMAGE_RESULT_ERROR   = 'QUERY_IMAGE_RESULT_ERROR';

export const SELECT_QUERY_ALL           = 'SELECT_QUERY_ALL';
export const SELECT_QUERY_IMAGE         = 'SELECT_QUERY_IMAGE';

export const SELECT_MODE                = 'SELECT_MODE';

export const TOGGLE_GRID                = 'TOGGLE_GRID';
export const SET_IMAGE_PARAMS           = 'SET_IMAGE_PARAMS';

const isError = (response) =>  {
  return response.status >= 400 && response.status < 600;
};

const getQueryString = (query = {}) => {
  return queryString.stringify(query);
};

/* Action creators */
export const selectQuery = (query = []) => {
  return {
    type: SELECT_QUERY_ALL,
    payload: {
      query
    }
  };
};

export const selectImage = (image = null, query = []) => {
  return {
    type: SELECT_QUERY_IMAGE,
    payload: {
      image : image, query
    }
  };
};

export const selectMode = (mode = MODES.IM_NOSCALE) => {
  return {
    type: SELECT_MODE,
    payload: {
      mode
    }
  };
};

/* requests */
export const fetchRequestedImages = (url) => {
  return {
    type: QUERY_ALL_RESULT_REQUEST,
    payload: {
      fetchUrl: url,
      fetching: true
    }
  };
};

export const fetchRequestedImage = (url) => {
  return {
    type: QUERY_IMAGE_RESULT_REQUEST,
    payload: {
      fetchImage: url,
      fetching: true
    }
  };
};

/* success */
export const fetchImagesSucceeded = (payload = {}) => {
  return {
    type: QUERY_ALL_RESULT_SUCCESS,
    payload: Object.assign({}, payload, {fetching: false})
  };
};

export const fetchImageSucceeded = (payload = {}) => {
  return {
    type: QUERY_IMAGE_RESULT_SUCCESS,
    payload: Object.assign({}, payload, {fetching: false})
  };
};

/* errors */

export const fetchImagesFailed = (msg = 'fetching result failed.') => {
  return {
    type: QUERY_ALL_RESULT_ERROR,
    payload: msg instanceof Error ? msg : new Error(msg),
    error: true
  };
};

export const fetchImageFailed = (msg = 'fetching result failed.') => {
  return {
    type: QUERY_IMAGE_RESULT_ERROR,
    payload: msg instanceof Error ? msg : new Error(msg),
    error: true
  };
};

const doFetchAssets = (parse, actionFetch, actionSuccess, actionError) => {
  return (url) => {
    return (dispatch) => {
      dispatch(actionFetch(url));
      return fetch(url).then((response) => {
        if (isError(response)) {
          return Promise.reject(response.statusText);
        }
        return response.json();
      }).then((json) => {
        let res = parse(json);
        return dispatch(actionSuccess(res));
      }).catch(err => dispatch(actionError));
    };
  }
};

export const fetchImages = doFetchAssets(
  json => json,
  fetchRequestedImages,
  fetchImagesSucceeded,
  fetchImagesFailed
);

export const fetchImage = doFetchAssets(
  (json) => {
    let image = json.images && json.images.length ? json.images[0] : null;
    if (image === null) {
      return Promise.reject('response returned no image.');
    }
    return {image};
  },
  fetchRequestedImage,
  fetchImageSucceeded,
  fetchImageFailed
);

export const setImageParams = (params = []) => {
  return {
    type: SET_IMAGE_PARAMS,
    payload: params
  };
}

export const toggleGrid = (visible) => {
  return {
    type: TOGGLE_GRID,
    payload: visible
  };
}


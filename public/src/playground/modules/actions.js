import fetch from 'isomorphic-fetch';
import MODES, {initial, parseValues} from './modes';
import {defaultSettings, defaultSettingsImages} from './settings';

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

/*
 * edit actions
 */
export const SETTINGS_ADD               = 'SETTINGS_ADD';
export const SETTINGS_REMOVE            = 'SETTINGS_REMOVE';
export const SETTINGS_UPDATE            = 'SETTINGS_UPDATE';
export const SETTINGS_CHANGE_MODE       = 'SETTINGS_CHANGE_MODE'
export const SETTINGS_UPDATE_PARAMS     = 'SETTINGS_UPDATE_PARAMS';

export const SETTINGS_TOGGLE_VISIBLE    = 'SETTINGS_TOGGLE_VISIBLE';
export const SETTINGS_IMAGES_CHANGE     = 'SETTINGS_IMAGES_CHANGE';

const isError = (response) =>  {
  return response.status >= 400 && response.status < 600;
};

const getQueryString = (query = {}) => {
  return queryString.stringify(query);
};

/* Action creators */
export const selectQuery = (settings = []) => {
  return {
    type: SELECT_QUERY_ALL,
    payload: {settings}
  };
};

export const selectImage = (image = null, settings = []) => {
  return {
    type: SELECT_QUERY_IMAGE,
    payload: {
      image : image,
      settings
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
export const fetchImagesSucceeded = (payload = {images: []}) => {
  return {
    type: QUERY_ALL_RESULT_SUCCESS,
    payload: Object.assign({}, payload, {fetching: false})
  };
};

export const fetchImageSucceeded = (payload = {image: null}) => {
  return {
    type: QUERY_IMAGE_RESULT_SUCCESS,
    payload: Object.assign({}, payload, {fetching: false})
  };
};

/* errors */

export const fetchImagesFailed = (msg = 'fetching result failed.') => {
  msg = msg instanceof Error ? msg : new Error(msg);
  return {
    type: QUERY_ALL_RESULT_ERROR,
    payload: {msg},
    error: true
  };
};

export const fetchImageFailed = (msg = 'fetching result failed.') => {
  msg = msg instanceof Error ? msg : new Error(msg);
  return {
    type: QUERY_IMAGE_RESULT_ERROR,
    payload: {msg},
    error: true
  };
};

const doFetchAssets = (parse, actionFetch, actionSuccess, actionError) => {
  return (url) => {
    return (dispatch) => {
      if (url === null)  {
        return dispatch(actionSuccess());
      }
      dispatch(actionFetch(url));
      return fetch(url).then((response) => {
        if (isError(response)) {
          return Promise.reject(response.statusText);
        }
        return response.json();
      }).then((json) => {
        let res = parse(json);
        return dispatch(actionSuccess(res));
      }).catch((err) => {
        dispatch(actionError(err))
        return err;
      });
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
};

export const toggleGrid = (visible) => {
  return {
    type: TOGGLE_GRID,
    payload: visible
  };
};

export const addSettings = (setting = defaultSettings) => {
  return {
    type: SETTINGS_ADD,
    payload: {setting}
  };
};

export const removeSettings = (index) => {
  return {
    type: SETTINGS_REMOVE,
    payload: {index}
  };
};

export const updateSettings = (setting, index) => {
  return {
    type: SETTINGS_UPDATE,
    payload: {index, setting}
  };
};

export const changeSettingsMode = (index, mode) => {
  return {
    type: SETTINGS_CHANGE_MODE,
    payload: {index, mode}
  };
};

export const toggleSettingVisible = (index) => {
  return {
    type: SETTINGS_TOGGLE_VISIBLE,
    payload: {index}
  };
};

export const updateParams = (mode, params, index) => {
  return {
    type: SETTINGS_UPDATE_PARAMS,
    payload: {mode, params, index}
  };
};

export const settingsImages = (index, width, settings = defaultSettingsImages) => {
  return {
    type: SETTINGS_IMAGES_CHANGE,
    payload: {index, width, settings}
  };
};

import {combineReducers} from 'redux';
import {clonedeep} from 'lodash.clonedeep';
import {isObject, isArray} from 'lib/assert';
import {createUrlFactory, defaultUrl} from './url';
import {
  QUERY_ALL_RESULT_REQUEST,  QUERY_ALL_RESULT_SUCCESS,  QUERY_ALL_RESULT_ERROR,
  QUERY_IMAGE_RESULT_REQUEST, QUERY_IMAGE_RESULT_SUCCESS, QUERY_IMAGE_RESULT_ERROR,
  SELECT_QUERY_ALL, SELECT_QUERY_IMAGE, SELECT_MODE,
  SET_IMAGE_PARAMS,
  TOGGLE_GRID,
  SETTINGS_ADD, SETTINGS_UPDATE, SETTINGS_REMOVE, SETTINGS_CHANGE_MODE,
  SETTINGS_UPDATE_PARAMS, SETTINGS_TOGGLE_VISIBLE,
  SETTINGS_IMAGES_CHANGE
} from './actions';

export const imageParams = (state = [], action) => {
  if (action.type === SET_IMAGE_PARAMS) {
    return action.payload;
  }

  return state;
};

export const fetchImages = (state = defaultUrl, action) => {
  switch (action.type) {
    case SELECT_QUERY_ALL:
      const {settings} = action.payload;
      const uri = createUrlFactory(settings);
      return {settings, uri};
    default:
      return state;
  }
};

export const fetchImage = (state = {query: null, uri: null}, action) => {
  switch (action.type) {
    case SELECT_QUERY_IMAGE:
      const {image, settings} = action.payload;
      const uri = createUrlFactory(settings, image);
      return {settings, uri};
    default:
      return state;
  }
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

const modeChange = (state, action) => {
  switch (action.type) {
      case SETTINGS_CHANGE_MODE:
        return {...state, index: action.payload.index}
      default:
        return state;
  }
};

const settingVisibility = (state, action) => {
  switch (action.type) {
      case SETTINGS_TOGGLE_VISIBLE:
        let {visible, ...props} = state;
        return Object.assign({}, props, {visible: !visible});
      default:
        return state;
  }
};

const settingUpdate = (state, action) => {
  switch (action.type) {
    case SETTINGS_UPDATE:
      let values = action.payload.setting;
      return Object.assign({}, state, {...values});
    default:
      return state;
  }
};

export const settings = (state = [], action) => {
  switch (action.type) {
      case SETTINGS_CHANGE_MODE:
        let setting = Object.assign({}, state[action.payload.index], {mode: action.payload.mode});
        return [
          ...state.slice(0, action.payload.index),
          setting,
          ...state.slice(action.payload.index + 1),
        ];
      case SETTINGS_ADD:
        return state.concat([action.payload.setting]);
      case SETTINGS_REMOVE:
        let {index} = action.payload;
        return [
          ...state.slice(0, action.payload.index),
          ...state.slice(action.payload.index + 1),
        ];
      case SETTINGS_UPDATE:
        return [
          ...state.slice(0, action.payload.index),
          settingUpdate(state[action.payload.index], action),
          ...state.slice(action.payload.index + 1),
        ];

      case SETTINGS_UPDATE_PARAMS:
        let params = Object.assign({}, state[action.payload.index].params);
        params[action.payload.mode] = action.payload.params;
        return [
          ...state.slice(0, action.payload.index),
          Object.assign({}, state[action.payload.index], {params: params}),
          ...state.slice(action.payload.index + 1),
        ];
      case SETTINGS_TOGGLE_VISIBLE:
        return [
          ...state.slice(0, action.payload.index),
          settingVisibility(state[action.payload.index], action),
          ...state.slice(action.payload.index + 1),
        ];
      default:
        return state;
  }
}

//export const settingsImages = (state = [], action) => {
//  switch (action.type) {
//    case SETTINGS_IMAGES_CHANGE:
//      return [];
//    default:
//      return state;
//  }
//};

const rootReducer = combineReducers({
  fetchImages,
  fetchImage,
  fetchingImage,
  fetchingImages,
  fetchError,
  images,
  imageParams,
  image,
  gridVisible,
  settings
});

export default rootReducer;

import fetch from 'isomorphic-fetch';

export const FETCH_RESULT_REQUEST = 'FETCH_RESULT_REQUEST';
export const FETCH_RESULT_SUCCESS = 'FETCH_RESULT_SUCCESS';
export const FETCH_RESULT_ERROR   = 'FETCH_RESULT_ERROR';
export const SELECT_QUERY   = 'SELECT_QUERY';

const isError = (response) =>  {
  return response.status >= 400 && response.status < 600;
};

const getQueryString = (query = {}) => {
  return queryString.stringify(query);
};

export const selectOuery = (query = {}) => {
  return {
    type: SELECT_QUERY,
    payload: {
      query
    }
  };
};

/* Action creators */
export const fetchRequested = (url) => {
  return {
    type: FETCH_RESULT_REQUEST,
    payload: {
      fetchUrl: url,
      fetching: true
    }
  };
};

export const fetchSucceeded = (payload = {}) => {
  return {
    type: FETCH_RESULT_SUCCESS,
    payload: Object.assign({}, payload, {fetching: false})
  };
};

export const fetchFailed = (msg = 'fetching result failed.') => {
  console.log(arguments);
  return {
    type: FETCH_RESULT_ERROR,
    payload: msg instanceof Error ? msg : new Error(msg),
    error: true
  };
};

export const fetchImages = (url) => {
  return function (dispatch) {
    dispatch(fetchRequested(url));
    return fetch(url)
      .then(function (response) {
        if (isError(response)) {
          return Promise.reject(response.statusText);
        }
        return response.json();
      })
      .then(function (json) {
         return dispatch(fetchSucceeded(json));
      })
      .catch(err => dispatch(fetchFailed(err)));
  };
};

import {isObject} from 'lib/assert';
import {DEFAULT_URL} from 'runtime/constants';
import {concatSettings} from './params';
import queryString from 'query-string';

export const defaultUrl = {
  settings: [],
  uri() {
    return DEFAULT_URL;
  }
};

export const getUrl = (settings = [], image = null, base = DEFAULT_URL) => {
  let uri = image ? `${base}/${image}` : base;

  if (!settings.length) {
    return uri;
  }

  let query = concatSettings(settings).map((str) => {
    return `jmg[]=${str}`;
  }).join('&');


  //let query = queryString.stringify({'jmg[]': concatSettings(settings)});
  return `${uri}?${query}`;
};

export const createUrlFactory = (settings, image = null) => {
  return () => getUrl(settings, image);
};

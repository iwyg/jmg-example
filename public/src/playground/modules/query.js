import {isArray} from 'lib/assert';
import {helper} from 'modes';
import queryString from 'query-string';

export const paramsToQuery = (params, key = 'jmg') => {
  if (!isArray(params)) {
    throw new Error();
  }

  let parser = params.map((p) => {
    return Object.values(helper.parseValues(p.mode, p)).join(':');
  });

  let qObj = {};
  qObj[key] = params;

  return queryString(qObj);
};

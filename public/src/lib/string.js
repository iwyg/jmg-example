import {isObject, isString} from 'lib/assert';

// cast first char to uppercase
export const ucFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// cast first char to lowercase
export const lcFirst = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export const typeOf = (thing, type) => {
  return typeof thing === type;
};

export const isFunc = (thing) => {
  return typeOf(thing, 'function');
};

export const isString = (thing) => {
  return typeOf(thing, 'string');
};

export const isObject = (thing) => {
  return typeOf(thing, 'object');
};

export const isArray = (thing) => {
  return typeOf(thing, 'array');
};

export const isNumber = (thing) => {
  return isNaN(thing) === false && typeOf(thing, 'number');
};

export const stringable = (thing) => {
  return isFunc(thing.toString);
};

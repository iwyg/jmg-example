import zipObject from 'lodash.zipobject';

const MODES = {
  IM_NOSCALE: 0,
  IM_RESIZE: 1,
  IM_SCALECROP: 2,
  IM_CROP: 3,
  IM_RSIZEFIT: 4,
  IM_RSIZEPERCENT: 5,
  IM_RSIZEPXCOUNT: 6
};

const parseGravity = (value) => {
    return Math.min(9, Math.max(0, parseInt(value)));
};

const parseResize = {
  width: parseInt,
  height: parseInt
};

const parseCrop = Object.assign({}, parseResize, {
  gravity: parseGravity
});

const parsePerc = {
  width: parseFloat
};

const parsePix = {
  width: parseInt
};

export const requiredParams = (mode) => {
  switch (mode) {
    case MODES.IM_NOSCALE:
        return {};
    case MODES.IM_RESIZE:
        return parseResize;
    case MODES.IM_SCALECROP:
        return parseCrop;
    case MODES.IM_CROP:
        return parseCrop;
    case MODES.IM_RSIZEFIT:
        return parseResize;
    case MODES.IM_RSIZEPERCENT:
        return parsePerc;
    case MODES.IM_RSIZEPXCOUNT:
        return parsePix;
  }
};

export const validateGravity = (gravity) => {
  return gravity > 0 && 10 > gravity;
}

/**
 * parseValues
 *
 * @param {int} mode given transform mode
 * @param {object} value = {} obecjt containing required key value pairs
 * @returns {object} sanitized from input value
 */
export const parseValues = (mode, value = {}) => {
  let decoder = requiredParams(mode);
  return zipObject(Object.keys(value), Object.keys(decoder).map((key) => {
    return decoder[key](value[key]);
  }));
};

/**
 * Creates an intial object with the appropriate key.
 *
 * @param {int} mode) given transform mode
 * @returns {object} mapped object
 */
export const initial = (mode) => {
  let keys = Object.keys(requiredParams(mode));
  return Object.freeze(zipObject(keys, keys.map(() => null)));
};

export default MODES;

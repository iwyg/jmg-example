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

export default MODES;

export const ModeNames = zipObject(Object.values(MODES), Object.keys(MODES));

export const getModeName = (mode) => {
  return ModeNames[mode] || new Error('Undefined mode.');
};

const parseGravity = (value) => {
    return Math.min(9, Math.max(0, parseInt(value)));
};

const parseResize = {
  width: parseInt,
  height: parseInt
};

const parseCrop = Object.assign({}, parseResize, {
  gravity: parseGravity,
  width: parseInt,
  height: parseInt,
  background: (v) => {return v.toString();}
});
const parseCropResize = Object.assign({}, parseResize, {
  gravity: parseGravity,
  width: parseInt,
  height: parseInt
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
        return parseCropResize;
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
};

const notZero = (parsed) => {
  if (parsed.width < 1 || parsed.height < 1) {
    throw new Error('Values can\'t be zero.');
  }
}

export const validate = (mode, values = {}) => {
  let parsed = parseValues(mode, values);
  switch (mode) {
    case MODES.IM_RESIZE:
      if (Math.max(0, parsed.width, parsed.height) < 1) {
        throw new Error('Both, width and height can\'t be zero.');
      }
      break;
    case MODES.IM_CROP:
    case MODES.IM_SCALECROP:
      if (!validateGravity(parsed.gravity)) {
        throw new Error('Invalid gravity');
      }
      notZero(parsed);
      break;
    case MODES.IM_RSIZEFIT:
      notZero(parsed);
      break;
    case MODES.IM_RSIZEPERCENT:
      if (parsed.width === 0) {
        throw new Error('Invalid scale.');
      }
      break;
    case MODES.IM_RSIZEPXCOUNT:
      if (parsed.width < 1) {
        throw new Error('Invalid pixel count.');
      }
      break;
  }
  return parsed;
};

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

export const helper = {
  initial, parseValues, validate, validateGravity
};

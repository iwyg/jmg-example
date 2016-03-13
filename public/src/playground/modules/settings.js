import MODES from './modes';

const getInitialModes = (minW, minH, minPx, minScale) => {
  let modes = {};
  modes[MODES.IM_NOSCALE] = {};
  modes[MODES.IM_RESIZE] = {width: 0, height: 0};
  modes[MODES.IM_SCALECROP] = {width: minW, height: minH, gravity: 5};
  modes[MODES.IM_CROP] = {width: minW, height: minH, gravity: 5, background: 'f7f7f7'};
  modes[MODES.IM_RSIZEFIT] = {width: minW, height: minH};
  modes[MODES.IM_RSIZEPERCENT] = {width: minScale};
  modes[MODES.IM_RSIZEPXCOUNT] = {width: minPx};

  return modes;
};

const initialModes = getInitialModes(200, 200, 1000, 10);

export const defaultSettings = (function () {
  return {
    mode: MODES.IM_NOSCALE,
    params: initialModes,
    filters: []
  };
}());

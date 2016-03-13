import MODES from './modes';

const getInitialModes = (constr) => {
  let modes = {};
  modes[MODES.IM_NOSCALE] = {};
  modes[MODES.IM_RESIZE] = {width: constr[MODES.IM_RESIZE].minW, height: 0};
  modes[MODES.IM_SCALECROP] = {width: constr[MODES.IM_SCALECROP].minW, height: constr[MODES.IM_SCALECROP].minH, gravity: 5};
  modes[MODES.IM_CROP] = {width: constr[MODES.IM_CROP].minW, height: constr[MODES.IM_CROP].minH, gravity: 5, background: 'f7f7f7'};
  modes[MODES.IM_RSIZEFIT] = {width: constr[MODES.IM_RSIZEFIT].minW, height: constr[MODES.IM_RSIZEFIT].minH};
  modes[MODES.IM_RSIZEPERCENT] = {width: constr[MODES.IM_RSIZEPERCENT].minScale};
  modes[MODES.IM_RSIZEPXCOUNT] = {width: constr[MODES.IM_RSIZEPXCOUNT].minPx};

  return modes;
};

const initialModes = getInitialModes(JMG_CONFIG);

export const defaultSettings = (function () {
  return {
    mode: MODES.IM_NOSCALE,
    params: initialModes,
    filters: []
  };
}());

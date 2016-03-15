export const PARAMS_SORT_KEYS = ['width', 'height', 'gravity', 'background'];

export const stripFilters = (filters = []) => {
  return filters.map((filter) => {
    let opts = filter.options.map((o) => {
      return `${o.name}=${o.value}`
    }).join(';');
    return `${filter.name}:${opts}`
  });
};

export const stripParams = (mode, params = {}) => {
  return [mode].concat(PARAMS_SORT_KEYS.filter((key) => {
    return params.hasOwnProperty(key);
  }).map((key) => {
    return params[key];
  }));
};

export const concatSettings = (settings = [], psp = ':', fsp = ':filters:') => {
  return settings.map((setting, i) => {
    let params  = stripParams(setting.mode, setting.params[setting.mode]);
    let filters = stripFilters(setting.filters);
    return params.join(psp) + (!filters.length ? '' : fsp + filters.join(':'));
  });
};

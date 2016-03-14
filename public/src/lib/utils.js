
export const assignFromObj = (oo, obj) => {
  let n = {}, keys = Object.keys(oo), l = keys.length, i = 0;
  for (; i < l; i++) {
    if (obj.hasOwnProperty(keys[i])) {
      n[keys[i]] = obj[keys[i]];
    }
  }
  return n;
};

import {isDefined, isFunc, isObject, isString} from 'lib/assert';

export const className = (base, props = {}) => {
  return isDefined(props.className) ? [base, props.className].join(' ') : base;
};

export const classNames = (...args) => {
  return args.map((name) => {
    return isString(name) ? name : isObject(name) ? classNames.apply(null, Object.keys(name).filter(n => name[n])) : '';
  }).join(' ');
};

export const callIfFunc = (fn, context = null, ...args) => {
  if (isFunc(fn)) {
    return fn.apply(context, args);
  }
};

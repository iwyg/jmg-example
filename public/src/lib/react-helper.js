import {isDefined, isFunc} from 'lib/assert';

export const className = (base, props = {}) => {
  return isDefined(props.className) ? [base, props.className].join(' ') : base;
};

export const callIfFunc = (fn, context = null, ...args) => {
  if (isFunc(fn)) {
    return fn.apply(context, args);
  }
};

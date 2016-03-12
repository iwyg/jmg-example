import {isDefined} from 'lib/assert';

export const className = (base, props = {}) => {
  return isDefined(props.className) ? [base, props.className].join(' ') : base;
};

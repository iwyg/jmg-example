/* mode to come */

export const CONTEXT = window;
export const DEFAULT_URL = CONTEXT.DEFAULT_URL;
export const JMG_CONFIG  = CONTEXT.JMG_CONFIG;
export const ENV  = (function() {
  let proc = require('process');
  if (proc.env && proc.env.NODE_ENV !== undefined) {
    return proc.env.NODE_ENV;
  }

  return 'development';
}());

export const PRODUCTION = 'production';

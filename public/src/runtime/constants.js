/* mode to come */

export const CONTEXT = window;
export const DEFAULT_URL = CONTEXT.DEFAULT_URL;
export const JMG_CONFIG  = CONTEXT.JMG_CONFIG;
export const ENV  = (function(undefined) {
  if (process !== undefined && process.env !== undefined && process.env.NODE_ENV !== undefined) {
    return process.env.NODE_ENV;
  }

  return NODE_ENV !== undefined ? NODE_ENV : 'development';
}());


export const PRODUCTION = 'production';

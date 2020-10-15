'use strict';
const os = require('os');

/**
 * egg-titans default config
 * @member Config#titans
 * @property {String} SOME_KEY - some description
 */
exports.titans = {
  instance: `${os.hostname()}.${process.pid}`,
  ignorePaht: [],
  httpResponseSizeBytesEnabled: true,
  httpRequestErrorTotalEnabled: true,
  defaultMetricEnabled: true,
  gcStateMetricEnabled: true,
  pathTransform: (opt, ctx) => (ctx._matchedRouteName || ctx._matchedRoute || ctx.path || 'undefined'),
};

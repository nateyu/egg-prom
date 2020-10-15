'use strict';
const { prometheusExporterMiddleware } = require('prom-koa');
module.exports = (options, appInfo) => {
  return prometheusExporterMiddleware(
    Object.assign({ app: appInfo.name, env: appInfo.config.env }, options)
  );
};

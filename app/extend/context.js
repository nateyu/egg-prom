'use strict';
const { promClient } = require('prom-koa');

module.exports = {
  get prometheus() {
    return this._prometheus || promClient;
  },

  set prometheus(client) {
    this._prometheus = client || promClient;
  },
};

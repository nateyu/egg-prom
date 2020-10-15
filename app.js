'use strict';
const { promClient } = require('prom-koa');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configDidLoad() {
    // make sure titans in top of middleware stack
    this.app.config.coreMiddleware.unshift('titans');
  }

  async didReady() {
    const app = this.app;
    app.messenger.on('get-metrics', data => {
      const msg = {
        from: process.pid,
        msgId: data.msgId,
        metrics: promClient.register.getMetricsAsJSON(),
      };

      app.messenger.sendToAgent('metrics', msg);
    });
  }

}

module.exports = AppBootHook;

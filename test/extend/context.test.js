'use strict';
const assert = require('assert');
const mm = require('egg-mock');
const { promClient } = require('prom-koa');

describe('test/extend/context.test.js', () => {
  let app;

  before(() => {
    app = mm.app({
      baseDir: 'apps/test-app',
    });
    return app.ready();
  });

  afterEach(() => {
    mm.restore;
  });

  after(async () => {
    promClient.register.clear();
    await app.agent.clusterMetricServer.close();
    await app.close();
  });


  it('should get prometheus', () => {
    const ctx = app.mockContext();
    assert(ctx.prometheus);
    assert(ctx.prometheus.register.getSingleMetric('http_request_total'));
    assert(ctx.prometheus.register.getSingleMetric('http_request_duration'));
    assert(ctx.prometheus.register.getSingleMetric('http_request_size_bytes'));
    assert(ctx.prometheus.register.getSingleMetric('http_response_size_bytes'));
    assert(ctx.prometheus.register.getSingleMetric('http_request_error_total'));
    assert(ctx.prometheus.register.getSingleMetric('process_cpu_user_seconds_total'));
    assert(ctx.prometheus.register.getSingleMetric('nodejs_active_handles'));
    assert(ctx.prometheus.register.getSingleMetric('process_resident_memory_bytes'));
    assert(ctx.prometheus.register.getSingleMetric('nodejs_gc_runs_total'));
  });

  it('should set prometheus', () => {
    const ctx = app.mockContext();
    ctx.prometheus = promClient;
    assert(ctx.prometheus);
    assert(ctx.prometheus.register.getSingleMetric('http_request_total'));
    assert(ctx.prometheus.register.getSingleMetric('http_request_duration'));
    assert(ctx.prometheus.register.getSingleMetric('http_request_size_bytes'));
    assert(ctx.prometheus.register.getSingleMetric('http_response_size_bytes'));
    assert(ctx.prometheus.register.getSingleMetric('http_request_error_total'));
    assert(ctx.prometheus.register.getSingleMetric('process_cpu_user_seconds_total'));
    assert(ctx.prometheus.register.getSingleMetric('nodejs_active_handles'));
    assert(ctx.prometheus.register.getSingleMetric('process_resident_memory_bytes'));
    assert(ctx.prometheus.register.getSingleMetric('nodejs_gc_runs_total'));
  });

});

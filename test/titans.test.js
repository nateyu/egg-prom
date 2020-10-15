'use strict';
const assert = require('assert');
const mm = require('egg-mock');
const { promClient } = require('prom-koa');

describe('test/titans.test.js', () => {
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

  it('should GET / with normal request', () => {
    return app.httpRequest()
      .get('/')
      .expect(200)
      .expect('hi, titans');
  });

  it('should GET /metrics with single process metrics return', async () => {
    await app.httpRequest().get('/');
    return app.httpRequest()
      .get('/metrics')
      .expect(200)
      .expect('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
      .expect(res => {
        assert(res.text.includes('http_request_total'));
        assert(res.text.includes('http_request_duration_count'));
        assert(res.text.includes('http_response_size_bytes_count'));
        assert(res.text.includes('http_request_error_total'));
      });
  });

  it('should get prometheus client from a ctx', () => {
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

  it('should get prometheus client from a anonymous ctx', () => {
    const ctx = app.createAnonymousContext();
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

  it('should get cluster metrics', async () => {
    const res = await app.curl(`localhost:${app.config.titans.clusterMetricPort || 9092}/metrics`, {
      dataType: 'text',
    });
    assert.equal(res.status, 200, 'cluster metrics reqeust status should be 200');
    assert(res.data.includes('http_request_total'));
    assert(res.data.includes('http_request_duration'));
    assert(res.data.includes('http_request_size_bytes'));
    assert(res.data.includes('http_response_size_bytes'));
    assert(res.data.includes('http_request_error_total'));
    assert(res.data.includes('process_cpu_user_seconds_total'));
    assert(res.data.includes('nodejs_active_handles'));
    assert(res.data.includes('process_resident_memory_bytes'));
    assert(res.data.includes('nodejs_gc_runs_total'));
  });
});

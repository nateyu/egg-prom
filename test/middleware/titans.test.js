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
    mm.env('unittest');
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

  it('should get prometheus client from a ctx', async () => {
    await app.httpRequest().get('/');
    return app.httpRequest()
      .get('/metrics')
      .expect(200)
      .expect('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
      .expect(res => {
        assert(res.text.includes('env=\"unittest\"'));
        assert(res.text.includes('http_request_total'));
        assert(res.text.includes('http_request_duration_count'));
        assert(res.text.includes('http_response_size_bytes_count'));
        assert(res.text.includes('http_request_error_total'));
      });
  });
});

'use strict';
const http = require('http');
const { promClient } = require('prom-koa');

class AgentBootHook {
  constructor(agent) {
    this.agent = agent;
  }

  async didReady() {
    const agent = this.agent;
    agent.messenger.on('egg-ready', function () {
      const requrestsMap = new Map();
      let requestCount = 0,
        wokerIds = [];

      function fetchMetrics(done) {
        requestCount++;
        wokerIds = agent.messenger.opids;
        const msg = {
          from: process.pid,
          msgId: requestCount,
          msg: 'get-metrics',
        };

        const request = {
          status: wokerIds.length,
          wokerIds,
          done,
          msg,
          metrics: [],
          timeout: setTimeout(() => {
            request.failed = true;
            const err = new Error('fetch metric from worker timed out.');
            request.done(err, null);
          }, 5000),
          failed: false,
        };

        requrestsMap.set(requestCount, request);
        agent.messenger.sendToApp('get-metrics', msg);
      }

      agent.messenger.on('metrics', data => {
        const request = requrestsMap.get(data.msgId);
        request.metrics.push(data.metrics);
        request.wokerIds = request.wokerIds.filter(i => i !== data.from);
        if (request.wokerIds.length === 0) {
          requrestsMap.delete(data.msgId);
          clearTimeout(request.timeout);
          if (request.failed) return;
          const registry = promClient.AggregatorRegistry.aggregate(request.metrics);
          const promString = registry.metrics();
          request.done(null, promString);
        }
      });

      // TOD: stop cluser metric server when agent process exit
      if (!(agent.clusterMetricServer && agent.clusterMetricServer.listening)) {
        const server = http.createServer((req, res) => {
          if (req.url === (agent.config.titans.metricPath || '/metrics')) {
            res.setHeader('Content-Type', promClient.register.contentType);
            fetchMetrics((e, r) => {
              res.end(r);
            });
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('not found');
          }
        });

        server.listen({ port: agent.config.titans.clusterMetricPort || 9092 }, e => {
          if (e) {
            agent.logger.info(`cluster metric server listen failed ${e.code} ${e.message}`);
          } else {
            agent.clusterMetricServer = server;
            agent.logger.info(`cluster metric server listen on  ${server.address().address}:${server.address().port}`);
          }
        });
      }
    });
  }
}

module.exports = AgentBootHook;

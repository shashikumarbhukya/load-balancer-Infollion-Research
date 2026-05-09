const metrics = {
  totalRequests: 0,
  perNodeHits: {},
  rejectedRequests: 0,
};

function recordRequest(nodeName) {
  metrics.totalRequests += 1;
  metrics.perNodeHits[nodeName] = (metrics.perNodeHits[nodeName] || 0) + 1;
}

function recordRejectedRequest() {
  metrics.rejectedRequests += 1;
}

function getMetrics() {
  return metrics;
}

module.exports = {
  recordRequest,
  recordRejectedRequest,
  getMetrics,
};

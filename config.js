const nodes = [
  { name: "Node-A", weight: 3, healthy: true },
  { name: "Node-B", weight: 2, healthy: true },
  { name: "Node-C", weight: 1, healthy: true },
];

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const HASH_RING_REPLICAS = 50;

module.exports = {
  nodes,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  HASH_RING_REPLICAS,
};

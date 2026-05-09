const { nodes, HASH_RING_REPLICAS } = require("./config");
const { hashString, identifyNode } = require("./utils");
const { recordRequest } = require("./metrics");

function getHealthyNodes() {
  return nodes.filter((node) => node.healthy);
}

function buildHashRing() {
  const ring = [];
  const healthyNodes = getHealthyNodes();

  healthyNodes.forEach((node) => {
    const virtualNodeCount = node.weight * HASH_RING_REPLICAS;

    for (let i = 0; i < virtualNodeCount; i++) {
      ring.push({
        hash: hashString(`${node.name}-${i}`),
        node: node.name,
      });
    }
  });

  return ring.sort((a, b) => a.hash - b.hash);
}

function loadBalancer(ip) {
  const ring = buildHashRing();

  if (ring.length === 0) {
    throw new Error("No healthy nodes available");
  }

  const ipHash = hashString(ip);

  let selectedNode = ring[0].node;
  for (const point of ring) {
    if (ipHash <= point.hash) {
      selectedNode = point.node;
      break;
    }
  }

  identifyNode(ip, selectedNode);
  recordRequest(selectedNode);

  return selectedNode;
}

function updateNodeHealth(nodeName, healthy) {
  const node = nodes.find((item) => item.name === nodeName);
  if (!node) return null;

  node.healthy = healthy;
  return node;
}

function getNodes() {
  return nodes;
}

module.exports = {
  loadBalancer,
  updateNodeHealth,
  getNodes,
};

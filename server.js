const express = require("express");
const { loadBalancer, updateNodeHealth, getNodes } = require("./loadBalancer");
const { generateRandomIP, isValidIP } = require("./utils");
const { getMetrics, recordRejectedRequest } = require("./metrics");
const { isRateLimited } = require("./rateLimiter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Consistent Hash Load Balancer API is running",
    endpoints: [
      "GET /route?ip=192.168.1.10",
      "POST /simulate",
      "GET /nodes",
      "PATCH /nodes/:nodeName/health",
      "GET /metrics",
    ],
  });
});

app.get("/route", (req, res) => {
  const ip = req.query.ip || generateRandomIP();

  if (!isValidIP(ip)) {
    return res.status(400).json({ error: "Invalid IP address" });
  }

  if (isRateLimited(ip)) {
    recordRejectedRequest();
    return res.status(429).json({ error: "Rate limit exceeded for this IP" });
  }

  try {
    const selectedNode = loadBalancer(ip);
    return res.json({ ip, selectedNode });
  } catch (error) {
    return res.status(503).json({ error: error.message });
  }
});

app.post("/simulate", (req, res) => {
  const requestCount = req.body.requestCount || 10;
  const results = [];

  for (let i = 0; i < requestCount; i++) {
    const ip = generateRandomIP();
    const selectedNode = loadBalancer(ip);
    results.push({ ip, selectedNode });
  }

  res.json({ requestCount, results });
});

app.get("/nodes", (req, res) => {
  res.json({ nodes: getNodes() });
});

app.patch("/nodes/:nodeName/health", (req, res) => {
  const { nodeName } = req.params;
  const { healthy } = req.body;

  if (typeof healthy !== "boolean") {
    return res.status(400).json({ error: "healthy must be true or false" });
  }

  const updatedNode = updateNodeHealth(nodeName, healthy);

  if (!updatedNode) {
    return res.status(404).json({ error: "Node not found" });
  }

  res.json({ message: "Node health updated", node: updatedNode });
});

app.get("/metrics", (req, res) => {
  res.json(getMetrics());
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

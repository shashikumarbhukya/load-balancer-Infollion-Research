# Consistent Hash Load Balancer

This project implements a beginner-friendly backend load balancer using Node.js and Express.

It replaces random node selection with **consistent hashing**, so the same IP usually reaches the same node even when the number of nodes changes.

## Features

- Random IP generator
- Consistent hashing based load balancing
- Same IP maps to the same node
- Request logging
- Node health checks
- Weighted routing
- Simple metrics dashboard
- Basic rate limiting
- REST API endpoints

## Tech Stack

- Node.js
- Express.js
- In-memory data structures only

## Project Structure

```txt
load-balancer-project/
├── package.json
├── README.md
└── src/
    ├── config.js
    ├── loadBalancer.js
    ├── metrics.js
    ├── rateLimiter.js
    ├── server.js
    └── utils.js
```

## Setup

```bash
npm install
```

## Run Project

```bash
npm start
```

Server runs at:

```txt
http://localhost:3000
```

## API Endpoints

### 1. Check server

```http
GET /
```

### 2. Route a request

```http
GET /route?ip=192.168.1.10
```

Sample response:

```json
{
  "ip": "192.168.1.10",
  "selectedNode": "Node-B"
}
```

### 3. Route random IP

```http
GET /route
```

### 4. Simulate traffic

```http
POST /simulate
Content-Type: application/json

{
  "requestCount": 10
}
```

### 5. View nodes

```http
GET /nodes
```

### 6. Update node health

```http
PATCH /nodes/Node-B/health
Content-Type: application/json

{
  "healthy": false
}
```

### 7. View metrics

```http
GET /metrics
```



## CLI Demo Flow

```bash
npm install
npm start
```

Open another terminal:

```bash
curl "http://localhost:3000/route?ip=192.168.1.10"
curl "http://localhost:3000/route?ip=192.168.1.10"
curl "http://localhost:3000/nodes"
curl -X PATCH "http://localhost:3000/nodes/Node-B/health" \
  -H "Content-Type: application/json" \
  -d '{"healthy": false}'
curl "http://localhost:3000/metrics"
```

The same IP should route to the same node unless the selected node becomes unhealthy.

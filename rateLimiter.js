const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = require("./config");

const ipRequestStore = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const current = ipRequestStore.get(ip) || { count: 0, windowStart: now };

  if (now - current.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipRequestStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  current.count += 1;
  ipRequestStore.set(ip, current);

  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

module.exports = { isRateLimited };

function generateRandomIP() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".");
}

function hashString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function identifyNode(ip, selectedNode) {
  console.log(`Incoming IP: ${ip} → Routed to: ${selectedNode}`);
}

function isValidIP(ip) {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    const number = Number(part);
    return part !== "" && Number.isInteger(number) && number >= 0 && number <= 255;
  });
}

module.exports = {
  generateRandomIP,
  hashString,
  identifyNode,
  isValidIP,
};

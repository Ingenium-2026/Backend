// In-memory buffer for the last N events
const CAPACITY = 5000; // Keep last 5000 events or 5 mins
const buffer = [];

const pushCallback = [];

const add = (event) => {
  if (buffer.length >= CAPACITY) {
    buffer.shift();
  }
  buffer.push(event);
  pushCallback.forEach(cb => cb(event));
};

const getRecent = (seconds) => {
  const now = Date.now();
  const cutoff = now - (seconds * 1000);
  // Optimization: search form end
  const recent = [];
  for (let i = buffer.length - 1; i >= 0; i--) {
    if (buffer[i].ts < cutoff) break;
    recent.push(buffer[i]);
  }
  return recent; // Returns in reverse chronological order (newest first)
};

const onPush = (cb) => {
  pushCallback.push(cb);
};

module.exports = {
  add,
  getRecent,
  onPush
};

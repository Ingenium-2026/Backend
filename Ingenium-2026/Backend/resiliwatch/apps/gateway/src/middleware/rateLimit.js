const { getEnforcementState } = require('./enforcementCache');

// Local counters: Map<ruleKey, { count, windowStart }>
const counters = new Map();

module.exports = (req, res, next) => {
    const { rateLimits } = getEnforcementState(); // Array of { key, route, ip, userId, limitRps }

    if (!rateLimits || rateLimits.length === 0) return next();

    const now = Date.now();
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userId = req.headers['x-user-id'] || req.body.userId;
    const currentRoute = req.normalizedRoute;

    // Check if current request matches any active rate limit rule
    const matchedRule = rateLimits.find(rule => {
        let match = true;
        if (rule.route && rule.route !== currentRoute) match = false;
        if (rule.ip && rule.ip !== clientIP) match = false;
        if (rule.userId && rule.userId !== userId) match = false;
        return match;
    });

    if (matchedRule) {
        const key = matchedRule.key || `default_${matchedRule.ip}_${matchedRule.route}`;
        let record = counters.get(key);

        // Reset if window passed (1 second window)
        if (!record || now - record.windowStart > 1000) {
            record = { count: 0, windowStart: now };
        }

        record.count++;
        counters.set(key, record);

        if (record.count > matchedRule.limitRps) {
            // 429 Too Many Requests
            return res.status(429).json({ error: 'Rate limit exceeded: Active Mitigation Applied' });
        }
    }

    next();
};

const { getEnforcementState } = require('./enforcementCache');

module.exports = (req, res, next) => {
    const { blockedIPs, lockedAccounts } = getEnforcementState();
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userId = req.headers['x-user-id'] || req.body.userId; // Best effort

    // 1. Check IP Block
    if (blockedIPs && (blockedIPs.includes(clientIP) || blockedIPs.includes(clientIP.split(',')[0]))) {
        return res.status(403).json({ error: 'Access Denied: IP Blocked by ResiliWatch Protection' });
    }

    // 2. Check Account Lock
    if (userId && lockedAccounts && lockedAccounts.includes(userId)) {
        // If it's a login attempt, logic might be in auth route, but we can block here too if it's generic API
        return res.status(423).json({ error: 'Account Locked: Suspicious Activity Detected' });
    }

    next();
};

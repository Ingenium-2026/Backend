const { getEnforcementState } = require('./enforcementCache');

module.exports = (req, res, next) => {
    const { degradedMode } = getEnforcementState();

    if (degradedMode) {
        // RULE: Read-only EHR + Block Bulk endpoint
        const route = req.normalizedRoute;
        const method = req.method;

        // Block Writes to EHR
        if (route.startsWith('/ehr') && method !== 'GET') {
            return res.status(503).json({ error: 'Service Degraded: Writes disabled to protect data integrity.' });
        }

        // Block Bulk Read (The specific exfil vector)
        if (route === '/ehr/patient/:id/records') {
            return res.status(503).json({ error: 'Service Degraded: Bulk export temporarily suspended.' });
        }
    }

    next();
};

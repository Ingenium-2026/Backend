module.exports = (req, res, next) => {
    let normalized = req.path;

    // Heuristic normalization for the demo routes
    // /ehr/patient/123 -> /ehr/patient/:id

    if (normalized.startsWith('/ehr/patient/')) {
        const parts = normalized.split('/');
        // /ehr/patient/123/records
        if (parts[3]) {
            parts[3] = ':id';
            normalized = parts.join('/');
        }
    } else if (normalized.startsWith('/appointments/') && normalized !== '/appointments/book') {
        const parts = normalized.split('/');
        if (parts[2]) {
            parts[2] = ':id';
            normalized = parts.join('/');
        }
    }

    req.normalizedRoute = normalized;
    next();
};

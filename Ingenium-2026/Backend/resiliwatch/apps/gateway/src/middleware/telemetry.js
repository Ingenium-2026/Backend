const axios = require('axios');
const config = require('../config');

module.exports = (req, res, next) => {
    const start = Date.now();

    // Capture response finish
    res.on('finish', () => {
        if (!config.ENABLE_TELEMETRY) return;

        const duration = Date.now() - start;
        const telemetryData = {
            ts: Date.now(),
            service: 'gateway',
            targetService: req.baseUrl.replace('/', '') || 'unknown',
            route: req.normalizedRoute || req.path,
            method: req.method,
            status: res.statusCode,
            latencyMs: duration,
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
            userId: req.body.userId || req.headers['x-user-id'] || 'unknown',
            role: req.headers['x-role'] || 'unknown',
            bytesOut: parseInt(res.get('Content-Length') || 0),
            authResult: res.locals.authResult || (res.statusCode < 400 ? 'success' : 'fail')
        };

        // Fire and forget - don't await
        axios.post(`${config.DETECTOR_URL}/telemetry`, telemetryData)
            .catch(err => {
                // console.error('Telemetry send failed', err.message);
            });
    });

    next();
};

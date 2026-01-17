const { getState } = require('./state/store');

module.exports = (req, res) => {
    const { metrics, incidents } = getState();

    // Simple calculated metrics
    const avgLatency = 0; // would need to calculate from ringbuffer if needed

    res.json({
        ...metrics,
        activeIncidentsCount: incidents.filter(i => i.status !== 'resolved').length,
        uptime: process.uptime()
    });
};

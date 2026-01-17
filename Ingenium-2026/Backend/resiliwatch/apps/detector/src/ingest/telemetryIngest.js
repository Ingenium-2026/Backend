const ringBuffer = require('../ingest/ringBuffer');
const { updateState } = require('../state/store');

module.exports = (req, res) => {
    const event = req.body;

    // Basic validation
    if (!event || !event.ts) {
        return res.status(400).json({ error: 'Invalid telemetry' });
    }

    ringBuffer.add(event);

    updateState(state => {
        state.metrics.ingestRate++;
        state.metrics.totalEvents++;
    });

    res.status(202).send('Accepted');
};

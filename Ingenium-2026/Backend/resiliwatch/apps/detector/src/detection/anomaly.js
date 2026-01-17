const ss = require('simple-statistics');
const explain = require('./explain');

// Simple Z-score anomaly detector on RPS
// We maintain a sliding window of RPS averages
const historyRps = [];

const detectAnomaly = (events, windowSec = 10) => {
    // calculate current RPS
    // events should be last X seconds.
    const now = Date.now();
    const recentEvents = events.filter(e => e.ts > now - (windowSec * 1000));
    const currentRps = recentEvents.length / windowSec;

    // Add to history
    if (historyRps.length > 30) historyRps.shift(); // Keep 30 samples (5 mins if sampled every 10s)
    historyRps.push(currentRps);

    if (historyRps.length < 5) return null; // Training phase

    // Calculate Z-Score
    const mean = ss.mean(historyRps);
    const sd = ss.standardDeviation(historyRps);

    if (sd === 0) return null;

    const zScore = (currentRps - mean) / sd;

    if (zScore > 3) {
        return {
            rule: 'ANOMALY_RPS_SPIKE',
            severity: 'SEV2',
            observed: currentRps,
            threshold: 3, // Z-score threshold
            window: windowSec,
            explanation: explain('ANOMALY_RPS_SPIKE', zScore, 3, windowSec)
        };
    }
    return null;
};

module.exports = { detectAnomaly };

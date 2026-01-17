// explain.js
// Generates plain English explanations for alerts

const explain = (ruleName, observed, threshold, windowSec, deltaPct) => {
    let text = '';
    const pctStr = deltaPct ? ` (${deltaPct > 0 ? '+' : ''}${Math.round(deltaPct * 100)}% vs baseline)` : '';

    switch (ruleName) {
        case 'AUTH_FAIL_SPIKE':
            text = `Excessive failed logins detected from IP. Observed ${observed} failures in ${windowSec}s (Threshold: ${threshold}).${pctStr}`;
            break;
        case 'ACCOUNT_TARGETING':
            text = `Distributed password spraying attack. Targeted ${observed} distinct accounts in ${windowSec}s.`;
            break;
        case 'EHR_BULK_READ':
            text = `Potential Data Exfiltration: High volume of medical record access. ${observed} bulk reads in ${windowSec}s (Threshold: ${threshold}).${pctStr}`;
            break;
        case 'HIGH_BYTES_OUT':
            text = `Data Exfiltration Risk: Abnormal outbound data volume. Transferred ${(observed / 1024 / 1024).toFixed(2)} MB in ${windowSec}s.`;
            break;
        case 'ROUTE_FLOOD':
            text = `DoS Attempt: Route flooding detected. ${observed} requests to target in ${windowSec}s.`;
            break;
        case 'ANOMALY_RPS_SPIKE':
            text = `Traffic Anomaly: Sudden spike in request volume. Z-Score ${observed.toFixed(2)} (Threshold: ${threshold}).`;
            break;
        case 'ANOMALY_LATENCY_SPIKE':
            text = `Performance degradation detected. Average latency spiked to ${observed}ms.`;
            break;
        default:
            text = `Suspicious activity detected: ${ruleName} triggered with value ${observed}.`;
    }
    return text;
};

module.exports = explain;

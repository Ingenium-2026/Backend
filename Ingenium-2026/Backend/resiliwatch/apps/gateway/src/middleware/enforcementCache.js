const axios = require('axios');
const config = require('../config');

let enforcementState = {
    blockedIPs: [],
    lockedAccounts: [],
    rateLimits: [], // [{ key, route, ip, userId, limitRps }]
    degradedMode: false
};

const pollEnforcement = async () => {
    try {
        const response = await axios.get(`${config.DETECTOR_URL}/enforcement`, { timeout: 1000 });
        if (response.data) {
            enforcementState = response.data;
        }
    } catch (error) {
        // Silent fail on connection refused (Detector might be down)
        // console.error('Enforcement sync failed:', error.message);
    }
};

const startPolling = () => {
    setInterval(pollEnforcement, 1000); // Poll every second
};

const getEnforcementState = () => enforcementState;

module.exports = {
    startPolling,
    getEnforcementState
};

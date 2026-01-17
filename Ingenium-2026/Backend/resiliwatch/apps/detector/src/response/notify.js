// notify.js
const send = (incident) => {
    const msg = `[${incident.severity}] ${incident.type} detected. Status: ${incident.status}`;
    console.log('🚨 NOTIFICATION:', msg);
    // In real app, axios.post to Discord webhook
};

module.exports = { send };

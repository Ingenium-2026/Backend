const { updateState, getState } = require('../state/store');

const createIncident = (data) => {
    const id = 'inc-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const incident = {
        id,
        ...data,
        status: 'active',
        startedAt: Date.now(),
        lastSeenAt: Date.now(),
        phases: [{ phase: 'suspicious', at: Date.now() }],
        actions: []
    };

    updateState(state => {
        state.incidents.unshift(incident); // Newest first
        state.metrics.activeIncidents++;
    });

    return incident;
};

const updateIncident = (id, updates) => {
    updateState(state => {
        const idx = state.incidents.findIndex(i => i.id === id);
        if (idx !== -1) {
            state.incidents[idx] = { ...state.incidents[idx], ...updates, lastSeenAt: Date.now() };
        }
    });
};

const findActiveIncident = (type, key) => {
    const { incidents } = getState();
    // key could be ip or userId
    return incidents.find(i =>
        i.status !== 'resolved' &&
        i.type === type &&
        (i.ip === key || i.userId === key)
    );
};

module.exports = { createIncident, updateIncident, findActiveIncident };

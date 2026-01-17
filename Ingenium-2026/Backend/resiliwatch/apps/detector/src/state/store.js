// Central singleton store for the application state
let state = {
    incidents: [],     // List of Incident objects
    enforcement: {
        blockedIPs: [], // Array of strings
        lockedAccounts: [], // Array of userIds
        rateLimits: [], // [{ key, route, ip, userId, limitRps }]
        degradedMode: false
    },
    metrics: {
        ingestRate: 0,
        activeIncidents: 0,
        totalEvents: 0
    },
    settings: {
        autoResponse: true
    }
};

const subscribers = [];

const updateState = (updater) => {
    updater(state);
    notifySubscribers();
};

const getState = () => state;

const subscribe = (cb) => {
    subscribers.push(cb);
};

const notifySubscribers = () => {
    subscribers.forEach(cb => cb(state));
};

const resetState = () => {
    state = {
        incidents: [],
        enforcement: {
            blockedIPs: [],
            lockedAccounts: [],
            rateLimits: [],
            degradedMode: false
        },
        metrics: {
            ingestRate: 0,
            activeIncidents: 0,
            totalEvents: 0
        },
        settings: {
            autoResponse: true
        }
    };
};

module.exports = {
    getState,
    updateState,
    subscribe,
    resetState
};

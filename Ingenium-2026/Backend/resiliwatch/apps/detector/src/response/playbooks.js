const { updateState, getState } = require('../state/store');
const notify = require('./notify');

// Actions that can be taken
const ACTIONS = {
    BLOCK_IP: (target) => {
        updateState(state => {
            if (!state.enforcement.blockedIPs.includes(target)) {
                state.enforcement.blockedIPs.push(target);
            }
        });
        console.log(`🛡️ ACTION EXECUTED: BLOCK_IP ${target}`);
    },
    LOCK_ACCOUNT: (target) => {
        updateState(state => {
            if (!state.enforcement.lockedAccounts.includes(target)) {
                state.enforcement.lockedAccounts.push(target);
            }
        });
        console.log(`🛡️ ACTION EXECUTED: LOCK_ACCOUNT ${target}`);
    },
    RATE_LIMIT_EHR: (target) => {
        // Target is { ip, userId }
        // Rate limit ONLY /ehr/patient/:id/records
        updateState(state => {
            state.enforcement.rateLimits.push({
                key: `exfil_${target.userId}`,
                route: '/ehr/patient/:id/records',
                ip: target.ip,
                userId: target.userId,
                limitRps: 1 // Very strict
            });
        });
        console.log(`🛡️ ACTION EXECUTED: RATE_LIMIT_EHR for ${target.userId}`);
    },
    ENABLE_DEGRADED_MODE: () => {
        updateState(state => {
            state.enforcement.degradedMode = true;
        });
        console.log(`🛡️ ACTION EXECUTED: ENABLE_DEGRADED_MODE`);
    }
};

const executePlaybook = (incident) => {
    const { settings } = getState();
    const auto = settings.autoResponse;

    console.log(`📖 Executing Playbook for ${incident.type} (Auto: ${auto})`);

    let actionsToTake = [];

    // Define Playbook Logic
    if (incident.type === 'AUTH_FAIL_SPIKE') {
        // Warning only usually, unless severe
    }
    else if (incident.type === 'ACCOUNT_TARGETING') {
        actionsToTake.push({ key: 'BLOCK_IP', target: incident.ip });
    }
    else if (incident.type === 'EHR_BULK_READ') {
        // First Rate Limit
        actionsToTake.push({ key: 'RATE_LIMIT_EHR', target: { ip: incident.ip, userId: incident.userId } });

        // If it persists or is extreme (check observed value?), maybe degraded mode.
        // For demo, let's say if observed > 40 we go degraded.
        if (incident.reasons.some(r => r.observed > 40)) {
            actionsToTake.push({ key: 'ENABLE_DEGRADED_MODE' });
        }
    }
    else if (incident.type === 'ROUTE_FLOOD') {
        actionsToTake.push({ key: 'BLOCK_IP', target: incident.ip });
    }

    // Execution
    const executedActions = [];

    actionsToTake.forEach(actionDef => {
        const actionRec = {
            action: actionDef.key,
            target: JSON.stringify(actionDef.target),
            at: Date.now(),
            mode: auto ? 'auto' : 'manual',
            result: auto ? 'success' : 'pending' // If manual, we don't run it yet
        };

        if (auto) {
            if (ACTIONS[actionDef.key]) {
                ACTIONS[actionDef.key](actionDef.target);
            }
        }

        executedActions.push(actionRec);
    });

    return executedActions; // Return these to append to incident
};

// Public method to manually approve an action later
const approveAction = (actionKey, target) => {
    if (ACTIONS[actionKey]) {
        ACTIONS[actionKey](target ? JSON.parse(target) : undefined);
        return true;
    }
    return false;
};

module.exports = { executePlaybook, approveAction };

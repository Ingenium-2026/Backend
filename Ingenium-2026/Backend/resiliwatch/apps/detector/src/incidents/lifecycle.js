const incidentStore = require('./incidentStore');
const playbooks = require('../response/playbooks');
const notify = require('../response/notify');

const processFindings = (findings) => {
    if (!findings || findings.length === 0) return;

    findings.forEach(finding => {
        // Check if active incident exists
        const key = finding.ip || finding.userId;
        let incident = incidentStore.findActiveIncident(finding.rule, key);

        if (incident) {
            // Update existing
            // Check for severity escalation or phase change?
            // For now just update lastSeen and reasons
            incidentStore.updateIncident(incident.id, {
                reasons: [...incident.reasons, { ...finding, ts: Date.now() }] // simple append
                // In real app we dedupe reasons
            });

            // If SEV1 and we were suspicious, move to confirmed
            if (finding.severity === 'SEV1' && incident.phases[incident.phases.length - 1].phase !== 'confirmed') {
                // ESCALATE
                const newPhases = [...incident.phases, { phase: 'confirmed', at: Date.now() }];

                // Trigger Response
                const actions = playbooks.executePlaybook({ ...incident, severity: 'SEV1' });
                const newActions = [...incident.actions, ...actions];

                incidentStore.updateIncident(incident.id, {
                    phases: newPhases,
                    actions: newActions,
                    severity: 'SEV1'
                });

                notify.send({ ...incident, status: 'ESCALATED' });
            }

        } else {
            // Create New
            const initialPhase = finding.severity === 'SEV1' ? 'confirmed' : 'suspicious';
            const newIncident = incidentStore.createIncident({
                type: finding.rule,
                severity: finding.severity,
                ip: finding.ip,
                userId: finding.userId,
                reasons: [{ ...finding, ts: Date.now() }],
                phases: [{ phase: initialPhase, at: Date.now() }]
            });

            // If starts as confirmed or if we want to run playbooks on SEV2?
            // Only run playbook on SEV1 for now to reduce noise
            if (finding.severity === 'SEV1') {
                const actions = playbooks.executePlaybook(newIncident);
                incidentStore.updateIncident(newIncident.id, { actions });
            }

            notify.send(newIncident);
        }
    });
};

module.exports = { processFindings };

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { exec } = require('child_process');
const path = require('path');
const config = require('./config');

const telemetryIngest = require('./ingest/telemetryIngest');
const metricsHandler = require('./metrics');
const { getState, updateState, subscribe, resetState } = require('./state/store');
const ringBuffer = require('./ingest/ringBuffer');
const { detectRules } = require('./detection/rules');
const { detectAnomaly } = require('./detection/anomaly');
const lifecycle = require('./incidents/lifecycle');
const { approveAction } = require('./response/playbooks');

// App Setup
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Routes
app.post('/telemetry', telemetryIngest);
app.get('/metrics.json', metricsHandler);

// Enforcement Polling Endpoint for Gateway
app.get('/enforcement', (req, res) => {
    res.json(getState().enforcement);
});

// State & Settings for Frontend
app.get('/state', (req, res) => {
    res.json(getState());
});

app.get('/settings', (req, res) => {
    res.json(getState().settings);
});

// Simulation Routes
app.post('/simulate/:type', (req, res) => {
    const { type } = req.params;
    console.log(`[API] Received simulation request: ${type}`);
    let script = '';

    switch (type) {
        case 'normal': script = 'normal_traffic.js'; break;
        case 'bruteforce': script = 'attack_bruteforce.js'; break;
        case 'exfil': script = 'attack_exfil.js'; break;
        default: return res.status(400).send('Unknown simulation');
    }

    const scriptPath = path.resolve(__dirname, '../../../scripts', script);
    console.log(`[API] Triggering script: ${scriptPath}`);

    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`[Simulation Error] ${error}`);
            // Note: We don't return here because we want to see output if any
        }
        if (stdout) console.log(`[Simulation Output] ${stdout}`);
        if (stderr) console.error(`[Simulation Stderr] ${stderr}`);
    });

    res.send(`Simulation ${type} started`);
});

// Admin/Simulation Routes
app.post('/admin/reset', (req, res) => {
    resetState();
    res.json({ success: true });
});
app.post('/settings', (req, res) => {
    const { autoResponse } = req.body;
    updateState(state => {
        if (typeof autoResponse === 'boolean') state.settings.autoResponse = autoResponse;
    });
    res.json(getState().settings);
});

// Approve Pending Action
app.post('/incidents/:id/approve', (req, res) => {
    const { action, target } = req.body;
    const incidents = getState().incidents;
    const inc = incidents.find(i => i.id === req.params.id);

    if (!inc) return res.status(404).json({ error: 'Incident not found' });

    let success = false;

    // If specific action requested
    if (action) {
        if (approveAction(action, target)) {
            inc.actions.forEach(a => {
                if (a.action === action && a.mode === 'manual' && a.result === 'pending') {
                    a.result = 'success';
                    a.at = Date.now();
                }
            });
            success = true;
        }
    } else {
        // Approve ALL pending manual actions for this incident
        const pendingActions = inc.actions.filter(a => a.mode === 'manual' && a.result === 'pending');

        pendingActions.forEach(a => {
            // Need to parse target if it's a string from the store
            const parsedTarget = typeof a.target === 'string' ? JSON.parse(a.target) : a.target; // Actually store has it as string JSON usually
            // wait, in playbooks.js: target: JSON.stringify(actionDef.target)
            // So we need to pass string target to approveAction which json parses it

            if (approveAction(a.action, a.target)) {
                a.result = 'success';
                a.at = Date.now();
                success = true;
            }
        });
        if (pendingActions.length === 0) success = true; // Nothing to approve
    }

    if (success) {
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'Action failed or nothing to approve' });
    }
});


// Detection Loop (1s)
setInterval(() => {
    const last60 = ringBuffer.getRecent(60);

    if (last60.length === 0) return;

    // 1. Rules
    const ruleFindings = detectRules(last60);

    // 2. Anomaly
    const anomalyFinding = detectAnomaly(last60, 10);
    if (anomalyFinding) ruleFindings.push(anomalyFinding);

    // 3. Lifecycle
    lifecycle.processFindings(ruleFindings);

}, 1000);


// Socket.IO Broadcasting
// Subscribe to store changes and push to clients
// Throttle slightly to avoid spamming if high volume updates
let lastBroadcast = 0;
subscribe((state) => {
    const now = Date.now();
    if (now - lastBroadcast > 200) { // Limit to 5 updates/sec
        io.emit('state_update', state);
        lastBroadcast = now;
    }
});

// Also emit valid telemetry for "feed"
// RingBuffer onPush
// THROTTLE: Only emit 1 event every 1000ms to prevent UI lag during attacks
let lastTelemetryEmit = 0;
ringBuffer.onPush((event) => {
    const now = Date.now();
    if (now - lastTelemetryEmit > 1000) { // Max 1 update per second
        io.emit('telemetry_event', event);
        lastTelemetryEmit = now;
    }
});

server.listen(config.PORT, () => {
    console.log(`Detector listening on port ${config.PORT}`);
});

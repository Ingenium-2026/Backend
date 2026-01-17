const express = require('express');
const cors = require('cors');
const config = require('./config');
const telemetry = require('./middleware/telemetry');
const normalizeRoute = require('./middleware/normalizeRoute');
const { startPolling } = require('./middleware/enforcementCache');
const blocklist = require('./middleware/blocklist');
const rateLimit = require('./middleware/rateLimit');
const degradedMode = require('./middleware/degradedMode');

// Routes
const authRoutes = require('./routes/auth');
const ehrRoutes = require('./routes/ehr');
const appointmentsRoutes = require('./routes/appointments');

const app = express();

app.use(cors());
app.use(express.json());

// Start enforcement polling
startPolling();

// Global Middleware Chain
app.use(normalizeRoute);     // 1. Normalize route path for matching
app.use(telemetry);          // 2. Start telemetry tracking (finishes on res.finish)
app.use(blocklist);          // 3. Check Blocked IPs
app.use(rateLimit);          // 4. Check Rate Limits
app.use(degradedMode);       // 5. Check Degraded Mode constraints

// API Routes
app.use('/auth', authRoutes);
app.use('/ehr', ehrRoutes);
app.use('/appointments', appointmentsRoutes);

app.get('/', (req, res) => {
    res.send('ResiliWatch Gateway Active');
});

app.listen(config.PORT, () => {
    console.log(`Gateway listening on port ${config.PORT}`);
});

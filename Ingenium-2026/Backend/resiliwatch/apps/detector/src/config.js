require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 4000,
    DASHBOARD_URL: process.env.DASHBOARD_URL || 'http://localhost:5173',
    GATEWAY_URL: process.env.GATEWAY_URL || 'http://localhost:3000',
    ENABLE_AUTO_RESPONSE: true // Default on, can be toggled
};

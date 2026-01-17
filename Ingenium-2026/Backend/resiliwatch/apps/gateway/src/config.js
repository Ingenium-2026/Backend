require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  DETECTOR_URL: process.env.DETECTOR_URL || 'http://localhost:4000',
  ENABLE_TELEMETRY: process.env.ENABLE_TELEMETRY !== 'false',
};

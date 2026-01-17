const express = require('express');
const router = express.Router();

router.post('/book', (req, res) => {
    res.json({ status: 'confirmed', appointmentId: 'apt-' + Date.now() });
});

router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        time: '2026-05-20T10:00:00Z',
        doctor: 'Dr. Smith'
    });
});

module.exports = router;

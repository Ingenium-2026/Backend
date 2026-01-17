const express = require('express');
const router = express.Router();

// Mock data generator
const generateRecords = (count) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        date: new Date().toISOString(),
        diagnosis: 'Simulated Diagnosis ' + i,
        notes: 'Long text payload '.repeat(20) // Create some bytes
    }));
};

// GET /ehr/patient/:id
router.get('/patient/:id', (req, res) => {
    res.json({
        id: req.params.id,
        name: "John Doe",
        age: 45,
        bloodType: "O+"
    });
});

// GET /ehr/patient/:id/records - HEAVY payload
router.get('/patient/:id/records', (req, res) => {
    const count = 50; // Decent size
    res.json({
        patientId: req.params.id,
        records: generateRecords(count)
    });
});

// POST /ehr/patient/:id/notes
router.post('/patient/:id/notes', (req, res) => {
    res.status(201).json({ success: true, id: Date.now() });
});

module.exports = router;

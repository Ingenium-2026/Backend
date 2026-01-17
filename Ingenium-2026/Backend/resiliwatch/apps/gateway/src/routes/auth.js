const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    const { userId, password } = req.body;

    if (password === 'password123') {
        res.locals.authResult = 'success';
        return res.json({
            token: 'demo-token-' + Date.now(),
            userId,
            role: 'doctor'
        });
    } else {
        res.locals.authResult = 'fail';
        return res.status(401).json({ error: 'Invalid credentials' });
    }
});

router.post('/refresh', (req, res) => {
    res.json({ token: 'refreshed-token' });
});

module.exports = router;

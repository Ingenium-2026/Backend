const axios = require('axios');

const GATEWAY = 'http://localhost:3000';
const USER_IDS = ['doc1', 'doc2', 'doc3', 'nurse1', 'admin'];

const sleep = ms => new Promise(r => setTimeout(r, ms));

const randomPick = arr => arr[Math.floor(Math.random() * arr.length)];

const actions = [
    // Login
    async () => {
        try {
            await axios.post(`${GATEWAY}/auth/login`, { userId: randomPick(USER_IDS), password: 'password123' }, { headers: { 'x-forwarded-for': '192.168.1.5' } });
        } catch (e) { }
    },
    // View Patient
    async () => {
        try {
            await axios.get(`${GATEWAY}/ehr/patient/${Math.floor(Math.random() * 100)}`, { headers: { 'x-user-id': randomPick(USER_IDS), 'x-forwarded-for': '192.168.1.5' } });
        } catch (e) { }
    },
    // Check Appts
    async () => {
        try {
            await axios.get(`${GATEWAY}/appointments/today`, { headers: { 'x-user-id': randomPick(USER_IDS), 'x-forwarded-for': '192.168.1.5' } });
        } catch (e) { }
    },
    // Book Appt
    async () => {
        try {
            await axios.post(`${GATEWAY}/appointments/book`, {}, { headers: { 'x-user-id': randomPick(USER_IDS), 'x-forwarded-for': '192.168.1.5' } });
        } catch (e) { }
    }
];

const run = async () => {
    console.log('Generating Normal Traffic...');
    while (true) {
        const action = randomPick(actions);
        await action();
        await sleep(Math.random() * 500 + 200); // 200-700ms delay ~2-4 RPS
    }
};

run();

const axios = require('axios');

const GATEWAY = 'http://localhost:3000';
const ATTACKER_IP = '10.99.9.9'; // Insider threat IP?
const COMPROMISED_USER = 'doctor_bad';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const run = async () => {
    console.log('STARTING DATA EXFILTRATION ATTACK');

    // Try to dump 100 patient records fast
    for (let i = 0; i < 100; i++) {
        console.log(`Exfilling Patient ${i}...`);
        axios.get(`${GATEWAY}/ehr/patient/${i}/records`, {
            headers: {
                'x-forwarded-for': ATTACKER_IP,
                'x-user-id': COMPROMISED_USER,
                'x-role': 'doctor'
            }
        }).then(res => {
            console.log(`Got ${res.headers['content-length']} bytes`);
        }).catch(e => {
            console.log(`Blocked/Failed: ${e.response?.status}`);
        });

        await sleep(200); // 5 RPS is enough to trigger threshold of 30/60s or 20MB
    }
};

run();

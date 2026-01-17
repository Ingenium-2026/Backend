const axios = require('axios');

const GATEWAY = 'http://localhost:3000';
const ATTACKER_IP = '10.66.6.6'; // Evil

const sleep = ms => new Promise(r => setTimeout(r, ms));

const run = async () => {
    console.log('STARTING BRUTEFORCE ATTACK from ' + ATTACKER_IP);

    // Rapid fire login attempts
    for (let i = 0; i < 50; i++) {
        axios.post(`${GATEWAY}/auth/login`, {
            userId: `target_user_${i % 5}`, // Targeting 5 users
            password: 'wrongpassword'
        }, {
            headers: { 'x-forwarded-for': ATTACKER_IP }
        }).catch(e => {
            // console.log(e.response?.status);
        });

        await sleep(50); // very fast, 20 RPS
    }
    console.log('Attack Burst Complete');
};

run();

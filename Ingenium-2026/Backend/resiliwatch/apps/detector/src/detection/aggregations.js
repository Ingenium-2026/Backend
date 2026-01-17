// aggregations.js
// Provides summarized views of recent data for rules

const getStats = (events) => {
    // aggregations over the provided window of events
    const stats = {
        failedLoginsByIp: {}, // ip -> count
        failedLoginsByUser: {}, // userId -> count
        successAfterFail: {}, // key: ip+user -> boolean
        ehrBulkReadsByUser: {}, // userId -> count
        bytesOutByIp: {}, // ip -> sum
        requestsByIpRoute: {}, // `${ip}:${route}` -> count
        uniqUsersFailedByIp: {} // ip -> Set(userId)
    };

    events.forEach(e => {
        // 1. Failed Logins
        if (e.targetService === 'auth' && e.route === '/auth/login' && e.authResult === 'fail') {
            stats.failedLoginsByIp[e.ip] = (stats.failedLoginsByIp[e.ip] || 0) + 1;

            if (!stats.uniqUsersFailedByIp[e.ip]) stats.uniqUsersFailedByIp[e.ip] = new Set();
            stats.uniqUsersFailedByIp[e.ip].add(e.userId);
        }

        // 2. Success After Fail (Complex, maybe simplified here to just spotting successes)
        // Actually, we need sequence. Assuming `events` is sorted newest first (from ringBuffer.getRecent)
        // But for aggregation we usually want generic counts. 

        // 3. EHR Bulk Reads
        if (e.route === '/ehr/patient/:id/records' && e.status === 200) {
            stats.ehrBulkReadsByUser[e.userId] = (stats.ehrBulkReadsByUser[e.userId] || 0) + 1;
        }

        // 4. Bytes Out
        if (e.bytesOut) {
            stats.bytesOutByIp[e.ip] = (stats.bytesOutByIp[e.ip] || 0) + e.bytesOut;
        }

        // 5. Route Flood
        const key = `${e.ip}|${e.route}`;
        stats.requestsByIpRoute[key] = (stats.requestsByIpRoute[key] || 0) + 1;
    });

    return stats;
};

module.exports = { getStats };

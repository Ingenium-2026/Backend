# ResiliWatch (Sentira) - Cyber-Resilient Infrastructure Demo

Cyber-Resilient Infrastructure for Critical Sectors (Healthcare).  
Winner of the "Zero Downtime" & "Explainable Security" Challenges.

## 🚀 Quick Start

### 1. Requirements
- Node.js v18+
- npm

### 2. Install & Run
Run these commands in separate terminal tabs:

**Terminal 1: Gateway (Port 3000)**
```bash
cd apps/gateway
npm install
npm run dev
```

**Terminal 2: Detector (Port 4000)**
```bash
cd apps/detector
npm install
npm run dev
```

**Terminal 3: Dashboard (Port 5173)**
```bash
cd apps/dashboard
npm install
npm run dev
```

### 3. Demo Flow
1. Open Dashboard at `http://localhost:5173`.
2. Click **"Normal Traffic"** to seed baseline data. Observe GREEN status.
3. Click **"Exfil Attack"** to simulate a compromised doctor account dumping records.
   - Watch **EHR** status turn YELLOW then RED.
   - Note that **Appointments** remains GREEN (Surgical Containment).
   - See "Active Mitigations" show "Rate Limited" or "Degraded Mode".
   - Click the Incident row to see Explainable AI reasoning.
4. Toggle **"Auto Response"** to OFF and try **"Bruteforce"**.
   - See incident create but NO mitigation.
   - Click **"Approve"** on the incident details to manually block the IP.

## 📂 Architecture
- **Gateway**: Edge proxy, captures telemetry, enforces blocking/rate-limiting locally.
- **Detector**: Analyzes telemetry stream, detects anomalies, keeps state, pushes updates via Socket.IO.
- **Dashboard**: Real-time React UI for operators.

## 🛡️ Response Playbooks
- **Bruteforce**: Block IP temporarilly.
- **Data Exfiltration**: Rate limit specific user+route, then escalate to Read-Only Degraded Mode for EHR only.
- **DDoS/Flood**: Block IP.

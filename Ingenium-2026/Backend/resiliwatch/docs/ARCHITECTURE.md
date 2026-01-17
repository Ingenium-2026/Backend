# Architecture

ResiliWatch follows a distributed control plane architecture.

## Components

### 1. Data Collection Agent (Gateway)
Embedded as middleware in the Gateway service.
- **Low Latency**: Async fire-and-forget telemetry sending.
- **Local Enforcement**: Caches policies from Detector to enforce blocking even if Detector is slow.
- **Fail-Open**: If Detector is down, traffic flows (unless cached blocklist exists).

### 2. ResiliWatch Brain (Detector)
Central analysis engine.
- **Ingest**: Ring buffer intake of raw telemetry.
- **Analysis**: Running 60-second rolling window aggregations.
- **Logic**: 
  - `Rules`: Deterministic thresholds (e.g., >10 failed logins).
  - `Anomaly`: Statistical deviations (Z-score on RPS).
- **Incident Lifecycle**: Normal -> Suspicious (SEV2) -> Confirmed (SEV1) -> Isolated -> Stabilized.

### 3. Dashboard
Operational view.
- Connects via WebSocket.
- Receives full state snapshots diffs.

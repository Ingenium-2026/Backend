const DETECTOR_BASE_URL = 'http://localhost:4000';

export interface AppState {
  services: {
    auth: { status: 'green' | 'yellow' | 'red'; message: string };
    ehr: { status: 'green' | 'yellow' | 'red'; message: string };
    appointments: { status: 'green' | 'yellow' | 'red'; message: string };
  };
  incidents: Incident[];
  mitigations: {
    blockedIPs: string[];
    lockedAccounts: string[];
    rateLimits: RateLimit[];
    degradedMode: boolean;
  };
  telemetry: {
    recent: TelemetryEvent[];
  };
  metrics: Metrics;
  settings: { autoResponse: boolean };
}

export interface Incident {
  id: string;
  type: string;
  severity: 'SEV1' | 'SEV2' | 'SEV3';
  status: 'active' | 'contained' | 'resolved';
  ip?: string;
  userId?: string;
  startedAt: string;
  phase?: 'normal' | 'suspicious' | 'confirmed' | 'isolated' | 'stabilized';
  reasons?: ExplainableReason[];
  actions?: IncidentAction[];
  pendingActions?: boolean;
}

export interface ExplainableReason {
  ruleName: string;
  observedValue: number;
  threshold: number;
  windowSec: number;
  deltaPct?: number;
  explanation: string;
}

export interface IncidentAction {
  type: string;
  timestamp: string;
  auto: boolean;
  details?: string;
}

export interface RateLimit {
  route: string;
  ip?: string;
  userId?: string;
  limit: number;
}

export interface TelemetryEvent {
  ts: string;
  method: string;
  route: string;
  status: number;
  latency: number;
  ip: string;
  role?: string;
}

export interface Metrics {
  ingestEps: number;
  rps: number;
  errorRate: number;
  avgLatencyMs: number;
  anomalyScore: number;
  detectionLatencyMs: number;
  responseLatencyMs: number;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${DETECTOR_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export const api = {
  getState: () => request<AppState>('/state'),
  getMetrics: () => request<Metrics>('/metrics.json'),
  getSettings: () => request<{ autoResponse: boolean }>('/settings'),
  
  simulateNormal: () => request('/simulate/normal', { method: 'POST' }),
  simulateBruteforce: () => request('/simulate/bruteforce', { method: 'POST' }),
  simulateExfil: () => request('/simulate/exfil', { method: 'POST' }),
  resetDemo: () => request('/admin/reset', { method: 'POST' }),
  
  updateSettings: (autoResponse: boolean) => 
    request('/settings', { 
      method: 'POST', 
      body: JSON.stringify({ autoResponse }) 
    }),
    
  approveAction: (incidentId: string) => 
    request(`/incidents/${incidentId}/approve`, { method: 'POST' }),
};

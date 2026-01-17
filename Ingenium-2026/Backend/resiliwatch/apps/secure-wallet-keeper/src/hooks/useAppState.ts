import { useState, useEffect, useCallback } from 'react';
import { api, AppState, TelemetryEvent, Incident, Metrics } from '@/lib/api';
import { socketService } from '@/lib/socket';
import { toast } from '@/hooks/use-toast';

const initialState: AppState = {
  services: {
    auth: { status: 'green', message: 'Healthy' },
    ehr: { status: 'green', message: 'Healthy' },
    appointments: { status: 'green', message: 'Healthy' },
  },
  incidents: [],
  mitigations: {
    blockedIPs: [],
    lockedAccounts: [],
    rateLimits: [],
    degradedMode: false,
  },
  telemetry: { recent: [] },
  metrics: {
    ingestEps: 0,
    rps: 0,
    errorRate: 0,
    avgLatencyMs: 0,
    anomalyScore: 0,
    detectionLatencyMs: 0,
    responseLatencyMs: 0,
  },
  settings: { autoResponse: true },
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial state
  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const [stateData, metricsData, settingsData] = await Promise.all([
          api.getState().catch(() => null),
          api.getMetrics().catch(() => null),
          api.getSettings().catch(() => null),
        ]);

        setState(prev => ({
          ...prev,
          ...(stateData || {}),
          metrics: metricsData || prev.metrics,
          settings: settingsData || prev.settings,
        }));
      } catch (error) {
        console.error('Failed to fetch initial state:', error);
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to backend. Make sure the detector is running on port 4000.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialState();
  }, []);

  // Socket connection
  useEffect(() => {
    socketService.connect();

    const unsubConnection = socketService.on('connection_change', setConnected);

    const unsubState = socketService.on('state_update', (newState: Partial<AppState>) => {
      setState(prev => ({
        ...prev,
        ...newState,
        telemetry: newState.telemetry || prev.telemetry,
        metrics: newState.metrics || prev.metrics,
        settings: newState.settings || prev.settings,
      }));
    });

    const unsubTelemetry = socketService.on('telemetry_event', (event: TelemetryEvent) => {
      setState(prev => ({
        ...prev,
        telemetry: {
          recent: [event, ...(prev.telemetry?.recent || [])].slice(0, 20),
        },
      }));
    });

    const unsubIncident = socketService.on('incident_update', (incident: Incident) => {
      setState(prev => ({
        ...prev,
        incidents: prev.incidents.some(i => i.id === incident.id)
          ? prev.incidents.map(i => i.id === incident.id ? incident : i)
          : [incident, ...prev.incidents],
      }));
    });

    const unsubMitigation = socketService.on('mitigation_update', (mitigations) => {
      setState(prev => ({ ...prev, mitigations }));
    });

    const unsubMetrics = socketService.on('metric_update', (metrics: Metrics) => {
      setState(prev => ({ ...prev, metrics }));
    });

    return () => {
      unsubConnection();
      unsubState();
      unsubTelemetry();
      unsubIncident();
      unsubMitigation();
      unsubMetrics();
      socketService.disconnect();
    };
  }, []);

  const simulateNormal = useCallback(async () => {
    try {
      await api.simulateNormal();
      toast({ title: 'Simulation Started', description: 'Normal traffic simulation running' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to start simulation', variant: 'destructive' });
    }
  }, []);

  const simulateBruteforce = useCallback(async () => {
    try {
      await api.simulateBruteforce();
      toast({ title: 'Attack Simulation', description: 'Bruteforce attack simulation started' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to start simulation', variant: 'destructive' });
    }
  }, []);

  const simulateExfil = useCallback(async () => {
    try {
      await api.simulateExfil();
      toast({ title: 'Attack Simulation', description: 'Data exfiltration attack simulation started' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to start simulation', variant: 'destructive' });
    }
  }, []);

  const resetDemo = useCallback(async () => {
    try {
      await api.resetDemo();
      toast({ title: 'Reset Complete', description: 'Demo state has been reset' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reset demo', variant: 'destructive' });
    }
  }, []);

  const toggleAutoResponse = useCallback(async () => {
    try {
      const newValue = !state.settings.autoResponse;
      await api.updateSettings(newValue);
      setState(prev => ({ ...prev, settings: { autoResponse: newValue } }));
      toast({ 
        title: 'Settings Updated', 
        description: `Auto Response ${newValue ? 'enabled' : 'disabled'}` 
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update settings', variant: 'destructive' });
    }
  }, [state.settings.autoResponse]);

  const approveAction = useCallback(async (incidentId: string) => {
    try {
      await api.approveAction(incidentId);
      toast({ title: 'Action Approved', description: 'Mitigation action has been approved' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve action', variant: 'destructive' });
    }
  }, []);

  return {
    state,
    connected,
    loading,
    actions: {
      simulateNormal,
      simulateBruteforce,
      simulateExfil,
      resetDemo,
      toggleAutoResponse,
      approveAction,
    },
  };
}

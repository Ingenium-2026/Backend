import { io, Socket } from 'socket.io-client';
import type { AppState, TelemetryEvent, Incident, Metrics } from './api';

const SOCKET_URL = 'http://localhost:4000';

export type SocketEvents = {
  state_update: (state: AppState) => void;
  telemetry_event: (event: TelemetryEvent) => void;
  incident_update: (incident: Incident) => void;
  mitigation_update: (mitigations: AppState['mitigations']) => void;
  metric_update: (metrics: Metrics) => void;
};

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.emit('connection_change', true);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.emit('connection_change', false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('connection_change', false);
    });

    // Forward all events
    ['state_update', 'telemetry_event', 'incident_update', 'mitigation_update', 'metric_update'].forEach(event => {
      this.socket?.on(event, (data) => {
        this.emit(event, data);
      });
    });

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]): () => void;
  on(event: 'connection_change', callback: (connected: boolean) => void): () => void;
  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();

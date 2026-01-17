import React, { useEffect, useState } from 'react';
import socket from './socket';

import Header from './components/Header';
import ServiceStatusGrid from './components/ServiceStatusGrid';
import TelemetryFeed from './components/TelemetryFeed';
import Controls from './components/Controls';
import { IncidentsTable, IncidentDetails } from './components/IncidentsTable';
import MitigationsPanel from './components/MitigationsPanel';

function App() {
  const [activeEvents, setActiveEvents] = useState([]);
  const [appState, setAppState] = useState({
    incidents: [],
    enforcement: { blockedIPs: [], rateLimits: [], degradedMode: false },
    metrics: { ingestRate: 0, activeIncidents: 0 },
    settings: { autoResponse: true }
  });
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Detector');
    });

    socket.on('state_update', (newState) => {
      setAppState(newState);
    });

    socket.on('telemetry_event', (event) => {
       setActiveEvents(prev => [...prev.slice(-99), event]); // Keep last 100
    });

    return () => {
      socket.off('connect');
      socket.off('state_update');
      socket.off('telemetry_event');
    };
  }, []);

  // Update selected incident if it changes in state
  useEffect(() => {
    if (selectedIncident) {
      const updated = appState.incidents.find(i => i.id === selectedIncident.id);
      if (updated) setSelectedIncident(updated);
    }
  }, [appState.incidents, selectedIncident]);

  return (
    <div className="dashboard-grid">
      {/* LEFT COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
         <ServiceStatusGrid 
             enforcement={appState.enforcement} 
             incidents={appState.incidents} 
             metrics={appState.metrics}
         />
         <Controls settings={appState.settings} />
         <MitigationsPanel enforcement={appState.enforcement} />
      </div>

      {/* CENTER COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
         <Header activeIncidents={appState.metrics.activeIncidents} metrics={appState.metrics} />
         <IncidentsTable 
            incidents={appState.incidents} 
            selectedId={selectedIncident?.id}
            onSelect={setSelectedIncident} 
         />
         <TelemetryFeed events={activeEvents} />
      </div>

      {/* RIGHT COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
         <IncidentDetails incident={selectedIncident} />
      </div>
    </div>
  );
}

export default App;

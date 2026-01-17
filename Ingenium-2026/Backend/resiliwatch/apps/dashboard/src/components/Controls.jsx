import React from 'react';
import axios from 'axios'; // Direct to Detector
import { resetSystem, updateSettings } from '../api';

// For simulation scripts, we should probably just trigger them via an endpoint
// I will implement the /simulate endpoints in Detector soon.

export default function Controls({ settings }) {
  
  const runSim = (type) => {
    // Fire and forget
    axios.post(`http://localhost:4000/simulate/${type}`).catch(console.error);
  };

  const toggleAuto = () => {
    updateSettings({ autoResponse: !settings.autoResponse });
  };

  return (
    <div className="card">
      <h2>Controls</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button className="btn neutral" onClick={() => runSim('normal')}>Normal Traffic</button>
        <button className="btn danger" onClick={() => runSim('bruteforce')}>Bruteforce</button>
        <button className="btn danger" onClick={() => runSim('exfil')}>Data Exfil</button>
        <button className="btn neutral" onClick={resetSystem}>System Reset</button>
      </div>
      
      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px' }}>Auto Response</span>
        <button 
            className={`btn ${settings.autoResponse ? 'success' : 'neutral'}`} 
            style={{background: settings.autoResponse ? '#238636' : '#666'}}
            onClick={toggleAuto}
        >
          {settings.autoResponse ? 'ENABLED' : 'MANUAL'}
        </button>
      </div>
    </div>
  );
}

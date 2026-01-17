import React, { useMemo } from 'react';

// Computes status based on incidents and enforcement
export default function ServiceStatusGrid({ enforcement, incidents, metrics }) {
  
  // Logic: 
  // If DegradedMode is ON, EHR is Yellow/Red.
  // If Auth Fail Spike, Auth is Yellow.
  // Appointments should stay Green unless global outage.

  const getStatus = (service) => {
    let status = 'green';
    let label = 'OPERATIONAL';

    if (service === 'EHR') {
       if (enforcement.degradedMode) {
           status = 'red'; 
           label = 'DEGRADED (READ-ONLY)';
       } else if (incidents.some(i => i.type.includes('EHR') && i.status === 'active')) {
           status = 'yellow';
           label = 'UNDER SURVEILLANCE';
       }
    }
    
    if (service === 'AUTH') {
        if (incidents.some(i => i.type === 'AUTH_FAIL_SPIKE' && i.status === 'active')) {
            status = 'yellow';
            label = 'ELEVATED ERROR RATE';
        }
        if (incidents.some(i => i.type === 'ACCOUNT_TARGETING' && i.status === 'active')) {
            status = 'red';
            label = 'OFFLINE (PROTECTED)';
        }
    }

    return { status, label };
  };

  const services = ['AUTH', 'EHR', 'APPOINTMENTS'].map(s => ({ name: s, ...getStatus(s) }));

  return (
    <div className="card">
      <h2>Infrastructure Health</h2>
      <div className="status-grid">
        {services.map(s => (
          <div key={s.name} className={`status-item ${s.status}`}>
            <div className="status-indicator"></div>
            <div style={{fontWeight:'bold', fontSize:'13px'}}>{s.name}</div>
            <div style={{fontSize:'10px', marginTop:'4px', opacity:0.7}}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

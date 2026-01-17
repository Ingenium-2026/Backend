import React from 'react';
import { ShieldCheck, ShieldAlert, Activity } from 'lucide-react';

export default function Header({ activeIncidents, metrics }) {
  const statusColor = activeIncidents > 0 ? '#da3633' : '#2ea043';
  
  return (
    <header>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {activeIncidents > 0 ? <ShieldAlert color={statusColor} /> : <ShieldCheck color={statusColor} />}
        <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>SENTIRA <span style={{opacity:0.5}}>RESILIWATCH</span></h1>
      </div>
      
      <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} />
          <span>INGEST: {metrics.ingestRate} EPS</span>
        </div>
        <div>ACTIVE THREATS: <b style={{color: statusColor}}>{activeIncidents}</b></div>
      </div>
    </header>
  );
}

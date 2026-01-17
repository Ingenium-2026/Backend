import React from 'react';
import { approveAction } from '../api';

export function IncidentsTable({ incidents, onSelect, selectedId }) {
  return (
    <div className="card" style={{ gridColumn: 'span 2', minHeight: '200px' }}>
      <h2>Active Incidents</h2>
      <div className="scroll-y">
        {incidents.filter(i => i.status !== 'resolved').length === 0 ? (
           <div style={{padding:'20px', textAlign:'center', opacity:0.5}}>No Active Threats</div>
        ) : (
           incidents.filter(i => i.status !== 'resolved').map(inc => (
             <div 
               key={inc.id} 
               onClick={() => onSelect(inc)}
               className={`incident-row ${inc.severity} ${selectedId === inc.id ? 'selected' : ''}`}
             >
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span style={{fontWeight:'bold'}}>{inc.type}</span>
                    <span className={`badge ${inc.severity}`}>{inc.severity}</span>
                </div>
                <div style={{fontSize:'12px', marginTop:'4px', color:'#8b949e'}}>
                    Target: {inc.ip || inc.userId || 'Unknown'} | Status: {inc.status.toUpperCase()}
                </div>
             </div>
           ))
        )}
      </div>
    </div>
  );
}

export function IncidentDetails({ incident, enforcement }) {
  if (!incident) return <div className="card"><div style={{padding:'20px', textAlign:'center', opacity:0.5}}>Select an Incident</div></div>;

  const latestReason = incident.reasons[incident.reasons.length - 1];
  
  return (
    <div className="card" style={{ gridColumn: 'span 1', gridRow: 'span 2' }}>
      <h2 style={{color: incident.severity === 'SEV1' ? '#da3633' : '#d29922'}}>
        {incident.severity} DETECTED
      </h2>
      
      <div style={{marginBottom:'16px'}}>
        <div style={{fontSize:'12px', color:'#8b949e'}}>EXPLAINABLE AI REASONING</div>
        <div style={{background:'#0d1117', padding:'8px', borderRadius:'4px', marginTop:'4px', fontSize:'13px', borderLeft:'2px solid var(--accent-blue)'}}>
           {latestReason?.explanation}
        </div>
      </div>

      <Timeline phases={incident.phases} />
      
      <div style={{ marginTop: 'auto' }}>
        <h3>Actions</h3>
        {incident.actions.map((act, i) => (
            <div key={i} style={{fontSize:'12px', marginBottom:'4px', display:'flex', justifyContent:'space-between'}}>
                <span>{act.action}</span>
                {act.result === 'pending' ? (
                   <button className="btn" style={{padding:'2px 6px', fontSize:'10px'}} onClick={() => approveAction(incident.id, act.action, act.target)}>APPROVE</button>
                ) : (
                   <span style={{color:'var(--accent-green)'}}>DONE</span>
                )}
            </div>
        ))}
      </div>
    </div>
  );
}

function Timeline({ phases }) {
  const allPhases = ['suspicious', 'confirmed', 'isolated', 'stabilized'];
  // Determine current index
  const lastPhase = phases[phases.length-1].phase;
  const currentIndex = allPhases.indexOf(lastPhase);
  
  return (
    <div style={{margin:'20px 0'}}>
       {allPhases.map((p, i) => (
          <div key={p} className={`timeline-phase ${i <= currentIndex ? 'active' : ''}`} style={{opacity: i <= currentIndex ? 1 : 0.3}}>
              <div className="timeline-dot"></div>
              <div style={{textTransform:'uppercase', fontSize:'10px', fontWeight:'bold'}}>{p}</div>
          </div>
       ))}
    </div>
  );
}

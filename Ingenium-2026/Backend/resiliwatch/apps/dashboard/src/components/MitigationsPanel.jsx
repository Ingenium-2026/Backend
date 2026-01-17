import React from 'react';

export default function MitigationsPanel({ enforcement }) {
  return (
    <div className="card">
      <h2>Active Mitigations</h2>
      <div style={{fontSize:'12px'}}>
        {enforcement.blockedIPs.length > 0 && (
           <div style={{marginBottom:'8px'}}>
              <div style={{color:'var(--accent-red)'}}>BLOCKED IPs</div>
              {enforcement.blockedIPs.map(ip => <div key={ip}>{ip}</div>)}
           </div>
        )}
        {enforcement.rateLimits.length > 0 && (
            <div style={{marginBottom:'8px'}}>
               <div style={{color:'var(--accent-yellow)'}}>RATE LIMITED</div>
               {enforcement.rateLimits.map((rl, i) => (
                   <div key={i} title={rl.route}>{rl.userId} on {rl.route.substring(0,10)}...</div>
               ))}
            </div>
        )}
        {enforcement.degradedMode && (
            <div style={{background:'rgba(218, 54, 51, 0.1)', border:'1px solid var(--accent-red)', padding:'8px', color:'var(--accent-red)', textAlign:'center'}}>
                DEGRADED MODE ACTIVE
            </div>
        )}
        {!enforcement.degradedMode && enforcement.blockedIPs.length === 0 && enforcement.rateLimits.length === 0 && (
            <div style={{opacity:0.5}}>System Green. No restrictions.</div>
        )}
      </div>
    </div>
  );
}

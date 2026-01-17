import React, { useEffect, useRef } from 'react';

export default function TelemetryFeed({ events }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <div className="card" style={{ flexGrow: 1, minHeight: 0 }}>
      <h2>Real-time Telemetry</h2>
      <div className="scroll-y" style={{ flexGrow: 1, fontSize: '11px', fontFamily: 'monospace' }}>
        {events.slice(-50).map((e, i) => (
          <div key={i} className={`log-entry ${e.status >= 400 ? 'fail' : 'success'}`}>
            <span style={{width:'60px', opacity:0.6}}>{new Date(e.ts).toLocaleTimeString().split(' ')[0]}</span>
            <span style={{width:'40px'}}>{e.method}</span>
            <span style={{width:'150px'}} title={e.route}>{e.route.length > 25 ? e.route.substring(0,25)+'...' : e.route}</span>
            <span style={{width:'30px'}}>{e.status}</span>
            <span style={{flex:1, textAlign:'right'}}>{e.latencyMs}ms</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

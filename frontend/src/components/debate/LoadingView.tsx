'use client';

import { useState, useEffect } from 'react';

const PIPELINE = [
  { label: 'PROPONENT',    status: 'Proponent is building the case…',       bg: '#06B6D4', color: '#fff' },
  { label: 'CRITIC',       status: 'Critic is reading the arguments…',       bg: '#1E1B4B', color: '#06B6D4' },
  { label: 'ANALYST',      status: 'Analyst is evaluating both sides…',      bg: '#A7F3D0', color: '#111' },
  { label: 'FACT-CHECKER', status: 'Fact-checker is auditing every claim…',  bg: '#C084FC', color: '#fff' },
];

export default function LoadingView({ topic }: { topic: string }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % PIPELINE.length); setVisible(true); }, 500);
    }, 2500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: 32 }}>
      <div style={{
        background: '#1E1B4B', border: '4px solid #111', boxShadow: '16px 16px 0 0 #111',
        padding: '48px 40px', maxWidth: 600, width: '100%', textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'Bangers, cursive', fontSize: 40, color: '#06B6D4', marginBottom: 24 }}>DEBATE IN PROGRESS</div>
        <div style={{ background: 'rgba(255,255,255,0.08)', border: '4px solid rgba(255,255,255,0.15)', padding: '16px 20px', marginBottom: 32, fontSize: 16, fontWeight: 500, color: '#F5F0E8' }}>
          {topic}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, gap: 0 }}>
          {PIPELINE.map((a, i) => (
            <>
              <div key={a.label} style={{
                padding: '8px 14px', border: '3px solid #111',
                fontFamily: 'Bangers, cursive', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                background: i === idx ? a.bg : 'rgba(255,255,255,0.08)',
                color: i === idx ? a.color : 'rgba(255,255,255,0.5)',
                boxShadow: i === idx ? '4px 4px 0 0 #111' : 'none',
                transition: 'all 300ms', whiteSpace: 'nowrap',
              }}>{a.label}</div>
              {i < PIPELINE.length - 1 && <div key={`sep-${i}`} style={{ width: 16, height: 3, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />}
            </>
          ))}
        </div>
        <div style={{
          background: 'rgba(6,182,212,0.15)', border: '3px solid #06B6D4',
          padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#06B6D4',
          opacity: visible ? 1 : 0, transition: 'opacity 500ms',
        }}>
          {PIPELINE[idx].status}
        </div>
      </div>
    </div>
  );
}

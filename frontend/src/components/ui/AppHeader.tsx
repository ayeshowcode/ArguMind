'use client';

import BrainIcon from './BrainIcon';

export default function AppHeader({ onBack, onOpenConfig }: { onBack?: (() => void) | null, onOpenConfig?: () => void }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 32px', background: '#F5F0E8', borderBottom: '4px solid #111',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <BrainIcon size={40} />
        <div>
          <div style={{ fontFamily: 'Bangers, cursive', fontSize: 28, fontStyle: 'italic', letterSpacing: '0.05em', color: '#111', lineHeight: 1 }}>
            ARGUMIND
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase' }}>
            Debate. Analyse. Verify.
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: '#111', color: '#F5F0E8', border: '2px solid #111',
            padding: '6px 16px', fontFamily: 'Bangers, cursive', fontSize: 15,
            letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#06B6D4'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#111'; }}
          >← NEW DEBATE</button>
        )}
        {onOpenConfig && (
          <button onClick={onOpenConfig} style={{
            background: '#F5F0E8', color: '#111', border: '2px solid #111',
            padding: '4px 12px', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 13,
            textTransform: 'uppercase', cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e5e0d8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F5F0E8'; }}
          >⚙ CONFIG</button>
        )}
        <span style={{
          background: '#1E1B4B', color: '#06B6D4', border: '2px solid #111',
          padding: '4px 12px', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 13, textTransform: 'uppercase',
        }}>4 AGENTS</span>
        <div style={{ width: 1, height: 24, background: '#111' }} />
        <span style={{
          background: '#111', color: '#F5F0E8', border: '2px solid #111',
          padding: '4px 12px', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 13,
          textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#06B6D4', animation: 'pulse 2s infinite' }} />
          LIVE
        </span>
      </div>
    </header>
  );
}

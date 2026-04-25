'use client';

const agents = [
  { num: '01', name: 'PROPONENT',    role: 'CASE BUILDER',     quote: 'Structure the argument. Build the strongest possible case before the Critic speaks.',  bg: '#06B6D4', color: '#fff' },
  { num: '02', name: 'CRITIC',       role: 'ATTACK LEAD',      quote: 'Quote the claim. Expose the flaw. No mercy for weak reasoning.',                        bg: '#1E1B4B', color: '#06B6D4' },
  { num: '03', name: 'ANALYST',      role: 'NEUTRAL OBSERVER', quote: 'Both sides have merit. My job is to find the gap and surface what neither side said.',   bg: '#A7F3D0', color: '#111' },
  { num: '04', name: 'FACT-CHECKER', role: 'EVIDENCE AUDITOR', quote: 'SUPPORTED. UNSUPPORTED. UNVERIFIABLE. Every claim gets a verdict — no exceptions.',      bg: '#C084FC', color: '#fff' },
];

export default function AgentRoster({ debateActive = false }: { debateActive?: boolean }) {
  return (
    <section id="agent-roster" style={{ background: '#F5F0E8', borderBottom: '4px solid #111', padding: '80px 80px', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', right: -40, bottom: -60,
        fontFamily: 'Bangers, cursive', fontSize: '20rem', color: 'rgba(6,182,212,0.07)',
        userSelect: 'none', pointerEvents: 'none', lineHeight: 1,
      }}>ARGUE</div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          background: '#06B6D4', border: '4px solid #111', boxShadow: '4px 4px 0 0 #111',
          display: 'inline-block', padding: '6px 16px', marginBottom: 16,
        }}>
          <span style={{ fontFamily: 'Bangers, cursive', fontSize: 14, letterSpacing: '0.15em', color: '#fff' }}>AGENT ROSTER</span>
        </div>
        <h2 style={{ fontFamily: 'Bangers, cursive', fontSize: 72, color: '#111', lineHeight: 1, marginBottom: 8 }}>WORKLOAD & ALLOCATION</h2>
        <p style={{ fontSize: 15, fontWeight: 500, color: 'rgba(0,0,0,0.55)', marginBottom: 8 }}>Each agent has a distinct role in the debate pipeline.</p>
        <p style={{ fontFamily: 'Bangers, cursive', fontSize: 28, fontStyle: 'italic', color: '#1E1B4B', marginBottom: 48 }}>&quot;Argue clearly first. Then verify cleanly.&quot;</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {agents.map(a => (
            <div key={a.num}
              style={{
                background: a.bg, border: '4px solid #111', boxShadow: '8px 8px 0 0 #111',
                display: 'flex', flexDirection: 'column', position: 'relative',
                transition: 'all 100ms', cursor: 'default', overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '12px 12px 0 0 #111'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '8px 8px 0 0 #111'; }}
            >
              <div style={{
                width: '100%', height: 80, borderBottom: '4px solid #111',
                display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, padding: '14px 16px',
              }}>
                {Array(25).fill(0).map((_, i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: a.color === '#fff' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)' }} />
                ))}
              </div>
              <div style={{ padding: '18px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{
                  position: 'absolute', top: 88, right: 16,
                  fontFamily: 'Bangers, cursive', fontSize: 56,
                  color: a.color === '#fff' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  lineHeight: 1, userSelect: 'none',
                }}>{a.num}</div>
                <div style={{ fontFamily: 'Bangers, cursive', fontSize: 26, color: a.color }}>{a.name}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: a.color, opacity: 0.6, textTransform: 'uppercase' }}>{a.role}</div>
                <div style={{
                  fontSize: 13, fontWeight: 500, fontStyle: 'italic', lineHeight: 1.55,
                  borderTop: `2px solid ${a.color === '#fff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
                  paddingTop: 10, marginTop: 4, color: a.color, opacity: 0.85,
                }}>&quot;{a.quote}&quot;</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: debateActive ? '#06B6D4' : 'transparent',
                  border: `2px solid ${a.color === '#fff' ? 'rgba(255,255,255,0.4)' : '#111'}`,
                  color: debateActive ? '#fff' : a.color,
                  padding: '3px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.08em', alignSelf: 'flex-start', marginTop: 4,
                  animation: debateActive ? 'pulse 1.5s infinite' : 'none',
                }}>
                  {debateActive ? '● ACTIVE' : '○ IDLE'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

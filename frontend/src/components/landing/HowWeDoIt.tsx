interface AvatarProps { bg: string; initial: string; color?: string; }

function AgentAvatar({ bg, initial, color = '#111' }: AvatarProps) {
  return (
    <div style={{
      width: 40, height: 40, background: bg, border: '2px solid #111',
      fontFamily: 'Bangers, cursive', fontSize: 20, color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>{initial}</div>
  );
}

const steps = [
  {
    num: '01', bg: '#F5F0E8', color: '#111',
    title: 'ENTER A SHARP TOPIC',
    body: 'One sentence. No walls of text. Your debate topic is the only input.',
    avatars: [{ bg: '#06B6D4', initial: 'A', color: '#fff' }],
  },
  {
    num: '02', bg: '#06B6D4', color: '#fff',
    title: 'AGENTS DEBATE',
    body: 'Proponent builds the strongest case. Critic dismantles every claim — round by round.',
    avatars: [{ bg: '#fff', initial: 'P', color: '#06B6D4' }, { bg: '#1E1B4B', initial: 'C', color: '#06B6D4' }],
  },
  {
    num: '03', bg: '#A7F3D0', color: '#111',
    title: 'ANALYST EVALUATES',
    body: 'The Analyst stays neutral — identifying strengths, gaps, and missing context from both sides.',
    avatars: [{ bg: '#111', initial: 'A', color: '#A7F3D0' }],
  },
  {
    num: '04', bg: '#C084FC', color: '#fff',
    title: 'FACT-CHECK & CONCLUDE',
    body: 'Every claim is audited: Supported, Unsupported, or Unverifiable — producing the final reliable answer.',
    avatars: [{ bg: '#fff', initial: 'F', color: '#C084FC' }],
  },
];

export default function HowWeDoIt() {
  return (
    <section style={{ background: '#1E1B4B', borderBottom: '4px solid #111', padding: '16px 80px 80px' }}>
      <h2 style={{ fontFamily: 'Bangers, cursive', fontSize: 48, color: '#F5F0E8', textAlign: 'center', marginBottom: 40 }}>HOW WE DO IT</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
        {steps.map(s => (
          <div key={s.num} style={{
            background: s.bg, border: '4px solid #111', boxShadow: '8px 8px 0 0 #111',
            padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex' }}>
              {s.avatars.map((a, i) => (
                <div key={i} style={{ marginLeft: i > 0 ? -10 : 0, zIndex: s.avatars.length - i }}>
                  <AgentAvatar bg={a.bg} initial={a.initial} color={a.color} />
                </div>
              ))}
            </div>
            <div style={{ fontFamily: 'Bangers, cursive', fontSize: 64, color: 'rgba(0,0,0,0.1)', lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontFamily: 'Bangers, cursive', fontSize: 22, color: s.color }}>{s.title}</div>
            <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.6, color: s.color, opacity: 0.8 }}>{s.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

'use client';

const QUICK_TOPICS = [
  { label: 'AI IN COURTS',       topic: 'AI should replace human judges in courtrooms' },
  { label: 'REMOTE WORK',        topic: 'Remote work is better than office work' },
  { label: 'UBI NOW',            topic: 'Universal Basic Income should be implemented globally' },
  { label: 'SOCIAL MEDIA HARMS', topic: 'Social media does more harm than good to society' },
  { label: 'NUCLEAR IS GREEN',   topic: 'Nuclear energy is the best solution to climate change' },
  { label: 'CRYPTO DEAD?',       topic: 'Cryptocurrency has failed as a mainstream currency' },
  { label: 'FOUR-DAY WEEK',      topic: 'A four-day work week should become the global standard' },
];

const row2 = 'ACCURACY • ANALYSIS • FACT-CHECK • DEBATE • EVIDENCE • REASONING • BALANCE • CLAIM • REBUTTAL • VERDICT • ';

export default function Ticker({ onQuickTopic }: { onQuickTopic: (topic: string) => void }) {
  const items = [...QUICK_TOPICS, ...QUICK_TOPICS, ...QUICK_TOPICS];
  return (
    <div>
      <div style={{ background: '#111', borderTop: '4px solid #111', borderBottom: '4px solid #111', padding: '12px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marquee 32s linear infinite' }}>
          {items.map((item, i) => (
            <button key={i} onClick={() => onQuickTopic(item.topic)}
              style={{
                fontFamily: 'Bangers, cursive', fontSize: 20, letterSpacing: '0.15em',
                color: '#06B6D4', paddingRight: 32, background: 'none', border: 'none',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#06B6D4'; e.currentTarget.style.textDecoration = 'none'; }}
            >{item.label} •</button>
          ))}
        </div>
      </div>
      <div style={{ background: '#06B6D4', borderBottom: '4px solid #111', padding: '12px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marqueeRev 36s linear infinite' }}>
          {[row2, row2, row2].map((s, i) => (
            <span key={i} style={{ fontFamily: 'Bangers, cursive', fontSize: 20, letterSpacing: '0.15em', color: '#1E1B4B', paddingRight: 40 }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

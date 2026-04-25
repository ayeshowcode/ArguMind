import BrainIcon from '@/components/ui/BrainIcon';

export default function Footer() {
  return (
    <footer style={{
      background: '#111', borderTop: '4px solid #111',
      padding: '32px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <BrainIcon size={32} />
        <span style={{ fontFamily: 'Bangers, cursive', fontSize: 22, fontStyle: 'italic', color: '#F5F0E8', letterSpacing: '0.05em' }}>ARGUMIND</span>
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        4 AI Agents · Debate · Fact-Check · Reliable Answers
      </div>
    </footer>
  );
}

'use client';

import BrutalButton from '@/components/ui/BrutalButton';

export default function LaunchSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section style={{ background: '#06B6D4', borderBottom: '4px solid #111', padding: '80px 80px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'Bangers, cursive', fontSize: 58, color: '#fff', marginBottom: 20 }}>LAUNCH A DEBATE IN SECONDS.</h2>
      <div style={{
        background: 'rgba(255,255,255,0.15)', border: '4px solid rgba(255,255,255,0.4)',
        padding: '24px 28px', maxWidth: 520, margin: '0 auto 36px',
        fontSize: 16, fontWeight: 500, lineHeight: 1.65, color: '#fff',
      }}>
        One topic. One click. Four agents argue, analyse, and fact-check — you get a full structured transcript with a reliable, balanced conclusion.
      </div>
      <BrutalButton variant="danger" size="lg" label="SUBMIT YOUR TOPIC" onClick={onOpen}
        style={{ background: '#1E1B4B', color: '#06B6D4' }} />
    </section>
  );
}

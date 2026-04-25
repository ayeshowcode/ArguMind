'use client';

import BrutalButton from '@/components/ui/BrutalButton';

export default function HeroSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section style={{
      position: 'relative', minHeight: '92vh',
      background: '#F5F0E8',
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      display: 'flex', alignItems: 'center',
      padding: '80px 80px', overflow: 'hidden',
    }}>
      <div style={{
        background: '#1E1B4B', border: '6px solid #111',
        padding: '52px', boxShadow: '16px 16px 0 0 #111',
        transform: 'rotate(-1deg)', maxWidth: 640, position: 'relative', zIndex: 10,
      }}>
        <div style={{ fontFamily: 'Bangers, cursive', lineHeight: 1.02, marginBottom: 8 }}>
          <div style={{ fontSize: 72, color: '#F5F0E8' }}>4 AI AGENTS.</div>
          <div style={{ fontSize: 72, color: '#F5F0E8', fontStyle: 'italic' }}>DEBATE.</div>
          <div style={{ fontSize: 72, color: '#06B6D4', fontStyle: 'italic', textShadow: '3px 3px 0 #111' }}>FACT-CHECK.</div>
          <div style={{ fontSize: 72, color: '#F5F0E8', fontStyle: 'italic', textShadow: '3px 3px 0 #06B6D4' }}>DECIDE.</div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.07)', border: '4px solid rgba(255,255,255,0.2)',
          padding: '22px 26px', marginTop: 22,
          fontSize: 17, fontWeight: 500, lineHeight: 1.6, color: '#F5F0E8',
        }}>
          4 specialized AI agents argue, analyse, and fact-check your topic — you leave with a more reliable, multi-perspective answer.
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#06B6D4', border: '2px solid #111',
          padding: '8px 16px', marginTop: 20,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 2s infinite', flexShrink: 0 }} />
          <span style={{ fontFamily: 'Bangers, cursive', fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>MULTI-AGENT PIPELINE</span>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
          <BrutalButton variant="primary" size="lg" label="START A DEBATE →" onClick={onOpen} />
          <BrutalButton variant="secondary" size="lg" label="MEET THE AGENTS" onClick={() => {
            document.getElementById('agent-roster')?.scrollIntoView({ behavior: 'smooth' });
          }} />
        </div>
      </div>

      {/* Comic bursts */}
      <div style={{ position: 'absolute', top: 60, right: 80, transform: 'rotate(-8deg)', zIndex: 5 }}>
        <div style={{
          width: 160, height: 160, borderRadius: '50%',
          background: '#06B6D4', border: '4px solid #111', boxShadow: '6px 6px 0 0 #111',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bangers, cursive', fontSize: 44, color: '#fff',
        }}>BAM!</div>
      </div>
      <div style={{ position: 'absolute', top: 200, right: 310, transform: 'rotate(6deg)', zIndex: 6 }}>
        <div style={{
          width: 168, height: 130, background: '#1E1B4B', border: '4px solid #111', boxShadow: '6px 6px 0 0 #111',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bangers, cursive', fontSize: 38, color: '#06B6D4', gap: 4,
        }}>
          <div>POW!</div>
          <div style={{ fontSize: 11, fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: 1, color: '#F5F0E8' }}>4 Agents. One Truth.</div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 340, right: 72, transform: 'rotate(-4deg)', zIndex: 5 }}>
        <div style={{
          width: 150, height: 150, background: '#C084FC', border: '4px solid #111', boxShadow: '6px 6px 0 0 #111',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bangers, cursive', fontSize: 40, color: '#fff', gap: 8,
        }}>
          <div>ZAP!</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 3 }}>
            {['#06B6D4', '#1E1B4B', '#C084FC', '#F5F0E8'].map((c, i) => (
              <div key={i} style={{ width: 18, height: 18, background: c, border: '2px solid #111' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

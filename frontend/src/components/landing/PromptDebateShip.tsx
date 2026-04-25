export default function PromptDebateShip() {
  return (
    <section style={{ background: '#1E1B4B', borderBottom: '4px solid #111', padding: '80px 80px 40px' }}>
      <div style={{
        background: '#06B6D4', border: '4px solid #111', boxShadow: '8px 8px 0 0 #111',
        padding: '18px 32px', display: 'inline-block', transform: 'rotate(-1deg)', marginBottom: 32,
      }}>
        <span style={{ fontFamily: 'Bangers, cursive', fontSize: 54, color: '#fff', letterSpacing: '0.03em' }}>
          ARGUE. ANALYSE. VERIFY.
        </span>
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.08)', border: '4px solid rgba(255,255,255,0.15)',
        padding: '24px 28px', maxWidth: 640, fontSize: 18, fontWeight: 500, lineHeight: 1.65, color: '#F5F0E8',
      }}>
        Your topic goes through 4 specialized AI agents who argue, analyse, and fact-check — producing a more reliable, balanced answer than any single model alone.
      </div>
    </section>
  );
}

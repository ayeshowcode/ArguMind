'use client';

import { useState, useEffect, useRef } from 'react';

export default function StatsBar() {
  const [started, setStarted] = useState(false);
  const [n1, setN1] = useState(0);
  const [n2, setN2] = useState(0);
  const [out, setOut] = useState('_');
  const [json, setJson] = useState('_');
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 800, 1);
      setN1(Math.round(4 * p));
      setN2(Math.round(3 * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const reveal = (str: string, setter: (s: string) => void) => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setter(str.slice(0, i));
        if (i >= str.length) clearInterval(iv);
      }, 120);
    };
    reveal('OUT', setOut);
    setTimeout(() => reveal('JSON', setJson), 200);
  }, [started]);

  const stats = [
    { val: n1 || '0', label: 'SPECIALIZED AGENTS' },
    { val: n2 || '0', label: 'DEBATE ROUNDS' },
    { val: out,       label: 'TRANSCRIPT · VERDICT · SCORES' },
    { val: json,      label: 'STRUCTURED OUTPUT' },
  ];

  return (
    <section ref={ref} style={{
      background: '#111', borderTop: '4px solid #111', borderBottom: '4px solid #111',
      padding: '40px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    }}>
      {stats.map((s, i) => (
        <>
          {i > 0 && <div key={`div-${i}`} style={{ width: 1, height: 64, background: 'rgba(255,255,255,0.15)' }} />}
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Bangers, cursive', fontSize: 80, color: '#06B6D4', lineHeight: 1, minWidth: 80 }}>{s.val}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F5F0E8', letterSpacing: '0.15em', marginTop: 4, textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        </>
      ))}
    </section>
  );
}

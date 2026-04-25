'use client';

import { useState } from 'react';
import BrutalButton from '@/components/ui/BrutalButton';
import { Message } from '@/types/debate';

interface SummaryCardProps {
  messages: Message[];
  topic: string;
  onNewDebate: () => void;
}

export default function SummaryCard({ messages, topic, onNewDebate }: SummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const fcMsg = messages.filter(m => m.role === 'fact_checker').slice(-1)[0];
  const maxRound = Math.max(...messages.map(m => m.round));
  const agentCount = new Set(messages.map(m => m.role)).size;

  const handleCopy = () => {
    const lines = [`ARGUMIND DEBATE TRANSCRIPT`, `Topic: ${topic}`, `Date: ${new Date().toLocaleDateString()}`, ''];
    const byRound: Record<number, Message[]> = {};
    messages.forEach(m => { if (!byRound[m.round]) byRound[m.round] = []; byRound[m.round].push(m); });
    Object.keys(byRound).sort((a, b) => Number(a) - Number(b)).forEach(r => {
      lines.push(`--- ${Number(r) === 0 ? 'OPENING' : `ROUND ${r}`} ---`);
      byRound[Number(r)].forEach(m => { lines.push(`[${m.role.toUpperCase()}]: ${m.content}`); lines.push(''); });
    });
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{
      background: '#1E1B4B', border: '4px solid #111', boxShadow: '16px 16px 0 0 #111',
      padding: 36, maxWidth: 720, margin: '8px auto 80px',
    }}>
      <div style={{ fontFamily: 'Bangers, cursive', fontSize: 40, color: '#06B6D4', marginBottom: 24 }}>DEBATE COMPLETE</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'TOTAL MESSAGES', val: messages.length },
          { label: 'ROUNDS',         val: maxRound },
          { label: 'AGENTS ACTIVE',  val: agentCount },
        ].map(s => (
          <div key={s.label} style={{
            background: '#F5F0E8', border: '4px solid #111', boxShadow: '4px 4px 0 0 #111',
            padding: '20px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'Bangers, cursive', fontSize: 56, color: '#1E1B4B', lineHeight: 1 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {fcMsg && (
        <div style={{
          background: 'rgba(192,132,252,0.15)', border: '4px solid #C084FC',
          padding: '22px 24px', marginBottom: 28,
        }}>
          <div style={{ fontFamily: 'Bangers, cursive', fontSize: 18, color: '#C084FC', marginBottom: 12, letterSpacing: '0.1em' }}>
            FACT-CHECKER FINAL AUDIT
          </div>
          <div style={{ fontSize: 14, color: '#F5F0E8', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{fcMsg.content}</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <BrutalButton variant="primary" size="lg" label="NEW DEBATE →" onClick={onNewDebate} />
        <BrutalButton variant="secondary" label={copied ? '✓ COPIED!' : 'COPY TRANSCRIPT'} onClick={handleCopy} />
      </div>
    </div>
  );
}

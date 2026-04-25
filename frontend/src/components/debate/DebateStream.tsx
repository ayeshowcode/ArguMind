'use client';

import { useState, useEffect } from 'react';
import MessageCard from '@/components/ui/MessageCard';
import { Message } from '@/types/debate';

interface DebateStreamProps {
  messages: Message[];
  topic: string;
}

export default function DebateStream({ messages, topic }: DebateStreamProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    const iv = setInterval(() => {
      setVisibleCount(c => {
        if (c >= messages.length) { clearInterval(iv); return c; }
        return c + 1;
      });
    }, 600);
    return () => clearInterval(iv);
  }, [messages]);

  const rounds = [...new Set(messages.map(m => m.round))];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{
        background: '#1E1B4B', border: '4px solid #111', boxShadow: '8px 8px 0 0 #111',
        padding: '24px 28px', marginBottom: 48, display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#06B6D4', animation: 'pulse 2s infinite', flexShrink: 0 }} />
        <div style={{ fontFamily: 'Bangers, cursive', fontSize: 28, color: '#06B6D4' }}>DEBATING:</div>
        <div style={{ fontFamily: 'Bangers, cursive', fontSize: 22, color: '#F5F0E8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {topic.toUpperCase()}
        </div>
      </div>

      {rounds.map(r => {
        const roundMsgs = messages.filter(m => m.round === r);
        return (
          <div key={r}>
            <div style={{
              fontFamily: 'Bangers, cursive', fontSize: 32, color: '#111',
              borderBottom: '4px solid #111', paddingBottom: 8, marginBottom: 24, marginTop: 40,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ background: '#06B6D4', color: '#fff', padding: '2px 14px', fontSize: 28 }}>
                {r === 0 ? 'OPENING STATEMENT' : `ROUND ${r}`}
              </span>
            </div>
            {roundMsgs.map((msg, i) => {
              const globalIdx = messages.indexOf(msg);
              return <MessageCard key={i} message={msg} visible={globalIdx < visibleCount} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

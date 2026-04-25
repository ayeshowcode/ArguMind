'use client';

import { useState, useEffect } from 'react';
import BrutalButton from '@/components/ui/BrutalButton';
import { DebateParams } from '@/types/debate';

function WizardAvatar() {
  return (
    <div style={{
      width: 48, height: 48, background: '#06B6D4', border: '2px solid #111',
      display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, padding: 8, flexShrink: 0,
    }}>
      {Array(9).fill(0).map((_, i) => (
        <div key={i} style={{ background: i % 2 === 0 ? '#fff' : 'transparent', borderRadius: 1 }} />
      ))}
    </div>
  );
}

const QUICK_FILLS = [
  { label: 'AI & SOCIETY', topic: 'AI will do more harm than good to society' },
  { label: 'TECH',         topic: 'Remote work is better than office work' },
  { label: 'ETHICS',       topic: 'Privacy is more important than security' },
];

interface WizardState {
  topic: string;
  rounds: number;
  step: number;
}

function StepTopic({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <WizardAvatar />
        <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.5, paddingTop: 6 }}>
          Quick ask: <em>&quot;What do you want to debate?&quot;</em>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>TOPIC</div>
        <textarea
          value={state.topic}
          onChange={e => setState(s => ({ ...s, topic: e.target.value }))}
          maxLength={200} rows={3}
          placeholder="e.g. AI should replace human judges in courtrooms"
          style={{
            width: '100%', border: '4px solid #111', background: '#F5F0E8',
            padding: '12px 14px', fontSize: 15, fontWeight: 500, resize: 'none',
            outline: 'none', boxSizing: 'border-box',
          }}
          onFocus={e => { e.target.style.background = '#E0F7FA'; }}
          onBlur={e => { e.target.style.background = '#F5F0E8'; }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {QUICK_FILLS.map(q => (
            <button key={q.label} onClick={() => setState(s => ({ ...s, topic: q.topic }))}
              style={{
                border: '2px solid #111', padding: '5px 12px', fontSize: 12, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                background: state.topic === q.topic ? '#06B6D4' : '#F5F0E8',
                color: state.topic === q.topic ? '#fff' : '#111',
                cursor: 'pointer',
              }}
            >{q.label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <BrutalButton
          variant="primary" label="CONTINUE →"
          onClick={() => setState(s => ({ ...s, step: 2 }))}
          disabled={state.topic.trim().length <= 10}
        />
      </div>
    </div>
  );
}

function StepRounds({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <WizardAvatar />
        <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.5, paddingTop: 6 }}>
          Quick ask: <em>&quot;How many rounds should they debate?&quot;</em>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>ROUNDS (1–5)</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setState(s => ({ ...s, rounds: n }))}
              style={{
                width: 52, height: 52, border: '4px solid #111',
                fontFamily: 'Bangers, cursive', fontSize: 26,
                background: state.rounds === n ? '#06B6D4' : '#F5F0E8',
                color: state.rounds === n ? '#fff' : '#111',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: state.rounds === n ? '4px 4px 0 0 #111' : 'none',
              }}
            >{n}</button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#666', marginTop: 12 }}>More rounds = deeper debate + longer processing time.</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <BrutalButton variant="secondary" label="← BACK" onClick={() => setState(s => ({ ...s, step: 1 }))} />
        <BrutalButton variant="primary"   label="CONTINUE →" onClick={() => setState(s => ({ ...s, step: 3 }))} />
      </div>
    </div>
  );
}

function StepReview({
  state,
  setState,
  onSubmit,
}: {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
  onSubmit: (params: DebateParams) => void;
}) {
  const rows = [
    { label: 'TOPIC',  strip: '#06B6D4', value: state.topic },
    { label: 'ROUNDS', strip: '#1E1B4B', value: state.rounds },
    { label: 'AGENTS', strip: '#C084FC', value: '4 (Proponent · Critic · Analyst · Fact-Checker)' },
    { label: 'MODEL',  strip: '#111',    value: 'GPT-4o-mini' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ fontFamily: 'Bangers, cursive', fontSize: 32, margin: 0 }}>REVIEW</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(r => (
          <div key={r.label} style={{
            border: '4px solid #111', boxShadow: '4px 4px 0 0 #111',
            display: 'flex', alignItems: 'stretch', background: '#fff', overflow: 'hidden',
          }}>
            <div style={{ width: 6, background: r.strip, flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', width: 72, flexShrink: 0 }}>{r.label}</div>
              <div style={{ fontFamily: 'Bangers, cursive', fontSize: 18, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <BrutalButton variant="secondary" label="← BACK" onClick={() => setState(s => ({ ...s, step: 2 }))} />
        <BrutalButton variant="primary" size="lg" label="LAUNCH DEBATE →" onClick={() => onSubmit({ topic: state.topic, rounds: state.rounds })} />
      </div>
    </div>
  );
}

interface BriefTerminalProps {
  onClose: () => void;
  onSubmit: (params: DebateParams) => void;
  initialTopic?: string;
}

export default function BriefTerminal({ onClose, onSubmit, initialTopic = '' }: BriefTerminalProps) {
  const [state, setState] = useState<WizardState>({ topic: initialTopic, rounds: 3, step: 1 });

  useEffect(() => {
    if (initialTopic) setState(s => ({ ...s, topic: initialTopic }));
  }, [initialTopic]);

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(30,27,75,0.92)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#F5F0E8', border: '4px solid #111', boxShadow: '12px 12px 0 0 #111', width: '100%', maxWidth: 520, overflow: 'hidden' }}>
        <div style={{ background: '#06B6D4', borderBottom: '4px solid #111', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Bangers, cursive', fontSize: 24, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff' }}>
            DEBATE TERMINAL
          </span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ background: '#1E1B4B', color: '#06B6D4', fontSize: 11, fontWeight: 700, padding: '2px 8px', display: 'inline-block' }}>
              STEP {state.step}/3
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>INTAKE WIZARD</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: '16px 24px 0' }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ flex: 1, height: 8, border: '2px solid #111', background: state.step >= n ? '#06B6D4' : '#F5F0E8', transition: 'background 200ms' }} />
          ))}
        </div>
        <div style={{ padding: '24px' }}>
          {state.step === 1 && <StepTopic  state={state} setState={setState} />}
          {state.step === 2 && <StepRounds state={state} setState={setState} />}
          {state.step === 3 && <StepReview state={state} setState={setState} onSubmit={onSubmit} />}
        </div>
      </div>
    </div>
  );
}

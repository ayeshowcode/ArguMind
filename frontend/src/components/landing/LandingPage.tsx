'use client';

import { useState } from 'react';
import HeroSection from './HeroSection';
import Ticker from './Ticker';
import PromptDebateShip from './PromptDebateShip';
import HowWeDoIt from './HowWeDoIt';
import StatsBar from './StatsBar';
import LaunchSection from './LaunchSection';
import AgentRoster from './AgentRoster';
import BriefTerminal from '@/components/wizard/BriefTerminal';
import { DebateParams } from '@/types/debate';

export default function LandingPage({ onStartDebate }: { onStartDebate: (topic: string, rounds: number) => void }) {
  const [wizardOpen, setWizardOpen]     = useState(false);
  const [initialTopic, setInitialTopic] = useState('');

  const openWith = (topic = '') => { setInitialTopic(topic); setWizardOpen(true); };

  return (
    <div style={{ background: '#F5F0E8' }}>
      <HeroSection onOpen={() => openWith()} />
      <Ticker onQuickTopic={t => openWith(t)} />
      <PromptDebateShip />
      <HowWeDoIt />
      <StatsBar />
      <LaunchSection onOpen={() => openWith()} />
      <AgentRoster />
      {wizardOpen && (
        <BriefTerminal
          initialTopic={initialTopic}
          onClose={() => setWizardOpen(false)}
          onSubmit={({ topic, rounds }: DebateParams) => { setWizardOpen(false); onStartDebate(topic, rounds); }}
        />
      )}
    </div>
  );
}

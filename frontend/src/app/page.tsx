'use client';

import { useState } from 'react';
import AppHeader from '@/components/ui/AppHeader';
import LandingPage from '@/components/landing/LandingPage';
import DebateView from '@/components/debate/DebateView';
import Footer from '@/components/landing/Footer';
import { DebateParams } from '@/types/debate';

export default function Home() {
  const [page, setPage]           = useState<'landing' | 'debate'>('landing');
  const [debateParams, setDebate] = useState<DebateParams | null>(null);

  const startDebate = (topic: string, rounds: number) => {
    setDebate({ topic, rounds });
    setPage('debate');
    window.scrollTo({ top: 0 });
  };

  const backToLanding = () => {
    setPage('landing');
    setDebate(null);
    window.scrollTo({ top: 0 });
  };

  return (
    <div>
      <AppHeader onBack={page === 'debate' ? backToLanding : null} />
      {page === 'landing' && <LandingPage onStartDebate={startDebate} />}
      {page === 'debate' && debateParams && (
        <DebateView topic={debateParams.topic} rounds={debateParams.rounds} onBack={backToLanding} />
      )}
      <Footer />
    </div>
  );
}

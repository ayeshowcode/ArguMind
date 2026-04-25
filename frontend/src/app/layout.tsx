import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArguMind — AI Debate & Fact-Check Platform',
  description: '4 specialized AI agents argue, analyse, and fact-check your topic — you leave with a more reliable, multi-perspective answer.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bangers&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}

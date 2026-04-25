import { AgentRole } from '@/types/debate';

const roleConfig: Record<string, { bg: string; color: string; label: string }> = {
  proponent:    { bg: '#06B6D4', color: '#fff',    label: 'PROPONENT' },
  critic:       { bg: '#1E1B4B', color: '#06B6D4', label: 'CRITIC' },
  analyst:      { bg: '#A7F3D0', color: '#111',    label: 'ANALYST' },
  fact_checker: { bg: '#C084FC', color: '#fff',    label: 'FACT-CHECKER' },
};

export default function AgentBadge({ role }: { role: AgentRole | string }) {
  const cfg = roleConfig[role] ?? { bg: '#eee', color: '#111', label: role.toUpperCase() };
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      border: '2px solid #111', padding: '3px 10px',
      fontFamily: 'Bangers, cursive', fontSize: 13,
      letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-block',
    }}>{cfg.label}</span>
  );
}

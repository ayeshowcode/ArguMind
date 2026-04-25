import AgentBadge from './AgentBadge';
import { Message } from '@/types/debate';

const stripColors: Record<string, string> = {
  proponent:    '#06B6D4',
  critic:       '#1E1B4B',
  analyst:      '#A7F3D0',
  fact_checker: '#C084FC',
};

interface MessageCardProps {
  message: Message;
  visible: boolean;
}

export default function MessageCard({ message, visible }: MessageCardProps) {
  const stripColor = stripColors[message.role] ?? '#111';
  const isFC = message.role === 'fact_checker';
  return (
    <div style={{
      background: isFC ? '#FAF5FF' : message.role === 'critic' ? '#F5F8FF' : '#fff',
      border: isFC ? '6px solid #111' : '4px solid #111',
      borderLeft: `8px solid ${stripColor}`,
      boxShadow: isFC ? '12px 12px 0 0 #111' : '8px 8px 0 0 #111',
      padding: 24, marginBottom: 24,
      opacity: visible ? 1 : 0, transition: 'opacity 400ms ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <AgentBadge role={message.role} />
        <span style={{
          background: '#111', color: '#06B6D4', fontFamily: 'Bangers, cursive',
          fontSize: 12, letterSpacing: '0.08em', padding: '2px 8px', textTransform: 'uppercase',
        }}>
          {message.round === 0 ? 'OPENING' : `ROUND ${message.round}`}
        </span>
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.7, fontWeight: 500, whiteSpace: 'pre-wrap', color: '#111' }}>
        {message.content}
      </div>
    </div>
  );
}

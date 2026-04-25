interface BrainIconProps {
  size?: number;
}

export default function BrainIcon({ size = 40 }: BrainIconProps) {
  return (
    <div style={{
      width: size, height: size,
      background: '#06B6D4', border: '2px solid #111',
      display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
      gap: 3, padding: 8, flexShrink: 0,
    }}>
      {Array(9).fill(0).map((_, i) => (
        <div key={i} style={{ background: i % 2 === 0 ? '#111' : 'transparent', borderRadius: 1 }} />
      ))}
    </div>
  );
}

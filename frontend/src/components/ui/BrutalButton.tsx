'use client';

import { CSSProperties } from 'react';

interface BrutalButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}

const bgMap    = { primary: '#06B6D4', secondary: '#F5F0E8', danger: '#1E1B4B' };
const colorMap = { primary: '#fff',    secondary: '#111',    danger: '#06B6D4' };

export default function BrutalButton({
  label,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  style: extra = {},
}: BrutalButtonProps) {
  const pad = size === 'lg' ? '18px 36px' : '10px 22px';
  const fs  = size === 'lg' ? 22 : 17;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? '#ccc' : bgMap[variant],
        color: disabled ? '#888' : colorMap[variant],
        border: '4px solid #111',
        padding: pad, fontFamily: 'Bangers, cursive', fontSize: fs,
        letterSpacing: '0.05em', textTransform: 'uppercase',
        boxShadow: disabled ? 'none' : '8px 8px 0 0 #111',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 75ms',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        opacity: disabled ? 0.5 : 1, ...extra,
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '12px 12px 0 0 #111'; } }}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '8px 8px 0 0 #111'; } }}
      onMouseDown={e => { if (!disabled) { e.currentTarget.style.transform = 'translate(4px,4px)'; e.currentTarget.style.boxShadow = '0 0 0 0 #111'; } }}
      onMouseUp={e => { if (!disabled) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '12px 12px 0 0 #111'; } }}
    >{label}</button>
  );
}

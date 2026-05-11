'use client';

import { useState, useEffect } from 'react';
import BrutalButton from './BrutalButton';

interface LLMConfigModalProps {
  onClose: () => void;
}

export default function LLMConfigModal({ onClose }: LLMConfigModalProps) {
  const [provider, setProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedProvider = localStorage.getItem('llm_provider');
    const savedKey = localStorage.getItem('llm_key');
    if (savedProvider) setProvider(savedProvider);
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSave = () => {
    localStorage.setItem('llm_provider', provider);
    localStorage.setItem('llm_key', apiKey);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
      padding: 20
    }}>
      <div style={{
        background: '#06B6D4', border: '4px solid #111', boxShadow: '8px 8px 0 0 #111',
        padding: 32, width: '100%', maxWidth: 450,
      }}>
        <h2 style={{ fontFamily: 'Bangers, cursive', fontSize: 32, marginBottom: 20, color: '#111', lineHeight: 1 }}>
          LLM CONFIGURATION
        </h2>
        <p style={{ fontFamily: 'sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 20, color: '#111' }}>
          Please select an LLM provider and enter your API key. These credentials are saved locally in your browser.
        </p>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontFamily: 'sans-serif', fontWeight: 800, fontSize: 14, marginBottom: 8, color: '#111' }}>PROVIDER</label>
          <select 
            value={provider} 
            onChange={e => setProvider(e.target.value)}
            style={{
              width: '100%', padding: '10px', fontSize: 16, border: '2px solid #111',
              background: '#fff', fontFamily: 'sans-serif', outline: 'none'
            }}
          >
            <option value="openai">OpenAI</option>
            <option value="gemini">Google Gemini</option>
            <option value="grok">Grok (xAI)</option>
            <option value="groq">Groq</option>
            <option value="openrouter">OpenRouter</option>
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontFamily: 'sans-serif', fontWeight: 800, fontSize: 14, marginBottom: 8, color: '#111' }}>API KEY</label>
          <input 
            type="password" 
            value={apiKey} 
            onChange={e => setApiKey(e.target.value)}
            placeholder={`Enter your ${provider} API key`}
            style={{
              width: '100%', padding: '10px', fontSize: 16, border: '2px solid #111',
              background: '#fff', fontFamily: 'monospace', outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <BrutalButton variant="primary" label="SAVE CONFIG" onClick={handleSave} disabled={!apiKey.trim()} />
          <BrutalButton variant="secondary" label="CLOSE" onClick={onClose} />
        </div>
      </div>
    </div>
  );
}

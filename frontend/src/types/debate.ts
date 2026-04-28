export type AgentRole = 'proponent' | 'critic' | 'analyst' | 'fact_checker' | 'judge';

export interface Message {
  role: AgentRole;
  round: number;
  content: string;
}

export interface Judgment {
  votes: {
    accuracy: number;
    balance: number;
    depth: number;
    reasoning_quality: number;
  };
  winner: string;
  verdict: string;
}

export interface DebateResult {
  topic: string;
  messages: Message[];
  judgment: Judgment | null;
}

export interface DebateParams {
  topic: string;
  rounds: number;
}

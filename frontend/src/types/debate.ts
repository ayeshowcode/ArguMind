export type AgentRole = 'proponent' | 'critic' | 'analyst' | 'fact_checker';

export interface Message {
  role: AgentRole;
  round: number;
  content: string;
}

export interface DebateResult {
  topic: string;
  messages: Message[];
}

export interface DebateParams {
  topic: string;
  rounds: number;
}

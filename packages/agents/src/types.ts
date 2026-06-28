export type AgentType =
  | 'planner'
  | 'requirements'
  | 'architect'
  | 'database'
  | 'api'
  | 'infrastructure'
  | 'security'
  | 'reviewer';

export interface AgentConfig {
  type: AgentType;
  model: string;
  temperature: number;
  maxTokens: number;
  retryCount: number;
  timeoutMs: number;
}

export interface AgentContext {
  userId: string;
  projectId: string;
  prompt: string;
  existingNodes?: any[];
  existingEdges?: any[];
}

export interface AgentInput {
  prompt?: string;
  [key: string]: unknown;
}

export interface AgentOutput {
  success: boolean;
  data: Record<string, unknown>;
  tokensUsed: number;
  latencyMs: number;
  error?: string;
}

export interface PipelineConfig {
  agents: AgentType[];
  parallel: boolean;
  maxRetries: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface ArchitectureNode {
  id: string;
  type: string;
  position: Position;
  data: {
    label: string;
    description?: string;
    icon?: string;
    config?: Record<string, unknown>;
    metadata?: {
      cost?: number;
      provider?: string;
      version?: string;
      status?: 'planned' | 'active' | 'deprecated';
    };
  };
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'smoothstep' | 'straight';
  label?: string;
  animated?: boolean;
  data?: {
    protocol?: string;
    port?: number;
    description?: string;
  };
}

export interface CanvasState {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
  version: number;
}

export interface ArchitectureDecision {
  title: string;
  description: string;
  reasoning: string;
  alternatives: string[];
  impact: 'high' | 'medium' | 'low';
}

export interface CostBreakdown {
  service: string;
  cost: number;
  unit: string;
}

export interface CostEstimate {
  total: number;
  breakdown: CostBreakdown[];
  currency: string;
  period: 'monthly' | 'yearly';
}

export interface ArchitectureIssue {
  severity: 'critical' | 'warning' | 'info';
  type: 'security' | 'performance' | 'reliability' | 'cost' | 'best-practice';
  title: string;
  description: string;
  suggestion: string;
  relatedNodeIds?: string[];
}

export interface ProactiveSuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'optimization' | 'security' | 'cost';
  title: string;
  description: string;
  impact: string;
  action: {
    type: 'add-node' | 'modify-node' | 'add-edge' | 'remove-node';
    payload: Partial<ArchitectureNode> | Partial<ArchitectureEdge>;
  };
}

export interface AiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  data?: Record<string, unknown>;
}

export interface AgentResult {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  explanation: string;
  decisions: ArchitectureDecision[];
  totalTokens?: number;
}

import type { Node, Edge } from '@xyflow/react';

export type OrbitNodeType =
  | 'frontend' | 'backend' | 'database' | 'api' | 'gateway'
  | 'auth' | 'cache' | 'queue' | 'worker' | 'storage'
  | 'cdn' | 'lambda' | 'kubernetes' | 'docker' | 'cloud'
  | 'ai-model' | 'monitoring' | 'secrets' | 'webhook'
  | 'third-party' | 'custom';

export interface OrbitNodeData {
  label: string;
  description?: string;
  icon?: string;
  type: OrbitNodeType;
  config?: Record<string, unknown>;
  metadata?: {
    cost?: number;
    provider?: string;
    version?: string;
    status?: 'planned' | 'active' | 'deprecated';
  };
}

export type OrbitNode = Node<OrbitNodeData>;
export type OrbitEdge = Edge;

export const NODE_COLORS: Record<OrbitNodeType, string> = {
  frontend: '#3b82f6',
  backend: '#6366f1',
  database: '#22c55e',
  api: '#a855f7',
  gateway: '#8b5cf6',
  auth: '#ef4444',
  cache: '#14b8a6',
  queue: '#ec4899',
  worker: '#f59e0b',
  storage: '#64748b',
  cdn: '#0ea5e9',
  lambda: '#f97316',
  kubernetes: '#3b82f6',
  docker: '#0ea5e9',
  cloud: '#6366f1',
  'ai-model': '#06b6d4',
  monitoring: '#eab308',
  secrets: '#dc2626',
  webhook: '#a855f7',
  'third-party': '#78716c',
  custom: '#6b7280',
};

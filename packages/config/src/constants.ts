export const NODE_TYPES = [
  'frontend', 'backend', 'database', 'api', 'gateway',
  'auth', 'cache', 'queue', 'worker', 'storage',
  'cdn', 'lambda', 'kubernetes', 'docker', 'cloud',
  'ai-model', 'monitoring', 'secrets', 'webhook',
  'third-party', 'custom',
] as const;

export type NodeType = (typeof NODE_TYPES)[number];

export const NODE_CATEGORIES: Record<string, { color: string; icon: string }> = {
  application: { color: '#3b82f6', icon: 'app-window' },
  data: { color: '#22c55e', icon: 'database' },
  infrastructure: { color: '#f97316', icon: 'server' },
  network: { color: '#a855f7', icon: 'globe' },
  security: { color: '#ef4444', icon: 'shield' },
  ai: { color: '#06b6d4', icon: 'cpu' },
  monitoring: { color: '#eab308', icon: 'activity' },
  queue: { color: '#ec4899', icon: 'message-square' },
};

export const NODE_METADATA: Record<NodeType, { category: string; label: string; icon: string }> = {
  frontend: { category: 'application', label: 'Frontend', icon: 'monitor' },
  backend: { category: 'application', label: 'Backend', icon: 'server' },
  database: { category: 'data', label: 'Database', icon: 'database' },
  api: { category: 'network', label: 'API', icon: 'api' },
  gateway: { category: 'network', label: 'API Gateway', icon: 'waypoints' },
  auth: { category: 'security', label: 'Authentication', icon: 'shield' },
  cache: { category: 'data', label: 'Cache', icon: 'zap' },
  queue: { category: 'queue', label: 'Queue', icon: 'message-square' },
  worker: { category: 'application', label: 'Worker', icon: 'cpu' },
  storage: { category: 'data', label: 'Storage', icon: 'hard-drive' },
  cdn: { category: 'network', label: 'CDN', icon: 'globe' },
  lambda: { category: 'infrastructure', label: 'Lambda', icon: 'cloud-lightning' },
  kubernetes: { category: 'infrastructure', label: 'Kubernetes', icon: 'container' },
  docker: { category: 'infrastructure', label: 'Docker', icon: 'box' },
  cloud: { category: 'infrastructure', label: 'Cloud', icon: 'cloud' },
  'ai-model': { category: 'ai', label: 'AI Model', icon: 'brain' },
  monitoring: { category: 'monitoring', label: 'Monitoring', icon: 'activity' },
  secrets: { category: 'security', label: 'Secrets', icon: 'key' },
  webhook: { category: 'network', label: 'Webhook', icon: 'webhook' },
  'third-party': { category: 'network', label: 'Third Party', icon: 'puzzle' },
  custom: { category: 'application', label: 'Custom', icon: 'component' },
};

export const CANVAS_CONFIG = {
  snapToGrid: true,
  gridSize: 20,
  nodeWidth: 200,
  nodeHeight: 80,
  minZoom: 0.1,
  maxZoom: 4,
  autoSaveInterval: 30_000,
  maxHistory: 50,
} as const;

export const AI_CONFIG = {
  maxRetries: 3,
  timeoutMs: 30_000,
  maxTokensPerAgent: 2000,
  cacheTTL: 3600,
  tokenBudget: 10000,
};

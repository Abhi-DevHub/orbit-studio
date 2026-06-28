import type { ArchitectureNode, CostEstimate } from '@orbit/config';

interface ExplainResult {
  purpose: string;
  alternatives: string[];
  costEstimate: CostEstimate;
  bestPractices: string[];
  commonMistakes: string[];
  scaling: string;
}

const NODE_EXPLANATIONS: Record<string, Partial<ExplainResult>> = {
  database: {
    purpose: 'Persistent storage for structured data. Handles CRUD operations, transactions, and data integrity.',
    alternatives: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Supabase'],
    bestPractices: ['Use connection pooling', 'Add proper indexes', 'Enable automated backups', 'Use read replicas for scaling'],
    commonMistakes: ['Missing indexes on foreign keys', 'N+1 query problems', 'Not using connection pooling', 'Over-normalization'],
    scaling: 'Start with a single instance, add read replicas as load grows, shard at extreme scale',
  },
  cache: {
    purpose: 'In-memory data store for reducing latency and database load by caching frequently accessed data.',
    alternatives: ['Redis', 'Memcached', 'Cloud CDN', 'Varnish'],
    bestPractices: ['Set TTL for all keys', 'Use cache-aside pattern', 'Monitor cache hit rates', 'Plan for cache invalidation'],
    commonMistakes: ['No TTL on keys', 'Caching stale data', 'Cache-aside without error handling', 'Using cache for non-repetitive data'],
    scaling: 'Redis Cluster for horizontal scaling, or use managed services like ElastiCache',
  },
  gateway: {
    purpose: 'Single entry point for all client requests. Handles routing, authentication, rate limiting, and request transformation.',
    alternatives: ['Kong', 'AWS API Gateway', 'NGINX', 'Traefik', 'Envoy'],
    bestPractices: ['Implement rate limiting', 'Use request validation', 'Enable logging', 'Set up monitoring'],
    commonMistakes: ['Bypassing gateway for internal services', 'Not rate limiting', 'Exposing internal endpoints'],
    scaling: 'Horizontal scaling behind a load balancer, typically stateless',
  },
};

export class ExplainAgent {
  async explain(node: ArchitectureNode): Promise<ExplainResult> {
    const base = NODE_EXPLANATIONS[node.type] ?? NODE_EXPLANATIONS.database!;
    return {
      purpose: base.purpose ?? 'System component for specific functionality.',
      alternatives: base.alternatives ?? ['Alternative 1', 'Alternative 2'],
      costEstimate: {
        total: this.estimateCost(node.type),
        breakdown: [{ service: (node.data?.label as string) || node.type, cost: this.estimateCost(node.type), unit: 'month' }],
        currency: 'USD',
        period: 'monthly',
      },
      bestPractices: base.bestPractices ?? ['Follow vendor documentation', 'Monitor performance'],
      commonMistakes: base.commonMistakes ?? ['Over-engineering', 'Missing error handling'],
      scaling: base.scaling ?? 'Scale horizontally based on load metrics',
    };
  }

  private estimateCost(type: string): number {
    const costs: Record<string, number> = {
      database: 40,
      cache: 15,
      gateway: 35,
      frontend: 0,
      backend: 50,
      queue: 20,
      storage: 10,
      cdn: 15,
      kubernetes: 70,
      lambda: 5,
    };
    return costs[type] || 25;
  }
}

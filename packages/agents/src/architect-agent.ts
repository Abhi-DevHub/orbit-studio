import { BaseAgent } from './base-agent';
import type { AgentInput, AgentOutput } from './types';

export class ArchitectAgent extends BaseAgent {
  constructor() {
    super('architect', { model: 'gpt-5', temperature: 0.3 });
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    const start = Date.now();
    const plannerOutput = input.plannerOutput as Record<string, unknown> | undefined;
    const services = (plannerOutput?.services as unknown[]) || this.generateDefaultServices();

    return {
      success: true,
      data: {
        services: services,
        techStack: [
          { technology: 'Next.js 15', category: 'frontend', purpose: 'Web application framework', alternatives: ['React + Vite'], reasoning: 'Full-stack with SSR' },
          { technology: 'PostgreSQL', category: 'database', purpose: 'Primary database', alternatives: ['MySQL'], reasoning: 'Reliability and features' },
          { technology: 'Redis', category: 'cache', purpose: 'Caching and session management', alternatives: ['Memcached'], reasoning: 'Data structure support' },
          { technology: 'Docker', category: 'infrastructure', purpose: 'Containerization', alternatives: ['Podman'], reasoning: 'Industry standard' },
        ],
        decisions: [
          { title: 'Microservices Architecture', description: 'Split into independent services', reasoning: 'Scalability and team autonomy', alternatives: ['Monolith'], impact: 'high' },
        ],
        integrations: [],
        dataFlow: [],
      } as Record<string, unknown>,
      tokensUsed: 500,
      latencyMs: Date.now() - start,
    };
  }

  private generateDefaultServices(): any[] {
    return [
      {
        id: 'api-gateway',
        name: 'API Gateway',
        type: 'gateway',
        description: 'Entry point for all client requests',
        responsibilities: ['Request routing', 'Authentication', 'Rate limiting'],
        dependencies: [],
        techStack: ['Next.js', 'tRPC'],
        apiType: 'REST',
        scaling: 'Horizontal',
        estimatedLoad: '1000 req/s',
      },
      {
        id: 'auth-service',
        name: 'Auth Service',
        type: 'auth',
        description: 'User authentication and authorization',
        responsibilities: ['User management', 'JWT issuance', 'OAuth'],
        dependencies: ['api-gateway'],
        techStack: ['Better Auth', 'JWT'],
        apiType: 'REST',
        scaling: 'Horizontal',
        estimatedLoad: '100 req/s',
      },
    ];
  }
}

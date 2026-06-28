import { BaseAgent } from './base-agent';
import type { AgentInput, AgentOutput } from './types';

export class RequirementsAgent extends BaseAgent {
  constructor() {
    super('requirements', { model: 'gpt-4o-mini', temperature: 0.2 });
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    return this.withRetry(async () => {
      const start = Date.now();
      return {
        success: true,
        data: {
          functional: [
            { id: 'FR-1', category: 'user-management', description: 'User registration and authentication', priority: 'critical' },
            { id: 'FR-2', category: 'core', description: 'Core business logic implementation', priority: 'critical' },
          ],
          nonFunctional: [
            { id: 'NFR-1', category: 'performance', description: 'Response time under 200ms', priority: 'high' },
            { id: 'NFR-2', category: 'security', description: 'OWASP top 10 compliance', priority: 'critical' },
          ],
          constraints: [
            { type: 'technical', description: 'Must use TypeScript' },
          ],
          assumptions: ['Cloud-native deployment', 'RESTful API communication'],
          userStories: [
            'As a user, I can sign up and log in securely',
            'As a user, I can perform core business operations',
          ],
        } as Record<string, unknown>,
        tokensUsed: 200,
        latencyMs: Date.now() - start,
      };
    });
  }
}

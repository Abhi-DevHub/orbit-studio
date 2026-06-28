import { BaseAgent } from './base-agent';
import type { AgentInput, AgentOutput } from './types';

export class PlannerAgent extends BaseAgent {
  constructor() {
    super('planner', { model: 'gpt-4o-mini', temperature: 0.3 });
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    return this.withRetry(async () => {
      const start = Date.now();

      // In production, call LLM. For now, return structured output.
      const data = {
        projectName: this.extractName(input.prompt || ''),
        projectDescription: input.prompt || '',
        scope: {
          complexity: this.estimateComplexity(input.prompt || ''),
          estimatedServices: this.estimateServices(input.prompt || ''),
          estimatedMonths: 3,
          teamSize: 2,
        },
        architecture: {
          pattern: this.detectPattern(input.prompt || ''),
          reasoning: 'Based on the requirements analysis and industry best practices',
        },
        keyFeatures: this.extractFeatures(input.prompt || ''),
        targetUsers: 'End users',
        growthPlan: 'Start with MVP, iterate based on feedback',
      } as Record<string, unknown>;

      return {
        success: true,
        data,
        tokensUsed: 150,
        latencyMs: Date.now() - start,
      };
    });
  }

  private extractName(prompt: string): string {
    const words = prompt.split(' ').slice(0, 4);
    return words.join(' ') || 'Untitled Project';
  }

  private estimateComplexity(prompt: string): 'simple' | 'moderate' | 'complex' {
    const length = prompt.length;
    if (length < 50) return 'simple';
    if (length < 200) return 'moderate';
    return 'complex';
  }

  private estimateServices(prompt: string): number {
    const serviceKeywords = ['microservice', 'api', 'service', 'backend', 'database', 'queue', 'cache'];
    return serviceKeywords.filter((k) => prompt.toLowerCase().includes(k)).length || 3;
  }

  private detectPattern(prompt: string): string {
    const patterns = [
      { keywords: ['microservice', 'distributed'], pattern: 'microservices' },
      { keywords: ['serverless', 'lambda'], pattern: 'serverless' },
      { keywords: ['event', 'kafka', 'queue'], pattern: 'event-driven' },
      { keywords: ['monolith', 'simple'], pattern: 'monolith' },
    ];
    const matched = patterns.find((p) => p.keywords.some((k) => prompt.toLowerCase().includes(k)));
    return matched?.pattern || 'microservices';
  }

  private extractFeatures(prompt: string): string[] {
    const featureIndicators = ['with', 'including', 'support', 'features', 'ability to'];
    const words = prompt.toLowerCase().split(' ');
    const features = words.filter(
      (w, i) => featureIndicators.includes(w) && i + 1 < words.length,
    ).flatMap((_, i) => words[i + 1] ? [words[i + 1]!] : []);
    return features.length > 0 ? features : ['Core functionality'];
  }
}

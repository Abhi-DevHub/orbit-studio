import type { AgentConfig, AgentInput, AgentOutput, AgentType } from './types';

export abstract class BaseAgent {
  public readonly type: AgentType;
  protected config: AgentConfig;

  constructor(type: AgentType, config?: Partial<AgentConfig>) {
    this.type = type;
    this.config = {
      type,
      model: config?.model ?? 'gpt-4o',
      temperature: config?.temperature ?? 0.3,
      maxTokens: config?.maxTokens ?? 2000,
      retryCount: config?.retryCount ?? 3,
      timeoutMs: config?.timeoutMs ?? 30000,
    };
  }

  abstract execute(input: AgentInput): Promise<AgentOutput>;

  protected async withRetry(
    fn: () => Promise<AgentOutput>,
    retries: number = this.config.retryCount,
  ): Promise<AgentOutput> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === retries - 1) throw error;
        await this.sleep(Math.pow(2, attempt) * 1000);
      }
    }
    throw new Error('Max retries exceeded');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

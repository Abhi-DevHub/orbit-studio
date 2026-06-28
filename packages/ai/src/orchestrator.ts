import { AgentPipeline } from './agent-pipeline';
import { CanvasRenderer } from './canvas-renderer';
import type { AgentResult } from '@orbit/config';

export interface OrchestratorInput {
  userId: string;
  projectId: string;
  prompt: string;
  existingNodes?: any[];
  existingEdges?: any[];
}

export class Orchestrator {
  private pipeline: AgentPipeline;

  constructor() {
    this.pipeline = new AgentPipeline();
  }

  async run(input: OrchestratorInput): Promise<AgentResult> {
    const agentResults = await this.pipeline.execute({
      userId: input.userId,
      projectId: input.projectId,
      prompt: input.prompt,
      existingNodes: input.existingNodes,
      existingEdges: input.existingEdges,
    });

    const renderer = new CanvasRenderer();
    const canvasOutput = renderer.render(agentResults);

    const totalTokens = agentResults.reduce((sum, r) => sum + r.tokensUsed, 0);

    return {
      nodes: canvasOutput.nodes,
      edges: canvasOutput.edges,
      explanation: this.buildExplanation(agentResults),
      decisions: agentResults
        .filter((r) => r.data.decisions)
        .flatMap((r) => r.data.decisions as any[]),
      totalTokens,
    };
  }

  private buildExplanation(results: any[]): string {
    const architectResult = results.find((r) => r.data?.services);
    if (!architectResult) return 'Architecture generated successfully.';

    const services = architectResult.data.services as any[] || [];
    return `Generated ${services.length} services with a ${architectResult.data.architecture?.pattern || 'microservices'} architecture pattern.`;
  }
}

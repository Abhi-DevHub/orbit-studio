import {
  PlannerAgent,
  RequirementsAgent,
  ArchitectAgent,
  DatabaseAgent,
  ApiAgent,
  InfrastructureAgent,
  SecurityAgent,
  ReviewerAgent,
  type AgentOutput,
  type AgentContext,
} from '@orbit/agents';

export class AgentPipeline {
  private agents = {
    planner: new PlannerAgent(),
    requirements: new RequirementsAgent(),
    architect: new ArchitectAgent(),
    database: new DatabaseAgent(),
    api: new ApiAgent(),
    infrastructure: new InfrastructureAgent(),
    security: new SecurityAgent(),
    reviewer: new ReviewerAgent(),
  };

  async execute(context: AgentContext): Promise<AgentOutput[]> {
    const results: AgentOutput[] = [];

    // Phase 1: Planning (sequential)
    const plannerResult = await this.agents.planner.execute({ prompt: context.prompt });
    results.push(plannerResult);

    const requirementsResult = await this.agents.requirements.execute({
      prompt: context.prompt,
      plannerOutput: plannerResult.data,
    });
    results.push(requirementsResult);

    // Phase 2: Architecture (parallel-ready)
    const architectResult = await this.agents.architect.execute({
      prompt: context.prompt,
      plannerOutput: plannerResult.data,
      requirements: requirementsResult.data,
    });
    results.push(architectResult);

    // Phase 3: Specialized agents (can run in parallel)
    const [dbResult, apiResult, infraResult] = await Promise.all([
      this.agents.database.execute({ architectOutput: architectResult.data }),
      this.agents.api.execute({ architectOutput: architectResult.data }),
      this.agents.infrastructure.execute({ architectOutput: architectResult.data }),
    ]);
    results.push(dbResult, apiResult, infraResult);

    // Phase 4: Security review
    const securityResult = await this.agents.security.execute({
      architectOutput: architectResult.data,
      databaseOutput: dbResult.data,
      apiOutput: apiResult.data,
      infrastructureOutput: infraResult.data,
    });
    results.push(securityResult);

    // Phase 5: Final review
    const reviewResult = await this.agents.reviewer.execute({
      plannerOutput: plannerResult.data,
      requirements: requirementsResult.data,
      architectOutput: architectResult.data,
      databaseOutput: dbResult.data,
      apiOutput: apiResult.data,
      infrastructureOutput: infraResult.data,
      securityOutput: securityResult.data,
    });
    results.push(reviewResult);

    return results;
  }
}

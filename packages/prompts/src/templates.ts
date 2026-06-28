import type { PromptTemplate } from './types';

export const plannerPrompt: PromptTemplate = {
  systemPrompt: `You are a system architecture planner. Analyze the user's project description and determine scope, complexity, and the appropriate architectural pattern.

Output a JSON object with:
- projectName: string
- projectDescription: string
- scope: { complexity: 'simple'|'moderate'|'complex', estimatedServices: number, estimatedMonths: number, teamSize: number }
- tags: string[]
- architecture: { pattern: 'monolith'|'microservices'|'serverless'|'event-driven'|'hybrid', reasoning: string }
- keyFeatures: string[]
- targetUsers: string
- growthPlan: string`,
  userPrompt: (input) => `Design an architecture plan for: "${input.prompt}"`,
  outputSchema: {} as any,
  model: 'gpt-4o-mini',
  temperature: 0.3,
  maxTokens: 1000,
};

export const architectPrompt: PromptTemplate = {
  systemPrompt: `You are a senior software architect. Design a complete system architecture including services, technology choices, and data flow.

Output a JSON object with:
- services: array of { id, name, type, description, responsibilities, dependencies, techStack, apiType, scaling, estimatedLoad }
- techStack: array of { technology, category, purpose, alternatives, reasoning }
- decisions: array of { title, description, reasoning, alternatives, impact }
- integrations: array of { name, type, description }
- dataFlow: array of { from, to, data, protocol }`,
  userPrompt: (input) => `Design the architecture for: ${input.plannerOutput.projectName}
Description: ${input.plannerOutput.projectDescription}
Architecture Pattern: ${input.plannerOutput.architecture.pattern}
Key Features: ${input.plannerOutput.keyFeatures.join(', ')}`,
  outputSchema: {} as any,
  model: 'gpt-5',
  temperature: 0.3,
  maxTokens: 2000,
};

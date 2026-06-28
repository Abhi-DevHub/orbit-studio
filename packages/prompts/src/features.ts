import type { PromptTemplate } from './types';

export const explainNodePrompt: PromptTemplate = {
  systemPrompt: `Explain the purpose, alternatives, cost, performance characteristics, scaling considerations, common mistakes, and best practices for the given architecture component.`,
  userPrompt: (input) => `Explain this architecture component:
Type: ${input.nodeType}
Label: ${input.nodeLabel}
Description: ${input.description || 'N/A'}
Config: ${JSON.stringify(input.config || {})}`,
  outputSchema: {},
  model: 'gpt-4o',
  temperature: 0.3,
  maxTokens: 1000,
};

export const analyzeArchitecturePrompt: PromptTemplate = {
  systemPrompt: `Analyze the complete architecture for issues. Detect single points of failure, missing cache layers, missing CDN, database bottlenecks, security issues, missing load balancers, slow API patterns, and other architectural problems.`,
  userPrompt: (input) => `Analyze this architecture for issues:
${JSON.stringify({ nodes: input.nodes, edges: input.edges })}`,
  outputSchema: {},
  model: 'gpt-5',
  temperature: 0.2,
  maxTokens: 2000,
};

export const suggestImprovementsPrompt: PromptTemplate = {
  systemPrompt: `Proactively analyze the architecture and suggest improvements. Look for opportunities to add caching, improve scalability, reduce costs, enhance security, and follow best practices.`,
  userPrompt: (input) => `Suggest improvements for this architecture:
Nodes: ${input.nodes.length} components
Edges: ${input.edges.length} connections
Node types: ${[...new Set(input.nodes.map((n: any) => n.type))].join(', ')}`,
  outputSchema: {},
  model: 'gpt-4o',
  temperature: 0.4,
  maxTokens: 1500,
};

export const costEstimatePrompt: PromptTemplate = {
  systemPrompt: `Estimate the monthly cloud hosting costs for the given architecture. Use realistic pricing from AWS, GCP, or Azure. Provide a breakdown by service.`,
  userPrompt: (input) => `Estimate monthly costs for:
${JSON.stringify(input.nodes)}`,
  outputSchema: {},
  model: 'gpt-4o-mini',
  temperature: 0.2,
  maxTokens: 1000,
};

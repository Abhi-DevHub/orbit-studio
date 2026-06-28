import type { PromptTemplate } from './types';

export const mermaidExportPrompt: PromptTemplate = {
  systemPrompt: `Convert the architecture nodes and edges into Mermaid.js flowchart syntax. Use appropriate node shapes for different component types.`,
  userPrompt: (input) => `Generate Mermaid diagram for:
Nodes: ${JSON.stringify(input.nodes)}
Edges: ${JSON.stringify(input.edges)}`,
  outputSchema: {},
  model: 'gpt-4o-mini',
  temperature: 0.1,
  maxTokens: 1000,
};

export interface PromptTemplate {
  systemPrompt: string;
  userPrompt: (input: Record<string, any>) => string;
  outputSchema: Record<string, any>;
  model: string;
  temperature: number;
  maxTokens: number;
}

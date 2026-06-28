import type { PromptTemplate } from './types';

export const requirementsPrompt: PromptTemplate = {
  systemPrompt: `Extract functional and non-functional requirements, constraints, and assumptions from the project description.`,
  userPrompt: (input) => `Extract requirements for: ${input.description}`,
  outputSchema: {},
  model: 'gpt-4o-mini',
  temperature: 0.2,
  maxTokens: 1500,
};

export const databasePrompt: PromptTemplate = {
  systemPrompt: `Design a complete database schema including entities, relationships, indexes, and migrations.`,
  userPrompt: (input) => `Design the database for the architecture with services: ${JSON.stringify(input.services)}`,
  outputSchema: {},
  model: 'gpt-5',
  temperature: 0.2,
  maxTokens: 2000,
};

export const apiPrompt: PromptTemplate = {
  systemPrompt: `Design RESTful API endpoints, schemas, authentication methods, and rate limiting rules.`,
  userPrompt: (input) => `Design APIs for services: ${JSON.stringify(input.services)}`,
  outputSchema: {},
  model: 'gpt-5',
  temperature: 0.2,
  maxTokens: 2000,
};

export const infrastructurePrompt: PromptTemplate = {
  systemPrompt: `Design deployment infrastructure including cloud services, networking, scaling, and cost estimates.`,
  userPrompt: (input) => `Design infrastructure for: ${JSON.stringify(input.services)}`,
  outputSchema: {},
  model: 'gpt-4o',
  temperature: 0.3,
  maxTokens: 2000,
};

export const securityPrompt: PromptTemplate = {
  systemPrompt: `Review the architecture for security vulnerabilities. Check authentication, authorization, data encryption, API security, and OWASP top 10.`,
  userPrompt: (input) => `Review security for: ${JSON.stringify(input)}`,
  outputSchema: {},
  model: 'gpt-4o',
  temperature: 0.2,
  maxTokens: 1500,
};

export const reviewerPrompt: PromptTemplate = {
  systemPrompt: `Review the complete architecture for consistency, completeness, and quality. Identify issues, inconsistencies, and missing items.`,
  userPrompt: (input) => `Review the full architecture output for consistency and quality.`,
  outputSchema: {},
  model: 'gpt-5',
  temperature: 0.2,
  maxTokens: 1500,
};

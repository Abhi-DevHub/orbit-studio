# Orbit Studio — AI Multi-Agent Architecture Specification

## Version 1.0

---

## 1. Agent System Overview

Orbit Studio uses a pipeline of specialized AI agents. Each agent has:
- A specific role and responsibility
- Structured input/output schemas
- Access to previous agent outputs
- Error handling and retry logic

## 2. Agent Pipeline

```
User Prompt
    │
    ▼
┌──────────────┐
│  Orchestrator│  ← Coordinates all agents, manages flow
│    Agent     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Planner    │  ← Analyzes prompt, determines scope
│    Agent     │    Output: { scope, complexity, plan }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Requirements│  ← Extracts requirements, constraints
│    Agent     │    Output: { functional, nonFunctional,
│              │      constraints, assumptions }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Architect   │  ← Designs system, selects stack
│    Agent     │    Output: { services, techStack,
│              │      decisions, integrations }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Database    │  ← Designs data model
│    Agent     │    Output: { entities, relationships,
│              │      indexes, migrations }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│     API      │  ← Designs API contracts
│    Agent     │    Output: { endpoints, schemas,
│              │      routes, auth }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│Infrastructure│  ← Designs deployment
│    Agent     │    Output: { services, networking,
│              │      scaling, cost }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Security   │  ← Reviews for vulnerabilities
│    Agent     │    Output: { vulnerabilities, score,
│              │      recommendations }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Reviewer    │  ← Validates entire output
│    Agent     │    Output: { score, issues,
│              │      inconsistencies }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Canvas    │  ← Renders to canvas nodes
│   Renderer   │    Output: { nodes, edges }
└──────────────┘
```

## 3. Agent Definitions

### 3.1 Orchestrator Agent

```typescript
interface OrchestratorInput {
  userId: string;
  projectId: string;
  prompt: string;
  existingContext?: {
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
  };
}

interface OrchestratorOutput {
  pipeline: AgentPipelineStep[];
  estimatedTokens: number;
  estimatedTime: number; // seconds
}

type AgentPipelineStep = {
  agent: AgentType;
  input: Record<string, any>;
  priority: number;
  parallel: boolean; // can run in parallel with other steps
};
```

### 3.2 Planner Agent

```typescript
interface PlannerInput {
  prompt: string;
}

interface PlannerOutput {
  projectName: string;
  projectDescription: string;
  scope: {
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedServices: number;
    estimatedMonths: number;
    teamSize: number;
  };
  tags: string[];
  architecture: {
    pattern: 'monolith' | 'microservices' | 'serverless' | 'event-driven' | 'hybrid';
    reasoning: string;
  };
  keyFeatures: string[];
  targetUsers: string;
  growthPlan: string;
}
```

### 3.3 Requirements Agent

```typescript
interface RequirementsInput {
  prompt: string;
  plannerOutput: PlannerOutput;
}

interface RequirementsOutput {
  functional: Requirement[];
  nonFunctional: Requirement[];
  constraints: Constraint[];
  assumptions: string[];
  userStories: UserStory[];
}

interface Requirement {
  id: string;
  category: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface Constraint {
  type: 'technical' | 'business' | 'regulatory' | 'time';
  description: string;
}
```

### 3.4 Architect Agent

```typescript
interface ArchitectInput {
  prompt: string;
  plannerOutput: PlannerOutput;
  requirements: RequirementsOutput;
}

interface ArchitectOutput {
  services: Service[];
  techStack: TechChoice[];
  decisions: ArchitectureDecision[];
  integrations: Integration[];
  dataFlow: DataFlow[];
}

interface Service {
  id: string;
  name: string;
  type: ArchitectureNode['type'];
  description: string;
  responsibilities: string[];
  dependencies: string[];
  techStack: string[];
  apiType: 'REST' | 'GraphQL' | 'gRPC' | 'WebSocket' | 'Event';
  scaling: string;
  estimatedLoad: string;
}

interface TechChoice {
  technology: string;
  category: string;
  purpose: string;
  alternatives: string[];
  reasoning: string;
  version?: string;
}
```

### 3.5 Database Agent

```typescript
interface DatabaseInput {
  architectOutput: ArchitectOutput;
}

interface DatabaseOutput {
  entities: Entity[];
  relationships: Relationship[];
  indexes: Index[];
  migrations: MigrationStep[];
  prismaSchema: string;
  recommendations: string[];
}

interface Entity {
  name: string;
  description: string;
  fields: Field[];
  relations: string[];
  estimatedSize: string;
}

interface Field {
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
  default?: any;
  relation?: { entity: string; type: '1:1' | '1:N' | 'N:M' };
}
```

### 3.6 API Agent

```typescript
interface APIInput {
  architectOutput: ArchitectOutput;
  databaseOutput: DatabaseOutput;
}

interface APIOutput {
  endpoints: APIEndpoint[];
  schemas: APISchema[];
  authMethods: AuthMethod[];
  rateLimiting: RateLimitRule[];
  webhooks: Webhook[];
  openapiSpec: string;
}

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  auth: boolean;
  requestBody?: string;
  responseType: string;
  errorCodes: number[];
}
```

### 3.7 Infrastructure Agent

```typescript
interface InfrastructureInput {
  architectOutput: ArchitectOutput;
  databaseOutput: DatabaseOutput;
  apiOutput: APIOutput;
}

interface InfrastructureOutput {
  services: InfrastructureService[];
  networking: NetworkingConfig;
  scaling: ScalingPlan;
  costEstimate: CostEstimate;
  terraformConfig: string;
  dockerCompose: string;
  kubernetesConfig: string;
}

interface InfrastructureService {
  provider: string;
  service: string;
  tier: string;
  estimatedCost: number;
  region: string;
  config: Record<string, any>;
}
```

### 3.8 Security Agent

```typescript
interface SecurityInput {
  architectOutput: ArchitectOutput;
  databaseOutput: DatabaseOutput;
  apiOutput: APIOutput;
  infrastructureOutput: InfrastructureOutput;
}

interface SecurityOutput {
  score: number; // 0-100
  vulnerabilities: Vulnerability[];
  recommendations: SecurityRecommendation[];
  compliance: Compliance[];
  authAnalysis: AuthAnalysis;
}

interface Vulnerability {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  affectedComponent: string;
  remediation: string;
}
```

### 3.9 Reviewer Agent

```typescript
interface ReviewerInput {
  plannerOutput: PlannerOutput;
  requirements: RequirementsOutput;
  architectOutput: ArchitectOutput;
  databaseOutput: DatabaseOutput;
  apiOutput: APIOutput;
  infrastructureOutput: InfrastructureOutput;
  securityOutput: SecurityOutput;
}

interface ReviewerOutput {
  overallScore: number;
  consistencyScore: number;
  completenessScore: number;
  issues: ReviewIssue[];
  inconsistencies: string[];
  missingItems: string[];
  finalRecommendations: string[];
  summary: string;
}

interface ReviewIssue {
  severity: 'blocker' | 'major' | 'minor';
  area: string;
  description: string;
  suggestion: string;
}
```

## 4. Prompt Template System

Each agent uses structured prompt templates stored in `packages/prompts/`.

```
packages/prompts/
├── agents/
│   ├── planner.ts
│   ├── requirements.ts
│   ├── architect.ts
│   ├── database.ts
│   ├── api.ts
│   ├── infrastructure.ts
│   ├── security.ts
│   └── reviewer.ts
├── features/
│   ├── explain-node.ts
│   ├── analyze-architecture.ts
│   ├── suggest-improvements.ts
│   └── cost-estimate.ts
├── exports/
│   ├── mermaid.ts
│   ├── documentation.ts
│   └── terraform.ts
└── templates/
    ├── system-prompt.ts
    └── output-format.ts
```

### 4.1 Prompt Template Structure

```typescript
interface PromptTemplate {
  systemPrompt: string;
  userPrompt: (input: Record<string, any>) => string;
  outputSchema: JSONSchema;
  model: 'gpt-5' | 'gemini-2.5' | 'claude-4' | 'auto';
  temperature: number;
  maxTokens: number;
}
```

## 5. LLM Configuration

```typescript
interface LLMConfig {
  // Default models for each agent
  agents: Record<AgentType, {
    provider: 'openai' | 'google' | 'anthropic' | 'litellm';
    model: string;
    temperature: number;
    maxTokens: number;
  }>;
  
  // Fallback chain
  fallbacks: Record<AgentType, string[]>; // model names in order
  
  // Cost optimization
  caching: boolean;
  cacheTTL: number; // seconds
  
  // Rate limiting
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}
```

## 6. Error Handling

```typescript
interface AgentError {
  agent: AgentType;
  errorType: 'model_error' | 'timeout' | 'validation' | 'rate_limit';
  message: string;
  retryCount: number;
  fallbackUsed?: string;
}

// Retry strategy
const RETRY_CONFIG = {
  maxRetries: 3,
  backoffMs: 1000,
  backoffMultiplier: 2,
  timeoutMs: 30000,
};
```

## 7. Cost Optimization

- Cache identical requests (hash of input)
- Use smaller models for simple agents (Planner → GPT-4o-mini, Architect → GPT-5)
- Batch parallel agent calls
- Stream responses when possible
- Token budget per pipeline run

# Orbit Studio — API Specification

## Version 1.0 — tRPC API

---

## 1. Overview

Orbit Studio uses tRPC for type-safe API communication between frontend and backend. All API routes are defined in the Next.js application under `apps/web/src/server/api/`.

## 2. Router Structure

```
api/
├── routers/
│   ├── auth.router.ts        # Authentication
│   ├── project.router.ts     # Project CRUD
│   ├── canvas.router.ts      # Canvas operations
│   ├── ai.router.ts          # AI Agent pipeline
│   ├── documentation.router.ts
│   ├── template.router.ts
│   ├── export.router.ts
│   ├── collaboration.router.ts
│   ├── snapshot.router.ts    # Version history
│   └── user.router.ts
│
├── trpc.ts                   # tRPC setup
├── context.ts                # Request context
└── middleware.ts              # Auth middleware
```

## 3. API Routes

### 3.1 Auth Router

```typescript
auth.signUp(input: { email: string, password: string, name?: string }) → User
auth.signIn(input: { email: string, password: string }) → { session, user }
auth.signOut() → void
auth.getSession() → Session | null
auth.signInWithGithub() → { url: string }
auth.signInWithGoogle() → { url: string }
auth.callback(input: { provider: string, code: string }) → { session, user }
```

### 3.2 User Router

```typescript
user.me() → User
user.update(input: { name?: string, avatarUrl?: string }) → User
user.deleteAccount() → void
```

### 3.3 Project Router

```typescript
project.list() → Project[]
project.getById(input: { id: string }) → Project
project.create(input: { name: string, description?: string, templateId?: string }) → Project
project.update(input: { id: string, name?: string, description?: string }) → Project
project.delete(input: { id: string }) → void
project.duplicate(input: { id: string, name?: string }) → Project
```

### 3.4 Canvas Router

```typescript
canvas.getState(input: { projectId: string }) → CanvasState
canvas.saveState(input: {
  projectId: string,
  nodes: Node[],
  edges: Edge[],
  viewport?: Viewport
}) → CanvasState
canvas.getVersions(input: { projectId: string }) → { version: number, createdAt: Date }[]
canvas.restoreVersion(input: { projectId: string, version: number }) → CanvasState
```

### 3.5 AI Router

```typescript
ai.generateArchitecture(input: {
  projectId: string,
  prompt: string,
  existingNodes?: Node[],
  existingEdges?: Edge[]
}) → {
  nodes: Node[],
  edges: Edge[],
  explanation: string,
  decisions: ArchitectureDecision[]
}

ai.chat(input: {
  projectId: string,
  conversationId: string,
  message: string,
  canvasContext: { nodes: Node[], edges: Edge[] }
}) → {
  response: string,
  canvasUpdates?: { nodes?: Node[], edges?: Edge[] },
  actions?: CanvasAction[]
}

ai.explain(input: {
  nodeId: string,
  projectId: string
}) → {
  purpose: string,
  alternatives: string[],
  costEstimate: CostEstimate,
  bestPractices: string[],
  commonMistakes: string[],
  scaling: string
}

ai.analyze(input: {
  projectId: string,
  nodes: Node[],
  edges: Edge[]
}) → {
  issues: ArchitectureIssue[],
  improvements: Suggestion[],
  costEstimate: CostEstimate,
  securityScore: number,
  performanceScore: number,
  recommendations: string[]
}

ai.suggest(input: {
  projectId: string,
  nodes: Node[],
  edges: Edge[]
}) → {
  suggestions: ProactiveSuggestion[]
}
```

### 3.6 Documentation Router

```typescript
documentation.generate(input: {
  projectId: string,
  nodes: Node[],
  edges: Edge[],
  format: 'markdown' | 'html' | 'pdf'
}) → { content: string, filename: string }

documentation.generateApiSpec(input: {
  projectId: string,
  nodes: Node[],
  edges: Edge[]
}) → { openapi: string, swagger: string }

documentation.generateDatabaseSchema(input: {
  projectId: string,
  nodes: Node[],
  edges: Edge[]
}) → { prisma: string, sql: string, migrations: string }
```

### 3.7 Export Router

```typescript
export.toMermaid(input: { nodes: Node[], edges: Edge[] }) → { content: string }
export.toPlantUml(input: { nodes: Node[], edges: Edge[] }) → { content: string }
export.toDrawio(input: { nodes: Node[], edges: Edge[] }) → { xml: string }
export.toImage(input: {
  nodes: Node[], edges: Edge[],
  format: 'png' | 'svg' | 'pdf'
}) → { url: string }
export.toTerraform(input: { nodes: Node[], edges: Edge[] }) → { content: string }
export.toDockerCompose(input: { nodes: Node[], edges: Edge[] }) → { content: string }
```

### 3.8 Template Router

```typescript
template.list(input: { category?: string }) → Template[]
template.getById(input: { id: string }) → Template
template.create(input: {
  name: string, description: string,
  category: string, nodes: Node[], edges: Edge[]
}) → Template
template.apply(input: { templateId: string, projectId: string }) → CanvasState
```

### 3.9 Snapshot Router (Version History)

```typescript
snapshot.list(input: { projectId: string }) → Snapshot[]
snapshot.create(input: { projectId: string, message?: string }) → Snapshot
snapshot.restore(input: { snapshotId: string }) → CanvasState
snapshot.diff(input: { snapshotId1: string, snapshotId2: string }) → { added: Node[], removed: Node[], modified: Node[] }
```

## 4. Shared Types

```typescript
// Node Types
type NodeType =
  | 'frontend' | 'backend' | 'database' | 'api' | 'gateway'
  | 'auth' | 'cache' | 'queue' | 'worker' | 'storage'
  | 'cdn' | 'lambda' | 'kubernetes' | 'docker' | 'cloud'
  | 'ai-model' | 'monitoring' | 'secrets' | 'webhook'
  | 'third-party' | 'custom';

interface ArchitectureNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    icon?: string;
    config?: Record<string, any>;
    metadata?: {
      cost?: number;
      provider?: string;
      version?: string;
      status?: 'planned' | 'active' | 'deprecated';
    };
  };
}

interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'smoothstep' | 'straight';
  label?: string;
  data?: {
    protocol?: string;
    port?: number;
    description?: string;
  };
}

interface ArchitectureDecision {
  title: string;
  description: string;
  reasoning: string;
  alternatives: string[];
  impact: 'high' | 'medium' | 'low';
}

interface ArchitectureIssue {
  severity: 'critical' | 'warning' | 'info';
  type: 'security' | 'performance' | 'reliability' | 'cost' | 'best-practice';
  title: string;
  description: string;
  suggestion: string;
  relatedNodeIds?: string[];
}

interface CostEstimate {
  total: number;
  breakdown: { service: string; cost: number; unit: string }[];
  currency: string;
  period: 'monthly' | 'yearly';
}
```

## 5. Error Handling

```typescript
interface ApiError {
  code: 'BAD_REQUEST' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'RATE_LIMITED'
      | 'AI_ERROR' | 'INTERNAL_ERROR' | 'VALIDATION_ERROR';
  message: string;
  details?: Record<string, string[]>;
}
```

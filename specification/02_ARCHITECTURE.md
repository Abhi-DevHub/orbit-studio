# Orbit Studio — System Architecture Specification

## Version 1.0

---

## 1. High-Level Architecture

```
                     Browser
                        │
                 HTTPS/WSS
                        │
              ┌─────────┴─────────┐
              │   Next.js 15 App  │
              │  (apps/web)       │
              │                   │
              │  React 19 +       │
              │  Tailwind +       │
              │  React Flow       │
              └─────────┬─────────┘
                        │
              ┌─────────┴─────────┐
              │   API Routes      │
              │   tRPC Router     │
              └─────────┬─────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
  ┌─────┴─────┐   ┌────┴────┐   ┌──────┴──────┐
  │   Auth    │   │   AI    │   │   Project   │
  │  (Better  │   │ Gateway │   │   Service   │
  │   Auth)   │   │         │   │             │
  └───────────┘   └────┬────┘   └──────┬──────┘
                        │               │
                 ┌──────┴──────┐   ┌────┴────┐
                 │ Multi-Agent │   │ Prisma  │
                 │  Pipeline   │   │   ORM   │
                 └──────┬──────┘   └────┬────┘
                        │               │
                 ┌──────┴──────┐   ┌────┴────┐
                 │  LLM(s)    │   │PostgreSQL│
                 │ GPT-5      │   └─────────┘
                 │ Gemini 2.5 │
                 │ Claude     │   ┌─────────┐
                 │ LiteLLM    │   │  Redis  │
                 └────────────┘   └─────────┘

  ┌─────────────────────────────────────────────┐
  │          Trigger.dev Background Jobs         │
  │  (Documentation gen, Export, Cost analysis)  │
  └─────────────────────────────────────────────┘
```

## 2. Directory Structure

```
orbit-studio/
├── apps/
│   └── web/                          # Next.js 15 application
│       ├── src/
│       │   ├── app/                  # App Router pages
│       │   ├── components/           # React components
│       │   ├── hooks/               # Custom hooks
│       │   ├── lib/                 # Utilities
│       │   ├── providers/           # Context providers
│       │   ├── server/              # Server-only code (tRPC, actions)
│       │   └── styles/              # Global styles
│       ├── public/                  # Static assets
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── ui/                          # Shared UI components (shadcn/ui)
│   ├── ai/                          # AI agent orchestrator
│   ├── agents/                      # Individual agent implementations
│   ├── prompts/                     # Prompt templates
│   ├── config/                      # Shared configuration
│   ├── database/                    # Prisma schema + client
│   ├── canvas/                      # Canvas node types and utilities
│   ├── sdk/                         # Public API SDK
│   └── auth/                        # Authentication utilities
│
├── services/
│   ├── worker/                      # Trigger.dev workers
│   └── api/                         # Standalone API (future)
│
├── docker/
│   ├── docker-compose.yml           # Local infrastructure
│   ├── Dockerfile.web
│   └── Dockerfile.worker
│
├── specification/                   # PRD, Architecture, API docs
├── prompts/                         # Implementation prompts for AI coding
├── docs/                            # Generated documentation
├── scripts/                         # Development scripts
│
├── package.json                     # Root workspace config
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
└── .gitignore
```

## 3. Package Dependency Graph

```
apps/web
  ├── @orbit/ui          (UI components)
  ├── @orbit/ai          (AI orchestration)
  ├── @orbit/canvas      (Canvas nodes & flow)
  ├── @orbit/database    (Prisma client)
  ├── @orbit/auth        (Auth helpers)
  └── @orbit/config      (Shared config)
       │
packages/ai
  ├── @orbit/agents      (Individual agent implementations)
  ├── @orbit/prompts     (Prompt templates)
  └── @orbit/config
       │
packages/agents
  └── @orbit/prompts
       │
packages/database
  └── Prisma schema + migrations
```

## 4. Data Flow

### 4.1 Architecture Generation Flow
```
User Input: "Build a healthcare SaaS platform"
       │
       ▼
Planner Agent
  - Analyzes requirements
  - Determines scope and complexity
  - Creates generation plan
       │
       ▼
Requirements Agent
  - Extracts functional requirements
  - Identifies system constraints
  - Generates requirement spec
       │
       ▼
Architecture Agent
  - Designs system architecture
  - Selects technology stack
  - Creates component breakdown
  - Defines service boundaries
       │
       ▼
Database Agent
  - Designs data model
  - Identifies entities and relationships
  - Generates ER diagram data
       │
       ▼
Infrastructure Agent
  - Designs deployment architecture
  - Selects cloud services
  - Generates infrastructure plan
       │
       ▼
Security Agent
  - Reviews for vulnerabilities
  - Ensures authentication/authorization
  - Checks OWASP compliance
       │
       ▼
Reviewer Agent
  - Validates entire architecture
  - Checks for consistency
  - Provides recommendations
       │
       ▼
Canvas Renderer
  - Converts structured JSON to canvas nodes
  - Positions nodes intelligently
  - Renders on infinite canvas
```

### 4.2 Real-time Collaboration Flow
```
User A edits node position
       │
       ▼
Yjs Document Update
       │
       ▼
Liveblocks Broadcast
       │
       ├──► User B receives update
       │       │
       │       ▼
       │   Canvas re-renders
       │
       ├──► Redis persists state
       │
       └──► PostgreSQL snapshots (every 30s)
```

## 5. Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 (App Router) | Full-stack React, server components, API routes |
| Language | TypeScript | Type safety across full stack |
| Styling | Tailwind CSS v4 | Utility-first, rapid prototyping |
| UI Library | shadcn/ui | Customizable, accessible components |
| State | Zustand | Lightweight, TypeScript-first state management |
| Server State | TanStack Query | Caching, deduplication, optimistic updates |
| Forms | React Hook Form + Zod | Type-safe form validation |
| Animation | Framer Motion | Declarative animations |
| Canvas | React Flow v12 | Production-grade node-based UI |
| Database ORM | Prisma | Type-safe queries, migrations |
| Database | PostgreSQL | Reliability, features, ecosystem |
| Cache | Redis | Session, rate limiting, pub/sub |
| Auth | Better Auth | Type-safe, session-based auth |
| AI SDK | Vercel AI SDK | Streaming, tool calling, multi-provider |
| AI Gateway | LiteLLM | Unified API for GPT, Gemini, Claude |
| Real-time | Liveblocks + Yjs | CRDT-based collaboration |
| Background Jobs | Trigger.dev | Type-safe job queues |
| Package Manager | pnpm | Fast, disk-efficient monorepo |
| Build System | Turborepo | Parallel builds, caching |
| Storage | S3-compatible (MinIO local) | Exports, assets, snapshots |

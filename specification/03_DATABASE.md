# Orbit Studio — Database Design Specification

## Version 1.0

---

## 1. Overview

PostgreSQL with Prisma ORM. Redis for caching, sessions, and real-time state.

## 2. Entity Relationship Diagram

```
┌─────────────────┐       ┌──────────────────┐
│      User       │       │     Project      │
│─────────────────│       │──────────────────│
│ id              │──┐    │ id               │
│ email           │  │    │ name             │
│ name            │  │    │ description      │
│ avatarUrl       │  │    │ templateId       │
│ githubId        │  ├───>│ userId           │
│ googleId        │  │    │ createdAt        │
│ createdAt       │  │    │ updatedAt        │
└─────────────────┘  │    └────────┬─────────┘
                      │            │
┌─────────────────┐   │    ┌───────┴─────────┐
│     Session     │   │    │   CanvasState   │
│─────────────────│   │    │─────────────────│
│ id              │   │    │ id              │
│ userId          │───┘    │ projectId       │
│ expiresAt       │        │ nodes (JSONB)   │
│ data (JSONB)    │        │ edges (JSONB)   │
└─────────────────┘        │ viewport (JSONB)│
                           │ version         │
┌─────────────────┐        │ snapshotId      │
│  Collaboration  │        │ createdAt       │
│─────────────────│        │ updatedAt       │
│ id              │        └─────────────────┘
│ projectId       │
│ userId          │        ┌─────────────────┐
│ document (Yjs)  │        │   Snapshot      │
│ lastEdited      │        │─────────────────│
└─────────────────┘        │ id              │
                           │ projectId       │
┌─────────────────┐        │ canvasStateId   │
│  AiConversation │        │ nodes (JSONB)   │
│─────────────────│        │ edges (JSONB)   │
│ id              │        │ version         │
│ projectId       │        │ message         │
│ messages (JSONB)│        │ createdAt       │
│ createdAt       │        └─────────────────┘
│ updatedAt       │
└─────────────────┘
```

## 3. Prisma Schema

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["rowLevelSecurity"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── User ────────────────────────────────────────────
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatarUrl String?
  githubId  String?  @unique
  googleId  String?  @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  projects       Project[]
  sessions       Session[]
  collaborations Collaboration[]
  conversations  AiConversation[]
}

// ─── Session ─────────────────────────────────────────
model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  data      Json?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ─── Project ─────────────────────────────────────────
model Project {
  id          String   @id @default(cuid())
  name        String
  description String   @default("")
  templateId  String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user           User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  canvasStates   CanvasState[]
  snapshots      Snapshot[]
  collaborations Collaboration[]
  conversations  AiConversation[]
}

// ─── Canvas State ────────────────────────────────────
model CanvasState {
  id         String   @id @default(cuid())
  projectId  String
  nodes      Json     @default("[]")
  edges      Json     @default("[]")
  viewport   Json?
  version    Int      @default(1)
  snapshotId String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  project    Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  snapshots  Snapshot[]

  @@unique([projectId, version])
}

// ─── Snapshot (Version History) ──────────────────────
model Snapshot {
  id            String   @id @default(cuid())
  projectId     String
  canvasStateId String
  nodes         Json
  edges         Json
  viewport      Json?
  version       Int
  message       String   @default("")
  createdAt     DateTime @default(now())

  project     Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  canvasState CanvasState @relation(fields: [canvasStateId], references: [id])
}

// ─── Collaboration ───────────────────────────────────
model Collaboration {
  id         String   @id @default(cuid())
  projectId  String
  userId     String
  document   Bytes    @default("")
  lastEdited DateTime @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
}

// ─── AI Conversation ─────────────────────────────────
model AiConversation {
  id        String   @id @default(cuid())
  projectId String
  messages  Json     @default("[]")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

// ─── Templates ───────────────────────────────────────
model Template {
  id          String   @id @default(cuid())
  name        String
  description String
  category    String
  nodes       Json
  edges       Json
  icon        String   @default("")
  isPublic    Boolean  @default(true)
  authorId    String?
  downloads   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ─── Agent Output Cache ──────────────────────────────
model AgentCache {
  id        String   @id @default(cuid())
  hash      String   @unique
  agentName String
  input     Json
  output    Json
  model     String
  tokens    Int      @default(0)
  createdAt DateTime @default(now())
  expiresAt DateTime
}
```

## 4. Redis Schema

```
# Session Cache
session:{sessionId} → { userId, data, expiresAt }

# Canvas State (real-time)
canvas:{projectId}:state → { nodes, edges, viewport }

# Rate Limiting
ratelimit:{userId}:{endpoint} → { count, resetAt }

# AI Response Cache
ai:cache:{hash} → { output, model, tokens }

# Collaboration Presence
presence:{projectId}:{userId} → { cursor, selectedNode, lastActive }

# Job Queue (via Trigger.dev)
triggers:queue → { jobs }
```

## 5. Key Design Decisions

### 5.1 JSONB for Canvas State
Canvas nodes and edges are inherently flexible and schema-less. Using JSONB columns allows:
- Arbitrary node properties without migration
- Fast read/write of entire canvas state
- Easy snapshot comparison for version history

### 5.2 Versioned Canvas States
Each project has versioned canvas states (`@@unique([projectId, version])`) enabling:
- Undo/redo at the version level
- Point-in-time recovery
- Visual diff between versions

### 5.3 Separate Agent Cache Table
AI agent outputs are cached using a hash of the input to:
- Avoid redundant LLM calls (cost savings)
- Speed up repeated queries
- Track token usage per agent

### 5.4 Yjs Binary Document in Collaboration
The collaboration table stores the Yjs CRDT document as binary data. This enables:
- Offline edits that merge automatically
- Conflict-free resolution
- Peer-to-peer sync support

# Orbit Studio

**AI-native software architecture design platform.**

Design, visualize, and simulate system architectures with an intelligent canvas.

## Tech Stack

- **Framework:** Next.js 15 (React 19)
- **Canvas:** @xyflow/react (React Flow v12)
- **Animations:** framer-motion
- **Styling:** Tailwind CSS v4 + Geist (Sans & Mono)
- **State:** Zustand
- **API:** tRPC v11
- **Auth:** Better Auth
- **Database:** Drizzle ORM (PostgreSQL)
- **Monorepo:** Turborepo + pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
apps/
  web/         — Next.js app (dashboard, canvas workspace, settings)
packages/
  ui/          — Shared UI components
  ai/          — AI agent integration
  auth/        — Authentication package
  canvas/      — Canvas state and logic
  config/      — Shared configuration
  database/    — Drizzle schema + migrations
  sdk/         — Public SDK
  agents/      — AI agent definitions
  prompts/     — AI prompts
```

## Features

- Drag-and-drop architecture canvas with 22 custom node types
- Pre-built architecture templates (Netflix Clone, SaaS, E-Commerce, Healthcare, Banking API, AI Chatbot)
- AI-powered architecture assistant
- Property panel with AI actions
- Undo/redo support
- Dark mode (light mode compatible)

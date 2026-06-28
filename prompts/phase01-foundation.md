# Phase 1: Foundation Setup

## Task
Set up the monorepo foundation for Orbit Studio.

## Steps
1. Initialize the root package.json with workspace configuration
2. Configure pnpm-workspace.yaml pointing to apps/*, packages/*, services/*
3. Set up Turborepo with build pipeline configuration
4. Create TypeScript base config
5. Set up ESLint and Prettier
6. Initialize Git repository
7. Create .gitignore, .env.example, .node-version
8. Set up Docker Compose with PostgreSQL, Redis, MinIO, Mailpit
9. Create the 11 packages: ui, ai, agents, prompts, config, database, canvas, sdk, auth
10. Create Next.js 15 app in apps/web
11. Install all dependencies with pnpm install
12. Configure Prisma with the full schema
13. Run db:generate and db:push
14. Seed the database with templates

## Files to Create
- package.json, pnpm-workspace.yaml, turbo.json
- tsconfig.json, .eslintrc.js, .prettierrc
- .gitignore, .env.example, .node-version, .npmrc
- docker/docker-compose.yml
- All package.json files in packages/*
- apps/web/package.json, apps/web/tsconfig.json, apps/web/next.config.ts
- apps/web/postcss.config.mjs
- packages/database/prisma/schema.prisma
- packages/database/src/index.ts, packages/database/src/seed.ts

## Verification
- `pnpm install` completes without errors
- `pnpm db:generate` creates Prisma client
- `pnpm --filter @orbit/web lint` passes
- Docker containers start and connect

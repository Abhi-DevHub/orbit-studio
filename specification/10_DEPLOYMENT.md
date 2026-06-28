# Orbit Studio — DevOps & Local Development Specification

## Version 1.0

---

## 1. Local Development Setup

### 1.1 Prerequisites
- Node.js 22 LTS
- pnpm 9+
- Docker Desktop
- Git

### 1.2 Docker Compose (Local Infrastructure)

```yaml
# docker/docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: orbitstudio
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redisdata:/data

  minio:
    image: minio/minio
    command: server /data --console-address ':9001'
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - '9000:9000'
      - '9001:9001'
    volumes:
      - miniodata:/data

  mailpit:
    image: axllent/mailpit
    ports:
      - '1025:1025'
      - '8025:8025'

volumes:
  pgdata:
  redisdata:
  miniodata:
```

### 1.3 Environment Setup

```bash
# Clone and install
git clone <repo-url>
cd orbit-studio
pnpm install

# Start infrastructure
docker compose -f docker/docker-compose.yml up -d

# Copy environment
cp .env.example .env

# Run database migrations
pnpm db:migrate

# Seed templates
pnpm db:seed

# Start development
pnpm dev
```

## 2. Package Scripts

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "clean": "turbo clean",
    
    "db:generate": "pnpm --filter @orbit/database db:generate",
    "db:migrate": "pnpm --filter @orbit/database db:migrate",
    "db:push": "pnpm --filter @orbit/database db:push",
    "db:seed": "pnpm --filter @orbit/database db:seed",
    "db:studio": "pnpm --filter @orbit/database db:studio",
    
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,md,json}\""
  }
}
```

## 3. Turborepo Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {},
    "test": {},
    "clean": {
      "cache": false
    }
  }
}
```

## 4. Production Deployment

### 4.1 Vercel Deployment (Web App)
- Framework: Next.js 15
- Build Command: `pnpm build`
- Output Directory: `apps/web/.next`
- Environment Variables: All required vars
- Regions: 1 (iad1) for MVP

### 4.2 Docker Deployment (Workers)
```dockerfile
# docker/Dockerfile.worker
FROM node:22-alpine
WORKDIR /app
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY services/worker/ ./services/worker/
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @orbit/worker build
CMD ["node", "services/worker/dist/index.js"]
```

### 4.3 GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm db:generate
      - run: pnpm test
```

## 5. Monitoring & Observability

### 5.1 Local Development
- Console logging with structured JSON
- React DevTools for frontend
- tRPC dev tools for API debugging
- Prisma Studio for database inspection

### 5.2 Production (Future)
- Sentry for error tracking
- PostHog for product analytics
- Upstash for Redis metrics
- Vercel Analytics for performance

## 6. Git Workflow

```bash
main          # Production-ready code
├── develop   # Integration branch
├── feat/*    # Feature branches
├── fix/*     # Bug fixes
└── spec/*    # Specification documents
```

- Conventional commits (feat:, fix:, docs:, chore:)
- PRs require CI passing + 1 review
- Squash merge to main
- Semantic versioning (v0.1.0, v0.2.0, etc.)

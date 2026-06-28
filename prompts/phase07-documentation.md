# Phase 7: Documentation Generator

## Task
Generate comprehensive system documentation from architecture.

## Files
- apps/web/src/components/documentation/DocGenerator.tsx
- apps/web/src/components/documentation/DocPreview.tsx
- apps/web/src/components/documentation/ExportOptions.tsx
- apps/web/src/server/api/routers/documentation.router.ts
- packages/ai/src/documentation-generator.ts

## Features
Auto-generate:
- System Overview document
- Architecture Decision Records (ADRs)
- Component Documentation for each node
- API Reference from architecture
- Database Schema documentation
- Deployment Guide
- Security & Compliance document
- Monitoring & Observability plan

Export formats:
- Markdown
- HTML (styled)
- PDF (via HTML-to-PDF)

## AI Prompt Templates
- packages/prompts/src/documentation.ts

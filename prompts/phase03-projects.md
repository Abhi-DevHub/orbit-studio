# Phase 3: Projects

## Task
Implement project CRUD with the project workspace layout.

## Files
- apps/web/src/server/api/routers/project.router.ts
- apps/web/src/server/api/routers/canvas.router.ts
- apps/web/src/stores/project-store.ts
- apps/web/src/stores/canvas-store.ts
- apps/web/src/stores/ui-store.ts
- apps/web/src/components/project/WorkspacePage.tsx (layout shell)
- apps/web/src/components/dashboard/DashboardPage.tsx (full implementation)
- apps/web/src/components/dashboard/TemplatesPage.tsx
- apps/web/src/app/project/[id]/page.tsx
- apps/web/src/app/page.tsx

## Features
- Dashboard with project grid
- Create project (with template option)
- Delete project
- Duplicate project
- Project workspace with top bar, sidebar, canvas, right panel
- Auto-save canvas state every 30 seconds
- Recent projects list on dashboard

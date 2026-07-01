# Progress

## Done

- [x] Brand identity defined
- [x] Design system generated and persisted
- [x] Geist fonts installed, layout + globals updated
- [x] DashboardPage, TemplatesPage, SettingsPage, WorkspacePage redesigned
- [x] NodeLibrary: Lucide SVGs, drag-to-create
- [x] PropertiesPanel: empty state, live editing, AI actions
- [x] AIChatPanel: messages, pipeline status, suggestions
- [x] 22 custom architecture node components with 4-way handles
- [x] 6 template architectures with canvas loading
- [x] Template data loads via `/project/new?template=xxx`
- [x] Build verification: `pnpm run typecheck` (10/10), `pnpm run build` (all pages)

### Eraser.io-Style Features
- [x] **Diagram-as-Code (DaC) Mode** — DSL editor + canvas split-pane workspace
- [x] **DSL Parser** — `->` edges, `Group "Name" {}` nesting, `[icon:, status:, provider:]` properties
- [x] **Auto-Layout Engine** — Dagre-based Sugiyama layout (top-to-bottom), one-click rearrange
- [x] **Command Palette** — ⌘K searchable menu (mode switches, export, undo/redo, save, toggle panels, keyboard shortcuts)
- [x] **Mode Selector** — Canvas / DaC / Docs toggle in toolbar (Eraser-style workspace modes)
- [x] **Keyboard Shortcuts** — ⌘Z undo, ⌘⇧Z redo, ⌘S save, ⌘B sidebar, ⌘E right panel
- [x] **AI-Generated DSL** — AI pipeline now generates DSL code; "Copy" + "Open DaC" buttons
- [x] **Workspace Modes** — Canvas mode (NodeLibrary + Canvas + Properties), DaC mode (Code Editor + Canvas + Properties)
- [x] **Minimalist Toolbar** — Mode segment, command palette button, Eraser-style compact actions

### Previously Completed Pending Tasks
- [x] Store refactored as source of truth (undo/redo works properly)
- [x] Drag-to-create from NodeLibrary (final polish)
- [x] Canvas export (PNG/SVG/JSON)
- [x] `/project/new?name=xxx` route for blank project creation
- [x] LocalStorage save/load
- [x] AI agent pipeline (8-agent animated pipeline with DSL generation)
- [x] Auth pages (sign-in, sign-up, callback)

## Pending

- [ ] Save/load projects from database (requires running DB + tRPC backend)
- [ ] User authentication flow (full Better Auth integration)
- [ ] Connection validation (prevent self-connections)
- [ ] Docs mode workspace (Markdown editor + canvas with embedded snapshots per Eraser)
- [ ] Real-time collaboration (CRDT/Yjs multiplayer — Phase 5)
- [ ] AI documentation generation (Phase 7)
- [ ] Export to Mermaid/PlantUML/Draw.io (Phase 8)
- [ ] Codebase scanning (Eraserbot-style GitHub integration for auto-diagrams)
- [ ] Deployment CI/CD (Phase 9)
- [ ] Optimization: canvas virtualization, bundle splitting, responsive mobile layout (Phase 10)

# Orbit Studio — Frontend Implementation Guide

## Version 1.0

---

## 1. Application Architecture

```
apps/web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── callback/
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx           # Dashboard
│   │   │   └── layout.tsx
│   │   ├── project/
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Project workspace
│   │   │       └── layout.tsx
│   │   ├── templates/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing/redirect
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── canvas/
│   │   │   ├── Canvas.tsx
│   │   │   ├── CanvasToolbar.tsx
│   │   │   ├── NodeLibrary.tsx
│   │   │   ├── PropertiesPanel.tsx
│   │   │   ├── Minimap.tsx
│   │   │   └── nodes/
│   │   │       ├── BaseNode.tsx
│   │   │       ├── ApiGatewayNode.tsx
│   │   │       ├── DatabaseNode.tsx
│   │   │       ├── FrontendNode.tsx
│   │   │       ├── BackendNode.tsx
│   │   │       ├── QueueNode.tsx
│   │   │       ├── CacheNode.tsx
│   │   │       ├── KubernetesNode.tsx
│   │   │       └── CustomNode.tsx
│   │   ├── ai/
│   │   │   ├── AIChatPanel.tsx
│   │   │   ├── AIArchitect.tsx
│   │   │   ├── AgentPipeline.tsx
│   │   │   ├── SuggestionCard.tsx
│   │   │   └── ExplainPanel.tsx
│   │   ├── project/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectList.tsx
│   │   │   ├── CreateProjectDialog.tsx
│   │   │   └── ProjectSettings.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── RecentProjects.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── ActivityFeed.tsx
│   │   ├── documentation/
│   │   │   ├── DocGenerator.tsx
│   │   │   ├── DocPreview.tsx
│   │   │   └── ExportOptions.tsx
│   │   └── shared/
│   │       ├── CommandPalette.tsx
│   │       ├── EmptyState.tsx
│   │       ├── LoadingScreen.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── hooks/
│   │   ├── useCanvas.ts
│   │   ├── useCanvasAutoSave.ts
│   │   ├── useAI.ts
│   │   ├── useProject.ts
│   │   ├── useCollaboration.ts
│   │   ├── useKeyboard.ts
│   │   └── useTheme.ts
│   │
│   ├── stores/
│   │   ├── canvasStore.ts         # Zustand store
│   │   ├── projectStore.ts
│   │   ├── uiStore.ts
│   │   └── aiStore.ts
│   │
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/
│   │   │   └── trpc.ts
│   │   ├── db/
│   │   │   └── client.ts
│   │   └── auth.ts
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   ├── canvas-utils.ts
│   │   └── ai-utils.ts
│   │
│   ├── providers/
│   │   ├── TRPCProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── AuthProvider.tsx
│   │   └── CollaborationProvider.tsx
│   │
│   └── styles/
│       └── globals.css
```

## 2. State Management (Zustand)

```typescript
// canvasStore.ts
interface CanvasStore {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  viewport: Viewport | null;
  history: { nodes: Node[]; edges: Edge[] }[];
  historyIndex: number;
  
  // Actions
  addNode: (node: Node) => void;
  updateNode: (id: string, data: Partial<Node>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (id: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  selectNode: (id: string | null) => void;
  setViewport: (viewport: Viewport) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
}
```

## 3. Key Components

### 3.1 Canvas.tsx
```typescript
// Core canvas component using React Flow
interface CanvasProps {
  projectId: string;
  readOnly?: boolean;
}

// Features:
// - React Flow ReactFlow component
// - Custom node types from @orbit/canvas
// - Custom edge types
// - Minimap
// - Controls (zoom, fit, lock)
// - Background grid
// - Keyboard shortcuts
// - Selection box
// - Drag and drop from node library
// - Auto-save every 30 seconds
```

### 3.2 NodeLibrary.tsx
```typescript
// Left sidebar panel with draggable node types
// Categories: Application, Data, Infrastructure, Network, Security, AI, Monitoring, Queue
// Search/filter functionality
// Drag creates new node on canvas
// Recently used section
```

### 3.3 AIChatPanel.tsx
```typescript
// Bottom panel chat interface
// Context-aware: AI sees current canvas state
// Streaming responses
// Canvas actions: AI can add/remove/modify nodes
// Markdown rendering for explanations
// Action buttons: Apply, Modify, Dismiss
// Conversation history
```

### 3.4 PropertiesPanel.tsx
```typescript
// Right panel showing selected node properties
// Type-specific configuration fields
// Cost, security, performance metadata
// Explain button → AI explain mode
// Delete, duplicate actions
// Connection information
```

## 4. React Flow Configuration

```typescript
const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  style: { stroke: '#64748b', strokeWidth: 2 },
};

const nodeTypes = {
  frontend: FrontendNode,
  backend: BackendNode,
  database: DatabaseNode,
  api: ApiGatewayNode,
  cache: CacheNode,
  queue: QueueNode,
  auth: BaseNode,
  storage: BaseNode,
  kubernetes: KubernetesNode,
  lambda: BaseNode,
  docker: BaseNode,
  'ai-model': BaseNode,
  monitoring: BaseNode,
  gateway: ApiGatewayNode,
  worker: BaseNode,
  cdn: BaseNode,
  webhook: BaseNode,
  'third-party': BaseNode,
  custom: CustomNode,
};
```

## 5. Styling Approach

- Tailwind CSS for all styling
- shadcn/ui components customized with Orbit theme
- CSS variables for theming (dark/light)
- Framer Motion for animations (panel transitions, node add/remove)
- Canvas grid using CSS background pattern
- Node shadows and glow effects using Tailwind

## 6. Performance Optimizations

- React.memo for canvas nodes
- Virtualization for large node lists
- Debounced auto-save (30 seconds)
- Optimistic updates for AI actions
- Lazy loading for AI panel and documentation
- Image optimization for exported diagrams
- Web Workers for heavy canvas operations

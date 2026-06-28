# Phase 4: Canvas — Visual Architecture Editor

## Task
Build the infinite canvas with React Flow, custom nodes, drag-and-drop, and interactions.

## Files
- apps/web/src/components/canvas/Canvas.tsx - Main canvas component
- apps/web/src/components/canvas/NodeLibrary.tsx - Left panel with draggable nodes
- apps/web/src/components/canvas/PropertiesPanel.tsx - Right panel for node properties
- apps/web/src/components/canvas/CanvasToolbar.tsx - Toolbar (zoom, fit, lock)
- apps/web/src/components/canvas/Minimap.tsx - Minimap navigation
- apps/web/src/components/canvas/nodes/BaseNode.tsx - Base node component
- apps/web/src/components/canvas/nodes/ApiGatewayNode.tsx
- apps/web/src/components/canvas/nodes/DatabaseNode.tsx
- apps/web/src/components/canvas/nodes/FrontendNode.tsx
- apps/web/src/components/canvas/nodes/BackendNode.tsx
- apps/web/src/components/canvas/nodes/QueueNode.tsx
- apps/web/src/components/canvas/nodes/CacheNode.tsx
- apps/web/src/components/canvas/nodes/KubernetesNode.tsx
- apps/web/src/components/canvas/nodes/CustomNode.tsx
- packages/canvas/src/node-types.ts
- packages/canvas/src/layout.ts
- packages/canvas/src/utils.ts

## Features
- Infinite canvas with grid background
- 20+ node types with unique icons and colors
- Drag-and-drop from node library to canvas
- Smart edge routing (smoothstep)
- Node selection, move, resize, delete
- Properties panel updates on selection
- Minimap for navigation
- Zoom controls (scroll wheel, pinch, buttons)
- Keyboard shortcuts (Delete, Copy, Paste, Undo/Redo)
- Undo/Redo history (50 levels)
- Connection validation (prevent self-connections)
- Auto-layout for AI-generated nodes

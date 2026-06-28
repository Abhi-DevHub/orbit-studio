'use client';

import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type Connection,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Sparkles, MessageSquare, Settings, Download, Undo2, Redo2, Save, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCanvasStore } from '@/stores/canvas-store';
import { useUIStore } from '@/stores/ui-store';
import { useAIStore } from '@/stores/ai-store';
import { NodeLibrary } from '@/components/canvas/NodeLibrary';
import { PropertiesPanel } from '@/components/canvas/PropertiesPanel';
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import { cn } from '@/lib/utils';

interface WorkspacePageProps {
  projectId: string;
}

export function WorkspacePage({ projectId }: WorkspacePageProps) {
  const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { selectedNode, selectNode, undo, redo } = useCanvasStore();
  const { sidebarOpen, rightPanelOpen, toggleSidebar, toggleRightPanel, activeRightPanel, setActiveRightPanel } = useUIStore();
  const { suggestions } = useAIStore();

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = { ...connection, id: `edge_${Date.now()}`, type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } };
      setEdges((eds) => [...eds, newEdge]);
    },
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: Node = {
        id: `node_${Date.now()}`,
        type: 'default',
        position,
        data: {
          label: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
          type,
          metadata: { status: 'planned' },
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes],
  );

  return (
    <div className="flex h-screen flex-col">
      {/* Top Bar */}
      <header className="flex h-12 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium">Healthcare SaaS Platform</span>
          <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">Draft</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => undo()} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Undo">
            <Undo2 className="h-4 w-4" />
          </button>
          <button onClick={() => redo()} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Redo">
            <Redo2 className="h-4 w-4" />
          </button>
          <div className="mx-2 h-5 w-px bg-border" />
          <button className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Save">
            <Save className="h-4 w-4" />
          </button>
          <button className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Export">
            <Download className="h-4 w-4" />
          </button>
          <div className="mx-2 h-5 w-px bg-border" />
          <button
            onClick={() => { setActiveRightPanel('ai'); toggleSidebar(); }}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Architect
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Node Library */}
        {sidebarOpen && (
          <aside className="w-56 border-r border-border overflow-y-auto">
            <NodeLibrary />
          </aside>
        )}

        {/* Canvas */}
        <main className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeClick={(_, node) => selectNode(node.id)}
            onPaneClick={() => selectNode(null)}
            fitView
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#64748b', strokeWidth: 2 },
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
            <Controls className="!bg-card !border-border" />
            <MiniMap
              className="!bg-card !border-border"
              nodeColor={(n) => {
                const colors: Record<string, string> = { database: '#22c55e', gateway: '#8b5cf6', backend: '#6366f1', frontend: '#3b82f6', cache: '#14b8a6', auth: '#ef4444' };
                return colors[n.data?.type as string] || '#64748b';
              }}
              maskColor="rgba(15, 23, 42, 0.8)"
            />
          </ReactFlow>
        </main>

        {/* Right Panel */}
        {rightPanelOpen && (
          <aside className="w-80 border-l border-border flex flex-col">
            {/* Tab Bar */}
            <div className="flex border-b border-border">
              {[
                { id: 'properties', label: 'Properties', icon: Settings },
                { id: 'chat', label: 'AI Chat', icon: MessageSquare },
                { id: 'ai', label: 'Architect', icon: Sparkles },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRightPanel(tab.id as any)}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors',
                    activeRightPanel === tab.id
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto">
              {activeRightPanel === 'properties' && <PropertiesPanel />}
              {activeRightPanel === 'chat' && <AIChatPanel />}
              {activeRightPanel === 'ai' && <AIChatPanel />}
            </div>
          </aside>
        )}

        {/* Toggle buttons */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            onClick={toggleSidebar}
            className="rounded-lg border border-border bg-card p-2 text-muted-foreground shadow-lg hover:text-foreground"
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <PanelRightClose className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={toggleRightPanel}
            className="rounded-lg border border-border bg-card p-2 text-muted-foreground shadow-lg hover:text-foreground"
            title={rightPanelOpen ? 'Close panel' : 'Open panel'}
          >
            <PanelRightOpen className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

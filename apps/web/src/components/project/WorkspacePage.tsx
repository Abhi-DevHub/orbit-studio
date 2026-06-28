'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type Connection,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Settings,
  Download,
  Undo2,
  Redo2,
  Save,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCanvasStore } from '@/stores/canvas-store';
import { useUIStore } from '@/stores/ui-store';
import { useAIStore } from '@/stores/ai-store';
import { NodeLibrary } from '@/components/canvas/NodeLibrary';
import { PropertiesPanel } from '@/components/canvas/PropertiesPanel';
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import { ArchNode } from '@/components/canvas/nodes';
import { TEMPLATES_DATA } from '@/lib/templates-data';
import { cn } from '@/lib/utils';

const nodeTypes = { archNode: ArchNode };

interface WorkspacePageProps {
  projectId: string;
  templateId?: string;
}

const NODE_COLORS: Record<string, string> = {
  database: '#22c55e',
  gateway: '#8b5cf6',
  backend: '#6366f1',
  frontend: '#3b82f6',
  cache: '#14b8a6',
  auth: '#ef4444',
};

export function WorkspacePage({ projectId, templateId }: WorkspacePageProps) {
  const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { selectedNode, selectNode, undo, redo } = useCanvasStore();
  const { sidebarOpen, rightPanelOpen, toggleSidebar, toggleRightPanel, activeRightPanel, setActiveRightPanel } = useUIStore();
  const { suggestions } = useAIStore();

  const template = templateId ? TEMPLATES_DATA[templateId] : null;
  const projectName = template ? template.name : projectId === 'new' ? 'Untitled Project' : `Project ${projectId}`;

  useEffect(() => {
    if (template) {
      setNodes(template.nodes);
      setEdges(template.edges);
    }
  }, [templateId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = { ...connection, id: `edge_${Date.now()}`, type: 'smoothstep', style: { stroke: '#475569', strokeWidth: 1.5 } };
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
        type: 'archNode',
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
      <header className="flex h-11 items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/')}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs font-medium">{projectName}</span>
          <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border">Draft</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={() => undo()} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer" title="Undo">
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => redo()} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer" title="Redo">
            <Redo2 className="h-3.5 w-3.5" />
          </button>
          <div className="mx-1.5 h-4 w-px bg-border" />
          <button className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer" title="Save">
            <Save className="h-3.5 w-3.5" />
          </button>
          <button className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer" title="Export">
            <Download className="h-3.5 w-3.5" />
          </button>
          <div className="mx-1.5 h-4 w-px bg-border" />
          <button
            onClick={() => { setActiveRightPanel('ai'); if (!rightPanelOpen) toggleRightPanel(); }}
            className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-150 cursor-pointer"
          >
            <Sparkles className="h-3 w-3" />
            AI Architect
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <aside className="w-52 border-r border-border overflow-y-auto">
            <NodeLibrary />
          </aside>
        )}

        <main className="flex-1 relative" ref={reactFlowWrapper}>
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
            nodeTypes={nodeTypes}
            fitView
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#475569', strokeWidth: 1.5 },
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
            <Controls className="!bg-card !border-border !rounded-md !shadow-none" />
            <MiniMap
              className="!bg-card !border-border !rounded-md !shadow-none"
              nodeColor={(n) => NODE_COLORS[n.data?.type as string] || '#475569'}
              maskColor="rgba(15, 23, 42, 0.85)"
            />
          </ReactFlow>

          <div className="absolute bottom-3 left-3 flex gap-2">
            <button
              onClick={toggleSidebar}
              className="rounded-md border border-border bg-card p-1.5 text-muted-foreground shadow-sm hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer"
              title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <PanelRightClose className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={toggleRightPanel}
              className="rounded-md border border-border bg-card p-1.5 text-muted-foreground shadow-sm hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer"
              title={rightPanelOpen ? 'Close panel' : 'Open panel'}
            >
              <PanelRightOpen className="h-3.5 w-3.5" />
            </button>
          </div>
        </main>

        {rightPanelOpen && (
          <aside className="w-72 border-l border-border flex flex-col">
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
                    'flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-2 text-[11px] font-medium transition-colors duration-150 cursor-pointer',
                    activeRightPanel === tab.id
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  <tab.icon className="h-3 w-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeRightPanel === 'properties' && <PropertiesPanel />}
              {activeRightPanel === 'chat' && <AIChatPanel />}
              {activeRightPanel === 'ai' && <AIChatPanel />}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

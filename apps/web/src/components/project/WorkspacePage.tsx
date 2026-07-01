'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useKeyPress,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ArrowLeft, Sparkles, MessageSquare, Settings, Download, Undo2, Redo2,
  Save, PanelRightOpen, PanelRightClose, Trash2, Image, FileJson, FileType,
  Code, Layout, FileText, Keyboard,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toPng, toSvg } from 'html-to-image';
import { useCanvasStore } from '@/stores/canvas-store';
import { useUIStore } from '@/stores/ui-store';
import { useAIStore } from '@/stores/ai-store';
import { NodeLibrary } from '@/components/canvas/NodeLibrary';
import { PropertiesPanel } from '@/components/canvas/PropertiesPanel';
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import { DaCEditor } from '@/components/canvas/DaCEditor';
import { CommandPalette } from '@/components/canvas/CommandPalette';
import { ArchNode } from '@/components/canvas/nodes';
import { TEMPLATES_DATA } from '@/lib/templates-data';
import { cn } from '@/lib/utils';
import { ORBIT_EVENTS } from '@/lib/events';

const nodeTypes = { archNode: ArchNode };

const MODES = [
  { id: 'canvas' as const, label: 'Canvas', icon: Layout },
  { id: 'dac' as const, label: 'DaC', icon: Code },
  { id: 'docs' as const, label: 'Docs', icon: FileText },
];

interface WorkspacePageProps {
  projectId: string;
  templateId?: string;
}

export function WorkspacePage({ projectId, templateId }: WorkspacePageProps) {
  const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<any>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const {
    nodes, edges, selectedNode, selectNode,
    onNodesChange, onEdgesChange, onConnect,
    addNode, removeNode, removeEdge, undo, redo,
    isSaving, lastSaved, hydrate, toJson, fromJson, setNodes, setEdges,
    setIsSaving, setLastSaved,
  } = useCanvasStore();

  const {
    sidebarOpen, rightPanelOpen, toggleSidebar, toggleRightPanel,
    activeRightPanel, setActiveRightPanel, workspaceMode, setWorkspaceMode,
    toggleCommandPalette,
  } = useUIStore();

  const { runPipeline } = useAIStore();
  const deletePressed = useKeyPress(['Delete', 'Backspace']);

  const template = templateId ? TEMPLATES_DATA[templateId] : null;
  const projectName = template ? template.name : projectId === 'new' ? 'Untitled Project' : `Project ${projectId}`;

  useEffect(() => {
    if (template) {
      hydrate(template.nodes, template.edges);
    } else {
      const saved = localStorage.getItem(`orbit-project-${projectId}`);
      if (saved) fromJson(saved);
    }
  }, [templateId, projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (deletePressed && selectedNode) {
      removeNode(selectedNode);
    }
  }, [deletePressed, selectedNode, removeNode]);

  const handlersRef = useRef({ handleSave, handleExportPng, handleExportSvg, handleExportJson });
  handlersRef.current = { handleSave, handleExportPng, handleExportSvg, handleExportJson };

  useEffect(() => {
    const keyboardHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) { e.preventDefault(); redo(); }
        else { e.preventDefault(); undo(); }
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault(); handlersRef.current.handleSave(); return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault(); toggleSidebar(); return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault(); toggleRightPanel(); return;
      }
    };
    const eventHandler = (e: Event) => {
      switch (e.type) {
        case ORBIT_EVENTS.EXPORT_PNG: handlersRef.current.handleExportPng(); break;
        case ORBIT_EVENTS.EXPORT_SVG: handlersRef.current.handleExportSvg(); break;
        case ORBIT_EVENTS.EXPORT_JSON: handlersRef.current.handleExportJson(); break;
        case ORBIT_EVENTS.SAVE: handlersRef.current.handleSave(); break;
      }
    };
    window.addEventListener('keydown', keyboardHandler);
    window.addEventListener(ORBIT_EVENTS.EXPORT_PNG, eventHandler);
    window.addEventListener(ORBIT_EVENTS.EXPORT_SVG, eventHandler);
    window.addEventListener(ORBIT_EVENTS.EXPORT_JSON, eventHandler);
    window.addEventListener(ORBIT_EVENTS.SAVE, eventHandler);
    return () => {
      window.removeEventListener('keydown', keyboardHandler);
      window.removeEventListener(ORBIT_EVENTS.EXPORT_PNG, eventHandler);
      window.removeEventListener(ORBIT_EVENTS.EXPORT_SVG, eventHandler);
      window.removeEventListener(ORBIT_EVENTS.EXPORT_JSON, eventHandler);
      window.removeEventListener(ORBIT_EVENTS.SAVE, eventHandler);
    };
  }, [undo, toggleSidebar, toggleRightPanel]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance.current) return;
      const position = reactFlowInstance.current.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      addNode({
        id: `node_${Date.now()}`,
        type: 'archNode',
        position,
        data: {
          label: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
          type,
          metadata: { status: 'planned' },
        },
      });
    },
    [addNode],
  );

  function handleSave() {
    setIsSaving(true);
    localStorage.setItem(`orbit-project-${projectId}`, toJson());
    setLastSaved(new Date());
    setTimeout(() => setIsSaving(false), 600);
  }

  async function handleExportPng() {
    const el = reactFlowWrapper.current?.querySelector('.react-flow__renderer');
    if (!el) return;
    const dataUrl = await toPng(el as HTMLElement, { backgroundColor: '#FEFAEF', pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.png`;
    a.click();
    setShowExportMenu(false);
  }

  async function handleExportSvg() {
    const el = reactFlowWrapper.current?.querySelector('.react-flow__renderer');
    if (!el) return;
    const dataUrl = await toSvg(el as HTMLElement, { backgroundColor: '#FEFAEF', pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.svg`;
    a.click();
    setShowExportMenu(false);
  }

  function handleExportJson() {
    const blob = new Blob([toJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      <CommandPalette />

      <header className="flex h-11 items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/')} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs font-medium">{projectName}</span>
          <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border">
            {isSaving ? 'Saving...' : lastSaved ? 'Saved' : 'Draft'}
          </span>

          <div className="ml-4 flex items-center rounded-lg border border-border bg-card p-0.5">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = workspaceMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setWorkspaceMode(mode.id)}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all duration-200',
                    isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button onClick={() => undo()} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200" title="Undo (⌘Z)">
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => redo()} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200" title="Redo (⌘⇧Z)">
            <Redo2 className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1.5 h-4 w-px bg-border" />

          <button onClick={handleSave} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200" title="Save (⌘S)">
            <Save className="h-3.5 w-3.5" />
          </button>

          <div className="relative">
            <button onClick={() => setShowExportMenu(!showExportMenu)} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200" title="Export">
              <Download className="h-3.5 w-3.5" />
            </button>
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border border-border bg-card p-1.5 shadow-lg">
                  <button onClick={handleExportPng} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200">
                    <Image className="h-3.5 w-3.5" /> Export PNG
                  </button>
                  <button onClick={handleExportSvg} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200">
                    <FileType className="h-3.5 w-3.5" /> Export SVG
                  </button>
                  <button onClick={handleExportJson} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200">
                    <FileJson className="h-3.5 w-3.5" /> Export JSON
                  </button>
                </div>
              </>
            )}
          </div>

          {selectedNode && (
            <>
              <div className="mx-1.5 h-4 w-px bg-border" />
              <button onClick={() => removeNode(selectedNode)} className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200" title="Delete (⌫)">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          <div className="mx-1.5 h-4 w-px bg-border" />

          <button onClick={toggleCommandPalette} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200" title="Commands (⌘K)">
            <Keyboard className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => { setActiveRightPanel('ai'); if (!rightPanelOpen) toggleRightPanel(); runPipeline(); }}
            className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200"
          >
            <Sparkles className="h-3 w-3" />
            AI Architect
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {workspaceMode === 'canvas' && sidebarOpen && (
          <aside className="w-52 border-r border-border overflow-y-auto bg-card/30">
            <NodeLibrary />
          </aside>
        )}

        {workspaceMode === 'dac' && (
          <aside className="w-80 border-r border-border overflow-hidden flex flex-col bg-card/30">
            <DaCEditor />
          </aside>
        )}

        <main className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={(instance) => { reactFlowInstance.current = instance; }}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeClick={(_, node) => selectNode(node.id)}
            onEdgeClick={(_, edge) => removeEdge(edge.id)}
            onPaneClick={() => selectNode(null)}
            nodeTypes={nodeTypes}
            fitView
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#B9915E', strokeWidth: 1 },
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#B9915E" />
            <Controls className="!bg-card !border-border !rounded-lg !shadow-none" />
            <MiniMap
              className="!bg-card !border-border !rounded-lg !shadow-none"
              nodeColor={(n) => {
                const colors: Record<string, string> = { database: '#22c55e', gateway: '#8b5cf6', backend: '#6366f1', frontend: '#3b82f6', cache: '#14b8a6', auth: '#ef4444' };
                return colors[n.data?.type as string] || '#B9915E';
              }}
              maskColor="rgba(237, 235, 222, 0.85)"
            />
          </ReactFlow>

          <div className="absolute bottom-3 left-3 flex gap-2">
            <button onClick={toggleSidebar} className="rounded-md border border-border bg-card p-1.5 text-muted-foreground shadow-sm hover:text-foreground hover:bg-secondary transition-all duration-200" title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
              <PanelRightClose className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button onClick={toggleRightPanel} className="rounded-md border border-border bg-card p-1.5 text-muted-foreground shadow-sm hover:text-foreground hover:bg-secondary transition-all duration-200" title={rightPanelOpen ? 'Close panel' : 'Open panel'}>
              <PanelRightOpen className="h-3.5 w-3.5" />
            </button>
          </div>
        </main>

        {rightPanelOpen && (
          <aside className="w-72 border-l border-border flex flex-col bg-card/30">
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
                    'flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-2 text-[11px] font-medium transition-all duration-200',
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
              {activeRightPanel !== 'properties' && <AIChatPanel />}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

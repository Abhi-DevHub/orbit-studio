'use client';

import { useCanvasStore } from '@/stores/canvas-store';
import { useAIStore } from '@/stores/ai-store';
import { Sparkles, Trash2, Copy, Info, MousePointer2, FileText } from 'lucide-react';

export function PropertiesPanel() {
  const { nodes, selectedNode, updateNode, removeNode } = useCanvasStore();
  const { addMessage } = useAIStore();

  const node = nodes.find((n) => n.id === selectedNode);

  if (!node) {
    return (
      <div className="flex h-full items-center justify-center p-5">
        <div className="text-center max-w-[180px]">
          <div className="mb-3 flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <MousePointer2 className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Select a component to edit its properties
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground/50">
            Click on any node in the canvas
          </p>
        </div>
      </div>
    );
  }

  const data = node.data as Record<string, unknown>;
  const nodeType = (data?.type as string) || 'custom';
  const label = (data?.label as string) || 'Untitled';

  return (
    <div className="p-4">
      <div className="mb-4 flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-medium truncate">{label}</h3>
          <span className="text-[11px] capitalize text-muted-foreground">{nodeType}</span>
        </div>
        <div className="flex gap-0.5 flex-shrink-0">
          <button
            onClick={() => addMessage({ id: Date.now().toString(), role: 'user', content: `Explain the ${label} component`, timestamp: new Date() })}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer"
            title="Explain"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {}}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer"
            title="Duplicate"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => selectedNode && removeNode(selectedNode)}
            className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150 cursor-pointer"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-[11px] text-muted-foreground">Name</label>
          <input
            type="text"
            value={label}
            onChange={(e) => selectedNode && updateNode(selectedNode, { data: { ...data, label: e.target.value } })}
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:border-ring transition-colors duration-150"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-muted-foreground">Provider</label>
          <input
            type="text"
            value={((data?.metadata as Record<string, unknown>)?.provider as string) || ''}
            onChange={(e) =>
              selectedNode &&
              updateNode(selectedNode, {
                data: { ...data, metadata: { ...(data?.metadata as Record<string, unknown>), provider: e.target.value } },
              })
            }
            placeholder="AWS, GCP, Azure..."
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:border-ring transition-colors duration-150 placeholder:text-muted-foreground/50"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-muted-foreground">Description</label>
          <textarea
            value={(data?.description as string) || ''}
            onChange={(e) =>
              selectedNode && updateNode(selectedNode, { data: { ...data, description: e.target.value } })
            }
            rows={3}
            className="w-full resize-none rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:border-ring transition-colors duration-150 placeholder:text-muted-foreground/50"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-muted-foreground">Status</label>
          <select
            value={((data?.metadata as Record<string, unknown>)?.status as string) || 'planned'}
            onChange={(e) =>
              selectedNode &&
              updateNode(selectedNode, {
                data: { ...data, metadata: { ...(data?.metadata as Record<string, unknown>), status: e.target.value } },
              })
            }
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:border-ring transition-colors duration-150 cursor-pointer"
          >
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-border bg-secondary/30 p-3">
        <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-medium">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI Actions
        </div>
        <div className="space-y-1.5">
          {[
            { label: `Best practices for ${label}`, text: `What are best practices for ${label}?` },
            { label: `Alternatives to ${label}`, text: `What are alternatives to ${label}?` },
            { label: 'Cost estimates', text: `Show me cost estimates for ${label}` },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => addMessage({ id: Date.now().toString(), role: 'user', content: action.text, timestamp: new Date() })}
              className="w-full rounded-md bg-secondary px-2.5 py-1.5 text-left text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors duration-150 cursor-pointer"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

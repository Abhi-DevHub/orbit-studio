'use client';

import { useCanvasStore } from '@/stores/canvas-store';
import { useAIStore } from '@/stores/ai-store';
import { Sparkles, Trash2, Copy, Info } from 'lucide-react';

export function PropertiesPanel() {
  const { nodes, selectedNode, updateNode, removeNode } = useCanvasStore();
  const { addMessage } = useAIStore();

  const node = nodes.find((n) => n.id === selectedNode);

  if (!node) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-2 text-2xl text-muted-foreground">□</div>
          <p className="text-sm text-muted-foreground">Select a component to edit its properties</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Click on any node in the canvas</p>
        </div>
      </div>
    );
  }

  const data = node.data as Record<string, unknown>;
  const nodeType = (data?.type as string) || 'custom';
  const label = (data?.label as string) || 'Untitled';

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{label}</h3>
          <span className="text-xs capitalize text-muted-foreground">{nodeType}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => addMessage({ id: Date.now().toString(), role: 'user', content: `Explain the ${label} component`, timestamp: new Date() })}
            className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            title="Explain"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              if (selectedNode) {
                const newNode = { ...node, id: `node_${Date.now()}` };
                // Clone logic
              }
            }}
            className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            title="Duplicate"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => selectedNode && removeNode(selectedNode)}
            className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Properties */}
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Name</label>
          <input
            type="text"
            value={label}
            onChange={(e) => selectedNode && updateNode(selectedNode, { data: { ...data, label: e.target.value } })}
            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-ring"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Provider</label>
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
            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-ring"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Description</label>
          <textarea
            value={(data?.description as string) || ''}
            onChange={(e) =>
              selectedNode && updateNode(selectedNode, { data: { ...data, description: e.target.value } })
            }
            rows={3}
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-ring"
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Status</label>
          <select
            value={((data?.metadata as Record<string, unknown>)?.status as string) || 'planned'}
            onChange={(e) =>
              selectedNode &&
              updateNode(selectedNode, {
                data: { ...data, metadata: { ...(data?.metadata as Record<string, unknown>), status: e.target.value } },
              })
            }
            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-ring"
          >
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>
      </div>

      {/* AI Actions */}
      <div className="mt-6 rounded-lg border border-border bg-secondary/50 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI Actions
        </div>
        <div className="space-y-2">
          <button
            onClick={() => addMessage({ id: Date.now().toString(), role: 'user', content: `What are best practices for ${label}?`, timestamp: new Date() })}
            className="w-full rounded-lg bg-secondary px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary/80"
          >
            Best practices for {label}
          </button>
          <button
            onClick={() => addMessage({ id: Date.now().toString(), role: 'user', content: `What are alternatives to ${label}?`, timestamp: new Date() })}
            className="w-full rounded-lg bg-secondary px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary/80"
          >
            Alternatives to {label}
          </button>
          <button
            onClick={() => addMessage({ id: Date.now().toString(), role: 'user', content: `Show me cost estimates for ${label}`, timestamp: new Date() })}
            className="w-full rounded-lg bg-secondary px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary/80"
          >
            Cost estimates
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { MousePointer2, Sparkles, Trash2 } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvas-store';

export function PropertiesPanel() {
  const { selectedNode, nodes, updateNode, removeNode } = useCanvasStore();
  const node = nodes.find((n) => n.id === selectedNode);

  if (!node) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
          <MousePointer2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-xs font-medium text-muted-foreground">No node selected</p>
        <p className="mt-1 text-[10px] text-muted-foreground/60">Click a node on the canvas to inspect its properties</p>
      </div>
    );
  }

  const n = node!;
  const metadata = n.data?.metadata as Record<string, string> | undefined;

  function setDataField(field: string, value: string) {
    updateNode(n.id, {
      data: {
        ...n.data,
        [field]: value,
      },
    });
  }

  function setMetadataField(field: string, value: string) {
    updateNode(n.id, {
      data: {
        ...n.data,
        metadata: {
          ...(metadata || {}),
          [field]: value,
        },
      },
    });
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Node Properties</span>
        <button
          onClick={() => removeNode(n.id)}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-all duration-200"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Label</label>
        <input
          type="text"
          value={(n.data?.label as string) || ''}
          onChange={(e) => setDataField('label', e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring/50 transition-colors duration-200"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Description</label>
        <textarea
          value={metadata?.description || ''}
          onChange={(e) => setMetadataField('description', e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring/50 transition-colors duration-200 placeholder:text-muted-foreground/40"
          placeholder="Describe this component..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Type</label>
          <select
            value={(n.data?.type as string) || 'custom'}
            onChange={(e) => setDataField('type', e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring/50 transition-colors duration-200"
          >
            {['frontend', 'backend', 'microservice', 'worker', 'database', 'cache', 'gateway', 'auth', 'queue', 'ai-model', 'storage', 'monitoring', 'cdn', 'lambda', 'api', 'webhook', 'custom'].map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Status</label>
          <select
            value={metadata?.status || 'planned'}
            onChange={(e) => setMetadataField('status', e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring/50 transition-colors duration-200"
          >
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Provider</label>
        <input
          type="text"
          value={metadata?.provider || ''}
          onChange={(e) => setMetadataField('provider', e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring/50 transition-colors duration-200 placeholder:text-muted-foreground/40"
          placeholder="e.g. AWS, Node.js, Stripe"
        />
      </div>

      <div className="border-t border-border pt-4">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">AI Actions</span>
        </div>
        <div className="space-y-1.5">
          <button className="w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
            Describe this component
          </button>
          <button className="w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
            Suggest connections
          </button>
          <button className="w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
            Generate Terraform
          </button>
        </div>
      </div>
    </div>
  );
}

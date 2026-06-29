'use client';

import { MousePointer2, Sparkles } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvas-store';

export function PropertiesPanel() {
  const { selectedNode, nodes } = useCanvasStore();
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

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Label</label>
        <input
          type="text"
          defaultValue={node.data?.label as string}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring/50 transition-colors duration-200"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Type</label>
        <input
          type="text"
          defaultValue={node.data?.type as string}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring/50 transition-colors duration-200"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Status</label>
        <select
          defaultValue={(node.data?.metadata as any)?.status || 'planned'}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring/50 transition-colors duration-200"
        >
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="deprecated">Deprecated</option>
        </select>
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

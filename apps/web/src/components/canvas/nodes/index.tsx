import { memo } from 'react';
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';
import {
  Monitor, Server, Cpu, Boxes, Database, Zap, HardDrive, Box, Container,
  CloudLightning, Cloud, Waypoints, Globe, Webhook, Shield, Key,
  MessageSquare, Brain, Activity, Puzzle, Component, Network,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const NODE_ICONS: Record<string, LucideIcon> = {
  frontend: Monitor,
  backend: Server,
  worker: Cpu,
  microservice: Boxes,
  database: Database,
  cache: Zap,
  storage: HardDrive,
  docker: Box,
  kubernetes: Container,
  lambda: CloudLightning,
  cloud: Cloud,
  gateway: Waypoints,
  api: Network,
  cdn: Globe,
  webhook: Webhook,
  auth: Shield,
  secrets: Key,
  queue: MessageSquare,
  'ai-model': Brain,
  monitoring: Activity,
  'third-party': Puzzle,
  custom: Component,
};

const NODE_ACCENTS: Record<string, string> = {
  database: 'text-emerald-500',
  gateway: 'text-violet-500',
  backend: 'text-indigo-500',
  frontend: 'text-blue-500',
  cache: 'text-teal-500',
  auth: 'text-rose-500',
  worker: 'text-orange-500',
  microservice: 'text-sky-500',
  storage: 'text-amber-500',
  queue: 'text-pink-500',
  'ai-model': 'text-cyan-500',
  monitoring: 'text-lime-500',
  cdn: 'text-purple-500',
  lambda: 'text-yellow-500',
  kubernetes: 'text-indigo-400',
  docker: 'text-blue-400',
  cloud: 'text-slate-400',
  api: 'text-violet-400',
  webhook: 'text-fuchsia-500',
  secrets: 'text-red-500',
  'third-party': 'text-gray-400',
  custom: 'text-gray-300',
};

function ArchNodeComponent({ data, selected }: NodeProps) {
  const nodeType = data.type as string | undefined;
  const label = data.label as string | undefined;
  const metadata = data.metadata as Record<string, unknown> | undefined;
  const description = metadata?.description as string | undefined;
  const Icon = (nodeType && NODE_ICONS[nodeType]) || Component;
  const accent = (nodeType && NODE_ACCENTS[nodeType]) || 'text-muted-foreground';
  const status = metadata?.status as string | undefined;
  const statusDot = status === 'active' ? 'bg-emerald-500' : status === 'planned' ? 'bg-amber-500' : 'bg-muted-foreground';

  return (
    <div className="group relative min-w-[160px]">
      <NodeResizer
        minWidth={160}
        minHeight={60}
        isVisible={selected}
        handleClassName="!w-2.5 !h-2.5 !border-2 !border-primary !bg-card !rounded-sm"
        lineClassName="!border-primary/30"
      />
      <Handle type="target" position={Position.Top} id="top" className="!w-2 !h-2 !border-2 !border-border !bg-card" />
      <Handle type="target" position={Position.Left} id="left" className="!w-2 !h-2 !border-2 !border-border !bg-card" />
      <div
        className={`rounded-xl border bg-card px-4 py-3 shadow-sm transition-all duration-200 min-w-[160px] ${
          selected
            ? 'border-primary/50 bg-secondary/30 ring-1 ring-primary/20'
            : 'border-border group-hover:border-primary/30 group-hover:bg-secondary/50'
        }`}
      >
        <div className="flex items-start gap-2.5">
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary ${accent}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot}`} />
              <span className="text-xs font-medium truncate">{label ?? 'Node'}</span>
            </div>
            {nodeType && (
              <span className="text-[10px] text-muted-foreground capitalize block truncate">{nodeType}</span>
            )}
            {description && (
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed mt-1 line-clamp-2">{description}</p>
            )}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="right" className="!w-2 !h-2 !border-2 !border-border !bg-card" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!w-2 !h-2 !border-2 !border-border !bg-card" />
    </div>
  );
}

export const ArchNode = memo(ArchNodeComponent);

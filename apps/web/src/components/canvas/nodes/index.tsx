'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  Database,
  Monitor,
  Server,
  Cpu,
  Zap,
  HardDrive,
  Shield,
  Waypoints,
  MessageSquare,
  Brain,
  Activity,
  Box,
  Container,
  Cloud,
  Globe,
  Network,
  Webhook,
  Key,
  Puzzle,
  Component,
  Boxes,
  CloudLightning,
  type LucideIcon,
} from 'lucide-react';

interface ArchNodeData {
  label: string;
  type: string;
  description?: string;
  metadata?: {
    status?: 'planned' | 'active' | 'deprecated';
    provider?: string;
  };
}

const NODE_STYLES: Record<string, { bg: string; border: string; icon: LucideIcon; label: string }> = {
  database:     { bg: 'bg-emerald-500/10',  border: 'border-emerald-500/30',  icon: Database,       label: 'Database' },
  cache:        { bg: 'bg-cyan-500/10',     border: 'border-cyan-500/30',     icon: Zap,            label: 'Cache' },
  storage:      { bg: 'bg-teal-500/10',     border: 'border-teal-500/30',     icon: HardDrive,      label: 'Storage' },
  frontend:     { bg: 'bg-blue-500/10',     border: 'border-blue-500/30',     icon: Monitor,        label: 'Frontend' },
  backend:      { bg: 'bg-indigo-500/10',   border: 'border-indigo-500/30',   icon: Server,         label: 'Backend' },
  worker:       { bg: 'bg-orange-500/10',   border: 'border-orange-500/30',   icon: Cpu,            label: 'Worker' },
  microservice: { bg: 'bg-violet-500/10',   border: 'border-violet-500/30',   icon: Boxes,          label: 'Microservice' },
  gateway:      { bg: 'bg-purple-500/10',   border: 'border-purple-500/30',   icon: Waypoints,      label: 'API Gateway' },
  api:          { bg: 'bg-sky-500/10',      border: 'border-sky-500/30',      icon: Network,        label: 'API' },
  cdn:          { bg: 'bg-amber-500/10',    border: 'border-amber-500/30',    icon: Globe,          label: 'CDN' },
  webhook:      { bg: 'bg-pink-500/10',     border: 'border-pink-500/30',     icon: Webhook,        label: 'Webhook' },
  auth:         { bg: 'bg-rose-500/10',     border: 'border-rose-500/30',     icon: Shield,         label: 'Auth' },
  secrets:      { bg: 'bg-yellow-500/10',   border: 'border-yellow-500/30',   icon: Key,            label: 'Secrets' },
  queue:        { bg: 'bg-amber-500/10',    border: 'border-amber-500/30',    icon: MessageSquare,  label: 'Queue' },
  'ai-model':   { bg: 'bg-cyan-500/10',     border: 'border-cyan-500/30',     icon: Brain,          label: 'AI Model' },
  monitoring:   { bg: 'bg-emerald-500/10',  border: 'border-emerald-500/30',  icon: Activity,       label: 'Monitoring' },
  docker:       { bg: 'bg-sky-500/10',      border: 'border-sky-500/30',      icon: Box,            label: 'Docker' },
  kubernetes:   { bg: 'bg-blue-500/10',     border: 'border-blue-500/30',     icon: Container,      label: 'Kubernetes' },
  lambda:       { bg: 'bg-orange-500/10',   border: 'border-orange-500/30',   icon: CloudLightning, label: 'Lambda' },
  cloud:        { bg: 'bg-slate-500/10',    border: 'border-slate-500/30',    icon: Cloud,          label: 'Cloud' },
  'third-party':{ bg: 'bg-gray-500/10',     border: 'border-gray-500/30',     icon: Puzzle,         label: 'Third Party' },
  custom:       { bg: 'bg-muted/50',        border: 'border-border',          icon: Component,      label: 'Custom' },
};

function BaseNode({ data }: { data: ArchNodeData }) {
  const style = (NODE_STYLES[data.type] || NODE_STYLES.custom) as NonNullable<(typeof NODE_STYLES)[string]>;
  const Icon = style.icon;
  const status = data.metadata?.status;

  return (
    <div
      className={`relative flex min-w-[160px] items-center gap-3 rounded-lg border ${style.border} ${style.bg} bg-card/80 px-3 py-2.5 shadow-sm backdrop-blur-sm`}
    >
      <Handle type="target" position={Position.Top} id="top" className="!border-border !bg-background !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!border-border !bg-background !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="left" className="!border-border !bg-background !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="right" className="!border-border !bg-background !w-2 !h-2" />

      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${style.bg}`}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : status === 'deprecated' ? 'bg-muted-foreground' : 'bg-amber-500'}`} />
          <span className="text-xs font-medium truncate max-w-[100px]">{data.label}</span>
        </div>
        <div className="text-[10px] text-muted-foreground">{style.label}</div>
      </div>
    </div>
  );
}

export const ArchNode = memo(({ data }: NodeProps) => {
  return <BaseNode data={data as unknown as ArchNodeData} />;
});

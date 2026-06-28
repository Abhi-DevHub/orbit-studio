'use client';

import { useState, useCallback } from 'react';
import { Search, Monitor, Server, Cpu, Boxes, Database, Zap, HardDrive, Box, Container, CloudLightning, Cloud, Waypoints, Network, Globe, Webhook, Shield, Key, MessageSquare, Brain, Activity, Puzzle, Component } from 'lucide-react';
import { NODE_LIBRARY_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const NODE_ICONS: Record<string, typeof Monitor> = {
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

export function NodeLibrary() {
  const [search, setSearch] = useState('');

  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const filteredCategories = NODE_LIBRARY_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="p-3">
      <div className="mb-3 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
        Components
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-input bg-background py-1.5 pl-7 pr-2.5 text-xs outline-none focus:border-ring transition-colors duration-150 placeholder:text-muted-foreground/50"
        />
      </div>

      <div className="space-y-3">
        {filteredCategories.map((category) => (
          <div key={category.name}>
            <div className="mb-1 px-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {category.name}
            </div>
            <div className="space-y-0.5">
              {category.items.map((item) => {
                const Icon = NODE_ICONS[item.type] || Component;
                return (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, item.type)}
                    className="flex cursor-grab items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground active:cursor-grabbing"
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

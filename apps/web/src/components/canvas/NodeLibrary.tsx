'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { NODE_LIBRARY_CATEGORIES } from '@/lib/constants';

const NODE_ICONS: Record<string, string> = {
  frontend: '◻', backend: '◼', worker: '⚙', microservice: '◆',
  database: '🗄', cache: '⚡', storage: '💾',
  docker: '🐳', kubernetes: '☸', lambda: 'λ', cloud: '☁',
  gateway: '⇋', api: '🔗', cdn: '🌐', webhook: '↗',
  auth: '🔒', secrets: '🔑',
  queue: '📨',
  'ai-model': '🧠',
  monitoring: '📊',
  'third-party': '🧩', custom: '✦',
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
      <div className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Components
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-ring"
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {filteredCategories.map((category) => (
          <div key={category.name}>
            <div className="mb-1 px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {category.name}
            </div>
            <div className="space-y-0.5">
              {category.items.map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.type)}
                  className="flex cursor-grab items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:cursor-grabbing"
                >
                  <span className="text-sm">{NODE_ICONS[item.type] || '□'}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { OrbitNode } from './node-types';

export interface LayoutConfig {
  startX: number;
  startY: number;
  columnWidth: number;
  rowHeight: number;
  columns: number;
}

export function autoLayout(
  nodes: OrbitNode[],
  config: Partial<LayoutConfig> = {},
): OrbitNode[] {
  const {
    startX = 100,
    startY = 100,
    columnWidth = 300,
    rowHeight = 150,
    columns = 3,
  } = config;

  return nodes.map((node, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);

    return {
      ...node,
      position: {
        x: startX + column * columnWidth,
        y: startY + row * rowHeight,
      },
    };
  });
}

export function getNodeTypeCategory(type: string): string {
  const categories: Record<string, string> = {
    frontend: 'application',
    backend: 'application',
    database: 'data',
    api: 'network',
    gateway: 'network',
    auth: 'security',
    cache: 'data',
    queue: 'queue',
    worker: 'application',
    storage: 'data',
    cdn: 'network',
    lambda: 'infrastructure',
    kubernetes: 'infrastructure',
    docker: 'infrastructure',
    cloud: 'infrastructure',
    'ai-model': 'ai',
    monitoring: 'monitoring',
    secrets: 'security',
    webhook: 'network',
    'third-party': 'network',
    custom: 'application',
  };

  return categories[type] || 'application';
}

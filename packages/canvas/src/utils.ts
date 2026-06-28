import type { OrbitNode, OrbitNodeData } from './node-types';

let nodeCounter = 0;

export function generateNodeId(): string {
  return `node_${Date.now()}_${++nodeCounter}`;
}

export function createDefaultNode(type: OrbitNode['data']['type'], label: string): OrbitNode {
  return {
    id: generateNodeId(),
    type: 'default',
    position: { x: 0, y: 0 },
    data: {
      label,
      type,
      metadata: { status: 'planned' },
    },
  };
}

export function calculateNodeBounds(nodes: OrbitNode[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  return nodes.reduce(
    (bounds, node) => ({
      minX: Math.min(bounds.minX, node.position.x),
      minY: Math.min(bounds.minY, node.position.y),
      maxX: Math.max(bounds.maxX, node.position.x + 200),
      maxY: Math.max(bounds.maxY, node.position.y + 80),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );
}

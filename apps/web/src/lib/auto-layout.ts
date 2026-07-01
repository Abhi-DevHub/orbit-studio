import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';

interface LayoutOptions {
  direction?: 'TB' | 'LR' | 'BT' | 'RL';
  nodeWidth?: number;
  nodeHeight?: number;
  nodesep?: number;
  ranksep?: number;
  margin?: number;
}

const DEFAULT_NODE_WIDTH = 200;
const DEFAULT_NODE_HEIGHT = 80;
const FLOATING_GRID_COLS = 5;

function areNodesConnected(node: Node, edges: Edge[]): boolean {
  return edges.some((e) => e.source === node.id || e.target === node.id);
}

export function autoLayout(
  nodes: Node[],
  edges: Edge[],
  opts: LayoutOptions = {},
): Node[] {
  if (nodes.length === 0) return [];

  const {
    direction = 'TB',
    nodeWidth = DEFAULT_NODE_WIDTH,
    nodeHeight = DEFAULT_NODE_HEIGHT,
    nodesep = 80,
    ranksep = 120,
    margin = 50,
  } = opts;

  const connected: Node[] = [];
  const floating: Node[] = [];

  for (const node of nodes) {
    if (areNodesConnected(node, edges)) {
      connected.push(node);
    } else {
      floating.push(node);
    }
  }

  const laidOut: Node[] = [];

  if (connected.length > 0) {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({
      rankdir: direction,
      nodesep,
      ranksep,
      marginx: margin,
      marginy: margin,
    });

    connected.forEach((node) => {
      g.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    for (const node of connected) {
      const pos = g.node(node.id);
      laidOut.push({
        ...node,
        position: {
          x: pos.x - nodeWidth / 2,
          y: pos.y - nodeHeight / 2,
        },
      });
    }
  }

  if (floating.length > 0) {
    let baseY = 0;
    if (connected.length > 0) {
      const minY = Math.min(...laidOut.map((n) => n.position.y));
      const maxY = Math.max(...laidOut.map((n) => n.position.y + nodeHeight));
      baseY = maxY + ranksep;
    }

    const gridWidth = FLOATING_GRID_COLS * (nodeWidth + nodesep) - nodesep + margin * 2;

    floating.forEach((node, i) => {
      const col = i % FLOATING_GRID_COLS;
      const row = Math.floor(i / FLOATING_GRID_COLS);
      laidOut.push({
        ...node,
        position: {
          x: margin + col * (nodeWidth + nodesep),
          y: baseY + row * (nodeHeight + ranksep),
        },
      });
    });
  }

  return laidOut;
}

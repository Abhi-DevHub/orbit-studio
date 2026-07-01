import type { Node, Edge } from '@xyflow/react';

const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',
  planned: '#f59e0b',
  deprecated: '#ef4444',
};

export interface ParseResult {
  nodes: Node[];
  edges: Edge[];
  errors: string[];
}

export function parseDSL(code: string): ParseResult {
  const lines = code.split('\n');
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const errors: string[] = [];
  const groupStack: string[] = [];
  const declaredNodes = new Set<string>();

  let nodeCounter = 0;
  let edgeCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (raw === undefined) continue;
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;

    if (line === '}') {
      if (groupStack.length > 0) groupStack.pop();
      continue;
    }

    const groupMatch = line.match(/^Group\s+"([^"]+)"\s*\{$/);
    if (groupMatch && groupMatch[1]) {
      groupStack.push(groupMatch[1]);
      continue;
    }

    const edgeMatch = line.match(/^([\w\s-]+?)\s*(->|<>|<--|-->)\s*([\w\s-]+?)(?::\s*(.+))?$/);
    if (edgeMatch && edgeMatch[1] && edgeMatch[3]) {
      const source = edgeMatch[1].trim();
      const target = edgeMatch[3].trim();
      const label = edgeMatch[4]?.trim() || '';

      if (!declaredNodes.has(source)) {
        nodes.push(makeNode(source, `n_${nodeCounter++}`));
        declaredNodes.add(source);
      }
      if (!declaredNodes.has(target)) {
        nodes.push(makeNode(target, `n_${nodeCounter++}`));
        declaredNodes.add(target);
      }

      const sourceNode = [...nodes].reverse().find((n) => n.data?.label === source);
      const targetNode = [...nodes].reverse().find((n) => n.data?.label === target);

      if (sourceNode && targetNode) {
        edges.push(makeEdge(sourceNode.id, targetNode.id, label, `e_${edgeCounter++}`));
      }
      continue;
    }

    const nodeMatch = line.match(/^([\w\s-]+?)(?:\s*\[(.+)\])?$/);
    if (nodeMatch && nodeMatch[1]) {
      const name = nodeMatch[1].trim();
      const propsStr = nodeMatch[2] || '';
      const props = parseProps(propsStr);
      const id = `n_${nodeCounter++}`;

      nodes.push(makeNode(name, id, props));
      declaredNodes.add(name);
      continue;
    }

    errors.push(`Line ${i + 1}: Could not parse "${line}"`);
  }

  return { nodes, edges, errors };
}

function parseProps(str: string): Record<string, string> {
  const props: Record<string, string> = {};
  str.split(',').forEach((part) => {
    const [k, ...v] = part.trim().split(':');
    if (k && v.length) props[k.trim()] = v.join(':').trim();
  });
  return props;
}

function makeNode(
  label: string,
  id: string,
  props: Record<string, string> = {},
): Node {
  const iconType = props.icon || 'custom';
  const status = props.status || 'planned';
  const statusColor = STATUS_COLORS[status] || STATUS_COLORS.planned;

  return {
    id,
    type: 'archNode',
    position: { x: Math.random() * 300, y: Math.random() * 300 },
    data: {
      label,
      type: iconType,
      metadata: {
        status,
        provider: props.provider || '',
        description: props.description || '',
        color: props.color || '',
      },
    },
  };
}

function makeEdge(
  source: string,
  target: string,
  label: string,
  id: string,
): Edge {
  return {
    id,
    source,
    target,
    type: 'smoothstep',
    label,
    style: { stroke: '#B9915E', strokeWidth: 1 },
    labelStyle: { fill: '#B9915E', fontSize: 10 },
  };
}

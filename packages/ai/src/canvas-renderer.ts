import type { ArchitectureNode, ArchitectureEdge } from '@orbit/config';

export class CanvasRenderer {
  render(agentResults: any[]): { nodes: ArchitectureNode[]; edges: ArchitectureEdge[] } {
    const nodes: ArchitectureNode[] = [];
    const edges: ArchitectureEdge[] = [];

    const architectResult = agentResults.find((r) => r.data?.services);
    if (!architectResult) return { nodes, edges };

    const services = architectResult.data.services as any[] || [];
    const spacing = { x: 300, y: 150 };
    const startX = 100;
    const startY = 100;

    services.forEach((service: any, index: number) => {
      const column = index % 3;
      const row = Math.floor(index / 3);

      const node: ArchitectureNode = {
        id: service.id || `service-${index}`,
        type: service.type || 'backend',
        position: {
          x: startX + column * spacing.x,
          y: startY + row * spacing.y,
        },
        data: {
          label: service.name || `Service ${index + 1}`,
          description: service.description || '',
          metadata: {
            status: 'planned',
          },
        },
      };
      nodes.push(node);
    });

    // Create edges from service dependencies
    services.forEach((service: any) => {
      if (service.dependencies) {
        service.dependencies.forEach((dep: string) => {
          if (nodes.some((n) => n.id === dep)) {
            edges.push({
              id: `edge-${dep}-${service.id}`,
              source: dep,
              target: service.id,
              type: 'smoothstep',
            });
          }
        });
      }
    });

    return { nodes, edges };
  }
}

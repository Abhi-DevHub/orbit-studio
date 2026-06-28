import { ArchitectureAnalyzer } from './analyzer';
import type { ArchitectureNode, ArchitectureEdge, ProactiveSuggestion } from '@orbit/config';

export class ArchitectureCopilot {
  private analyzer: ArchitectureAnalyzer;

  constructor() {
    this.analyzer = new ArchitectureAnalyzer();
  }

  async processMessage(input: {
    message: string;
    canvasContext: { nodes: ArchitectureNode[]; edges: ArchitectureEdge[] };
    projectId: string;
  }) {
    const intent = this.classifyIntent(input.message);
    const actions: any[] = [];

    switch (intent) {
      case 'add-component':
        actions.push(await this.handleAddComponent(input));
        break;
      case 'modify-component':
        actions.push(await this.handleModifyComponent(input));
        break;
      case 'analyze':
        return this.analyzer.analyze(input.canvasContext.nodes, input.canvasContext.edges);
      case 'explain':
        return { type: 'explain', response: await this.generateExplanation(input.message, input.canvasContext) };
      default:
        return { type: 'chat', response: await this.generateChatResponse(input.message, input.canvasContext) };
    }

    return {
      response: this.buildResponseMessage(intent, actions),
      canvasUpdates: actions.length > 0 ? this.mergeActions(input.canvasContext, actions) : undefined,
      actions,
    };
  }

  async getSuggestions(nodes: ArchitectureNode[], edges: ArchitectureEdge[]): Promise<{ suggestions: ProactiveSuggestion[] }> {
    const issues = await this.analyzer.analyze(nodes, edges);
    const suggestions: ProactiveSuggestion[] = [];

    if (issues.issues.some((i) => i.type === 'performance' && i.severity === 'critical')) {
      suggestions.push({
        id: 'suggest-cache',
        type: 'optimization',
        title: 'Add Cache Layer',
        description: 'Consider adding Redis cache to reduce database load',
        impact: 'Reduce latency by 60-80%',
        action: { type: 'add-node', payload: { type: 'cache', data: { label: 'Redis Cache' } } },
      });
    }

    return { suggestions };
  }

  private classifyIntent(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('add') || lower.includes('insert') || lower.includes('include')) return 'add-component';
    if (lower.includes('replace') || lower.includes('change') || lower.includes('modify') || lower.includes('update')) return 'modify-component';
    if (lower.includes('analyze') || lower.includes('review') || lower.includes('check') || lower.includes('issue')) return 'analyze';
    if (lower.includes('explain') || lower.includes('why') || lower.includes('what is') || lower.includes('how does')) return 'explain';
    return 'chat';
  }

  private async handleAddComponent(input: any) {
    return { type: 'add-node', payload: { type: 'database', data: { label: 'PostgreSQL' }, position: { x: 400, y: 300 } } };
  }

  private async handleModifyComponent(input: any) {
    return { type: 'modify-node', payload: { id: 'existing-node', data: { label: 'Modified Component' } } };
  }

  private async generateExplanation(message: string, context: any): Promise<string> {
    return `Based on your architecture, this component handles ${context.nodes.length > 0 ? 'the core functionality' : 'data processing'}. Common alternatives include managed cloud services or open-source solutions.`;
  }

  private async generateChatResponse(message: string, context: any): Promise<string> {
    return `I understand you're asking about "${message}". Looking at your architecture with ${context.nodes.length} components and ${context.edges.length} connections, I can help you optimize and extend it.`;
  }

  private buildResponseMessage(intent: string, actions: any[]): string {
    if (actions.length === 0) return 'I understand your request. How would you like to proceed?';
    return `I've made ${actions.length} change${actions.length > 1 ? 's' : ''} to your architecture. You can review and modify them.`;
  }

  private mergeActions(context: any, actions: any[]) {
    let { nodes, edges } = context;
    for (const action of actions) {
      if (action.type === 'add-node') {
        nodes = [...nodes, { id: `node_${Date.now()}`, ...action.payload }];
      }
    }
    return { nodes, edges };
  }
}

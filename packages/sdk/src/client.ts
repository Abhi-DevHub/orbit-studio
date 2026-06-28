import type { CreateProjectInput, GenerateArchitectureInput, AiChatInput, ExportInput } from './types';

export class OrbitClient {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async request(path: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    const res = await fetch(`${this.baseUrl}/api/trpc/${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      throw new Error(`Orbit API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  // Projects
  async listProjects() {
    return this.request('project.list');
  }

  async getProject(id: string) {
    return this.request(`project.getById?input=${JSON.stringify({ id })}`);
  }

  async createProject(input: CreateProjectInput) {
    return this.request('project.create', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // AI
  async generateArchitecture(input: GenerateArchitectureInput) {
    return this.request('ai.generateArchitecture', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async chat(input: AiChatInput) {
    return this.request('ai.chat', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // Canvas
  async saveCanvasState(projectId: string, nodes: any[], edges: any[]) {
    return this.request('canvas.saveState', {
      method: 'POST',
      body: JSON.stringify({ projectId, nodes, edges }),
    });
  }

  // Export
  async export(input: ExportInput) {
    return this.request('export.' + input.format, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  templateId?: string;
}

export interface GenerateArchitectureInput {
  projectId: string;
  prompt: string;
}

export interface AiChatInput {
  projectId: string;
  conversationId?: string;
  message: string;
  canvasContext: {
    nodes: any[];
    edges: any[];
  };
}

export interface ExportInput {
  projectId: string;
  format: 'mermaid' | 'plantuml' | 'drawio' | 'png' | 'svg' | 'pdf' | 'markdown' | 'terraform';
}

import { create } from 'zustand';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AgentStatus {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
}

interface Suggestion {
  id: string;
  type: 'improvement' | 'warning' | 'optimization' | 'security' | 'cost';
  title: string;
  description: string;
}

interface AIState {
  messages: Message[];
  isGenerating: boolean;
  pipelineStatus: AgentStatus[];
  suggestions: Suggestion[];

  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setIsGenerating: (generating: boolean) => void;
  setPipelineStatus: (status: AgentStatus[]) => void;
  updateAgentStatus: (agent: string, status: AgentStatus['status']) => void;
  setSuggestions: (suggestions: Suggestion[]) => void;
  clearChat: () => void;
  runPipeline: () => void;
}

const AGENTS = ['Planner', 'Requirements', 'Architect', 'Database', 'API', 'Infrastructure', 'Security', 'Reviewer'];

function delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

export const useAIStore = create<AIState>((set, get) => ({
  messages: [],
  isGenerating: false,
  pipelineStatus: [],
  suggestions: [],

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setPipelineStatus: (status) => set({ pipelineStatus: status }),
  updateAgentStatus: (agent, status) =>
    set((state) => ({
      pipelineStatus: state.pipelineStatus.map((a) =>
        a.name === agent ? { ...a, status } : a,
      ),
    })),
  setSuggestions: (suggestions) => set({ suggestions }),
  clearChat: () => set({ messages: [], pipelineStatus: [], suggestions: [] }),

  runPipeline: async () => {
    const { isGenerating } = get();
    if (isGenerating) return;

    set({ isGenerating: true, suggestions: [] });
    const pipeline = AGENTS.map((name) => ({ name, status: 'pending' as const }));
    set({ pipelineStatus: pipeline });

    for (const agentName of AGENTS) {
      get().updateAgentStatus(agentName, 'running');
      await delay(800 + Math.random() * 700);

      if (agentName === 'Planner') {
        get().addMessage({
          id: `sys_${Date.now()}`,
          role: 'system',
          content: '**Plan**: 3-tier architecture with React frontend, Node.js API, PostgreSQL database, Redis cache, and Docker deployment.',
          timestamp: new Date(),
        });
      }
      if (agentName === 'Architect') {
        get().addMessage({
          id: `sys_${Date.now()}`,
          role: 'assistant',
          content: 'Architecture designed with 8 components: Frontend → API Gateway → Backend → Database, with Redis caching layer and Docker containers.',
          timestamp: new Date(),
        });
      }

      get().updateAgentStatus(agentName, 'completed');
    }

    set({
      suggestions: [
        { id: 's1', type: 'optimization', title: 'Add CDN layer', description: 'A CDN could reduce static asset latency by 60% for global users.' },
        { id: 's2', type: 'security', title: 'Enable WAF', description: 'A Web Application Firewall would protect against common attack vectors.' },
      ],
      isGenerating: false,
    });
  },
}));

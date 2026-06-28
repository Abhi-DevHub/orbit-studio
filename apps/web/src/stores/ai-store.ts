import { create } from 'zustand';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
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

export const useAIStore = create<AIState>((set) => ({
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
}));

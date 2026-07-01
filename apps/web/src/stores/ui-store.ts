import { create } from 'zustand';

type WorkspaceMode = 'canvas' | 'dac' | 'docs';

interface UIState {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  aiPanelOpen: boolean;
  commandPaletteOpen: boolean;
  activeRightPanel: 'properties' | 'ai' | 'chat' | 'documentation';
  workspaceMode: WorkspaceMode;
  theme: string;

  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  toggleAIPanel: () => void;
  toggleCommandPalette: () => void;
  setActiveRightPanel: (panel: UIState['activeRightPanel']) => void;
  setWorkspaceMode: (mode: WorkspaceMode) => void;
  setTheme: (theme: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  rightPanelOpen: true,
  aiPanelOpen: false,
  commandPaletteOpen: false,
  activeRightPanel: 'properties',
  workspaceMode: 'canvas',
  theme: 'light',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  toggleAIPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  setActiveRightPanel: (panel) => set({ activeRightPanel: panel }),
  setWorkspaceMode: (mode) => set({ workspaceMode: mode }),
  setTheme: (theme) => set({ theme }),
}));

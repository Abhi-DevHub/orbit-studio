import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  aiPanelOpen: boolean;
  commandPaletteOpen: boolean;
  activeRightPanel: 'properties' | 'ai' | 'chat' | 'documentation';
  theme: 'dark' | 'light';

  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  toggleAIPanel: () => void;
  toggleCommandPalette: () => void;
  setActiveRightPanel: (panel: UIState['activeRightPanel']) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  rightPanelOpen: true,
  aiPanelOpen: false,
  commandPaletteOpen: false,
  activeRightPanel: 'properties',
  theme: 'dark',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  toggleAIPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  setActiveRightPanel: (panel) => set({ activeRightPanel: panel }),
  setTheme: (theme) => set({ theme }),
}));

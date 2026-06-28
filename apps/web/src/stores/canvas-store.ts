import { create } from 'zustand';
import type { Node, Edge, Viewport } from '@xyflow/react';

interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  viewport: Viewport | null;
  history: { nodes: Node[]; edges: Edge[] }[];
  historyIndex: number;
  isSaving: boolean;

  addNode: (node: Node) => void;
  updateNode: (id: string, data: Partial<Node>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (id: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  selectNode: (id: string | null) => void;
  setViewport: (viewport: Viewport) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  setIsSaving: (saving: boolean) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  viewport: null,
  history: [],
  historyIndex: -1,
  isSaving: false,

  addNode: (node) => {
    get().pushHistory();
    set((state) => ({ nodes: [...state.nodes, node] }));
  },

  updateNode: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    }));
  },

  removeNode: (id) => {
    get().pushHistory();
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNode: state.selectedNode === id ? null : state.selectedNode,
    }));
  },

  addEdge: (edge) => {
    get().pushHistory();
    set((state) => ({ edges: [...state.edges, edge] }));
  },

  removeEdge: (id) => {
    get().pushHistory();
    set((state) => ({ edges: state.edges.filter((e) => e.id !== id) }));
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  selectNode: (id) => set({ selectedNode: id }),

  setViewport: (viewport) => set({ viewport }),

  pushHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    if (newHistory.length > 50) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < 0) return;
    const snapshot = history[historyIndex];
    if (snapshot) {
      set({
        nodes: snapshot.nodes,
        edges: snapshot.edges,
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 2) return;
    const snapshot = history[historyIndex + 2];
    if (snapshot) {
      set({
        nodes: snapshot.nodes,
        edges: snapshot.edges,
        historyIndex: historyIndex + 1,
      });
    }
  },

  clearCanvas: () => {
    get().pushHistory();
    set({ nodes: [], edges: [], selectedNode: null });
  },

  setIsSaving: (saving) => set({ isSaving: saving }),
}));

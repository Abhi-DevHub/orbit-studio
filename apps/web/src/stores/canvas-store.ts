import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, type Node, type Edge, type NodeChange, type EdgeChange, type Connection, type Viewport } from '@xyflow/react';

interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  viewport: Viewport | null;
  history: { nodes: Node[]; edges: Edge[] }[];
  historyIndex: number;
  isSaving: boolean;
  lastSaved: Date | null;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, data: Partial<Node>) => void;
  removeNode: (id: string) => void;
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
  setLastSaved: (date: Date) => void;
  hydrate: (nodes: Node[], edges: Edge[]) => void;
  toJson: () => string;
  fromJson: (json: string) => void;
}

const MAX_HISTORY = 50;

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  viewport: null,
  history: [],
  historyIndex: -1,
  isSaving: false,
  lastSaved: null,

  onNodesChange: (changes) => {
    const hasStructural = changes.some((c) => c.type === 'add' || c.type === 'remove');
    if (hasStructural) get().pushHistory();
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as Node[],
    }));
  },

  onEdgesChange: (changes) => {
    const hasRemove = changes.some((c) => c.type === 'remove' || c.type === 'add');
    if (hasRemove) get().pushHistory();
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges) as Edge[],
    }));
  },

  onConnect: (connection) => {
    get().pushHistory();
    const newEdge: Edge = {
      ...connection,
      id: `edge_${Date.now()}`,
      type: 'smoothstep',
      style: { stroke: '#B9915E', strokeWidth: 1 },
    } as Edge;
    set((state) => ({ edges: [...state.edges, newEdge] }));
  },

  addNode: (node) => {
    get().pushHistory();
    set((state) => ({ nodes: [...state.nodes, node] }));
  },

  updateNode: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...data, data: { ...n.data, ...(data.data || {}) } } : n)),
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
    const snapshot = { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < 0) return;
    const snapshot = history[historyIndex];
    if (snapshot) {
      set({ nodes: snapshot.nodes, edges: snapshot.edges, historyIndex: historyIndex - 1, selectedNode: null });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 2) return;
    const snapshot = history[historyIndex + 2];
    if (snapshot) {
      set({ nodes: snapshot.nodes, edges: snapshot.edges, historyIndex: historyIndex + 1, selectedNode: null });
    }
  },

  clearCanvas: () => {
    get().pushHistory();
    set({ nodes: [], edges: [], selectedNode: null });
  },

  setIsSaving: (saving) => set({ isSaving: saving }),
  setLastSaved: (date) => set({ lastSaved: date }),

  hydrate: (nodes, edges) => {
    set({ nodes, edges, selectedNode: null, history: [], historyIndex: -1 });
  },

  toJson: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges });
  },

  fromJson: (json) => {
    try {
      const data = JSON.parse(json);
      if (data.nodes && data.edges) {
        set({ nodes: data.nodes, edges: data.edges, selectedNode: null, history: [], historyIndex: -1 });
      }
    } catch { /* ignore */ }
  },
}));

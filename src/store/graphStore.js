import { create } from 'zustand';

export const useGraphStore = create((set, get) => ({
  edges: [],
  nodes: [],
  rootNode: null,
  algorithm: 'DFS',
  traversalState: {
    visited: new Set(),
    current: null,
    queue: [],
    stack: [],
    isRunning: false,
    isComplete: false
  },

  setEdges: (edges) => {
    const nodeSet = new Set();
    edges.forEach(([from, to]) => {
      nodeSet.add(from);
      nodeSet.add(to);
    });
    const nodes = Array.from(nodeSet).map(id => ({
      id,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { label: id }
    }));
    
    set({ 
      edges: edges.map(([from, to], index) => ({
        id: `${from}-${to}-${index}`,
        source: from,
        target: to
      })),
      nodes,
      rootNode: null,
      traversalState: {
        visited: new Set(),
        current: null,
        queue: [],
        stack: [],
        isRunning: false,
        isComplete: false
      }
    });
  },

  setRootNode: (nodeId) => set({ rootNode: nodeId }),
  
  setAlgorithm: (algorithm) => set({ algorithm }),

  resetTraversal: () => set({
    traversalState: {
      visited: new Set(),
      current: null,
      queue: [],
      stack: [],
      isRunning: false,
      isComplete: false
    }
  }),

  updateTraversalState: (newState) => set({
    traversalState: { ...get().traversalState, ...newState }
  })
}));
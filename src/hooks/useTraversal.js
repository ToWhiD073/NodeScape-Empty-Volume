import { useCallback } from 'react';
import { useGraphStore } from '../store/graphStore';

export const useTraversal = () => {
  const { 
    edges, 
    rootNode, 
    algorithm, 
    traversalState, 
    updateTraversalState, 
    resetTraversal 
  } = useGraphStore();

  const buildAdjacencyList = useCallback(() => {
    const adjList = {};
    edges.forEach(({ source, target }) => {
      if (!adjList[source]) adjList[source] = [];
      if (!adjList[target]) adjList[target] = [];
      adjList[source].push(target);
      adjList[target].push(source);
    });
    return adjList;
  }, [edges]);

  const startTraversal = useCallback(() => {
    if (!rootNode) return;
    
    resetTraversal();
    const adjList = buildAdjacencyList();
    
    if (algorithm === 'DFS') {
      updateTraversalState({
        stack: [rootNode],
        isRunning: true
      });
    } else {
      updateTraversalState({
        queue: [rootNode],
        isRunning: true
      });
    }
  }, [rootNode, algorithm, buildAdjacencyList, resetTraversal, updateTraversalState]);

  const stepTraversal = useCallback(() => {
    if (!traversalState.isRunning || traversalState.isComplete) return;

    const adjList = buildAdjacencyList();
    const { visited, stack, queue } = traversalState;
    
    let nextNode;
    let newStack = [...stack];
    let newQueue = [...queue];

    if (algorithm === 'DFS') {
      if (stack.length === 0) {
        updateTraversalState({ isComplete: true, isRunning: false });
        return;
      }
      nextNode = newStack.pop();
    } else {
      if (queue.length === 0) {
        updateTraversalState({ isComplete: true, isRunning: false });
        return;
      }
      nextNode = newQueue.shift();
    }

    if (visited.has(nextNode)) {
      updateTraversalState({ stack: newStack, queue: newQueue });
      return;
    }

    const newVisited = new Set(visited);
    newVisited.add(nextNode);

    const neighbors = adjList[nextNode] || [];
    neighbors.forEach(neighbor => {
      if (!newVisited.has(neighbor)) {
        if (algorithm === 'DFS') {
          newStack.push(neighbor);
        } else {
          newQueue.push(neighbor);
        }
      }
    });

    updateTraversalState({
      visited: newVisited,
      current: nextNode,
      stack: newStack,
      queue: newQueue
    });
  }, [algorithm, traversalState, buildAdjacencyList, updateTraversalState]);

  return { startTraversal, stepTraversal };
};
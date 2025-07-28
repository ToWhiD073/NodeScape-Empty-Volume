import React, { useMemo } from 'react';
import { Card } from 'antd';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { useGraphStore } from '../store/graphStore';

export const GraphVisualizer = () => {
  const { nodes, edges, traversalState } = useGraphStore();

  const styledNodes = useMemo(() => {
    return nodes.map(node => {
      let backgroundColor = '#f0f0f0';
      let color = 'black';
      
      if (traversalState.visited.has(node.id)) {
        backgroundColor = '#52c41a'; // Green for visited
        color = 'white';
      } else if (traversalState.current === node.id) {
        backgroundColor = '#1890ff'; // Blue for current
        color = 'white';
      }
      
      return {
        ...node,
        style: {
          backgroundColor,
          color,
          border: '2px solid #d9d9d9',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      };
    });
  }, [nodes, traversalState]);

  const styledEdges = useMemo(() => {
    return edges.map(edge => ({
      ...edge,
      style: {
        stroke: traversalState.currentEdge === edge.id ? '#ff4d4f' : '#d9d9d9',
        strokeWidth: traversalState.currentEdge === edge.id ? 3 : 2
      }
    }));
  }, [edges, traversalState.currentEdge]);

  if (nodes.length === 0) {
    return (
      <Card title="Graph Visualization">
        <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Please input a graph to visualize
        </div>
      </Card>
    );
  }

  return (
    <Card title="Graph Visualization">
      <div style={{ height: 400 }}>
        <ReactFlow
          nodes={styledNodes}
          edges={styledEdges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </Card>
  );
};
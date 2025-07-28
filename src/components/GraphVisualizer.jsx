import React, { useMemo } from 'react';
import { Card } from 'antd';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { useGraphStore } from '../store/graphStore';

export const GraphVisualizer = () => {
  const { nodes, edges, traversalState } = useGraphStore();

  const styledNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      style: {
        backgroundColor: traversalState.visited.has(node.id) 
          ? '#52c41a' 
          : traversalState.current === node.id 
          ? '#1890ff' 
          : '#f0f0f0',
        color: traversalState.visited.has(node.id) || traversalState.current === node.id 
          ? 'white' 
          : 'black',
        border: '2px solid #d9d9d9',
        borderRadius: '50%',
        width: 60,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold'
      }
    }));
  }, [nodes, traversalState]);

  const styledEdges = useMemo(() => {
    return edges.map(edge => ({
      ...edge,
      style: {
        stroke: '#d9d9d9',
        strokeWidth: 2
      }
    }));
  }, [edges]);

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
import React, { useMemo } from 'react';
import { Card } from 'antd';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { useGraphStore } from '../store/graphStore';

export const GraphVisualizer = () => {
  const { nodes, edges, traversalState } = useGraphStore();

  const styledNodes = useMemo(() => {
    return nodes.map(node => {
      let background, borderColor, boxShadow;
      let color = 'white';
      
      if (traversalState.visited.has(node.id)) {
        background = 'linear-gradient(135deg, #52c41a, #389e0d)';
        borderColor = '#389e0d';
        boxShadow = '0 4px 12px rgba(82, 196, 26, 0.4)';
      } else if (traversalState.current === node.id) {
        background = 'linear-gradient(135deg, #1890ff, #096dd9)';
        borderColor = '#096dd9';
        boxShadow = '0 4px 12px rgba(24, 144, 255, 0.4)';
      } else {
        background = 'linear-gradient(135deg, #ffffff, #f0f0f0)';
        borderColor = '#d9d9d9';
        boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        color = '#333';
      }
      
      return {
        ...node,
        style: {
          background,
          color,
          border: `3px solid ${borderColor}`,
          borderRadius: '50%',
          width: 35,
          height: 35,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '600',
          boxShadow,
          transition: 'all 0.3s ease'
        }
      };
    });
  }, [nodes, traversalState]);

  const styledEdges = useMemo(() => {
    return edges.map(edge => ({
      ...edge,
      type: 'straight',
      style: {
        stroke: traversalState.currentEdge === edge.id ? '#ff4d4f' : '#8c8c8c',
        strokeWidth: traversalState.currentEdge === edge.id ? 4 : 2,
        strokeDasharray: traversalState.currentEdge === edge.id ? '0' : '0',
        filter: traversalState.currentEdge === edge.id ? 'drop-shadow(0 2px 4px rgba(255, 77, 79, 0.3))' : 'none'
      },
      labelStyle: {
        fontSize: '11px',
        fontWeight: '600',
        fill: '#666',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '2px 6px',
        borderRadius: '4px'
      }
    }));
  }, [edges, traversalState.currentEdge]);

  if (nodes.length === 0) {
    return (
      <Card 
        title="Graph Visualization" 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ 
          height: 400, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
          borderRadius: '8px',
          color: '#666',
          fontSize: '16px'
        }}>
          Please input a graph to visualize
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="Graph Visualization" 
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ 
        height: 400, 
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <ReactFlow
          nodes={styledNodes}
          edges={styledEdges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background 
            color="rgba(255, 255, 255, 0.2)"
            gap={20}
            size={1}
          />
          <Controls 
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
        </ReactFlow>
      </div>
    </Card>
  );
};
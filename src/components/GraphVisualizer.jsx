import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert } from 'antd';
import { useGraphStore } from '../store/graphStore';

export const GraphVisualizer = () => {
  const { nodes, edges, traversalState } = useGraphStore();
  const [graphImage, setGraphImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateGraph = async () => {
    if (edges.length === 0) {
      setGraphImage(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data for Python backend
      const graphData = {
        edges: edges.map(edge => [edge.source, edge.target]),
        visited_nodes: Array.from(traversalState.visited),
        current_node: traversalState.current,
        current_edge: traversalState.currentEdge
      };

      const response = await fetch('http://localhost:5000/generate_graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphData)
      });

      const result = await response.json();

      if (result.success) {
        setGraphImage(result.image);
      } else {
        setError(result.error || 'Failed to generate graph');
      }
    } catch (err) {
      setError('Failed to connect to graph service. Make sure Python backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateGraph();
  }, [edges, traversalState.visited, traversalState.current, traversalState.currentEdge]);

  if (nodes.length === 0) {
    return (
      <Card 
        title="Graph Visualization" 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e8e8e8'
        }}
      >
        <div style={{ 
          height: 400, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f8fafc',
          borderRadius: '8px',
          color: '#64748b',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          Please input a graph to visualize
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="Graph Visualization (Python Generated)" 
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e8e8e8'
      }}
    >
      <div style={{ 
        minHeight: 400,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8fafc',
        borderRadius: '8px',
        padding: '20px'
      }}>
        {loading && (
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#64748b' }}>
              Generating beautiful graph...
            </div>
          </div>
        )}
        
        {error && (
          <Alert
            message="Graph Generation Error"
            description={
              <div>
                <p>{error}</p>
                <p style={{ marginTop: '8px', fontSize: '12px' }}>
                  To start the Python backend:
                  <br />
                  <code>pip install -r requirements.txt</code>
                  <br />
                  <code>python graph_generator.py</code>
                </p>
              </div>
            }
            type="error"
            showIcon
          />
        )}
        
        {graphImage && !loading && !error && (
          <img 
            src={graphImage} 
            alt="Graph Visualization" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '500px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }} 
          />
        )}
      </div>
    </Card>
  );
};
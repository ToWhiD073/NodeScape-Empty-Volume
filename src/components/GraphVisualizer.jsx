import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'antd';
import * as d3 from 'd3';
import { useGraphStore } from '../store/graphStore';

export const GraphVisualizer = () => {
  const { nodes, edges, traversalState, updateTraversalState } = useGraphStore();
  const svgRef = useRef();
  const [simulation, setSimulation] = useState(null);

  useEffect(() => {
    if (nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 450;

    // Create clean white background
    svg
      .attr('width', width)
      .attr('height', height)
      .style('background', '#ffffff')
      .style('border', '1px solid #e8e8e8')
      .style('border-radius', '8px');

    // Prepare data
    const graphNodes = nodes.map(node => ({
      id: node.id,
      x: node.position.x + 50,
      y: node.position.y + 50,
      fx: null,
      fy: null
    }));

    const graphEdges = edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      id: edge.id
    }));

    // Create force simulation
    const sim = d3.forceSimulation(graphNodes)
      .force('link', d3.forceLink(graphEdges).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(35));

    setSimulation(sim);

    // Create container groups
    const container = svg.append('g');
    const edgeGroup = container.append('g').attr('class', 'edges');
    const nodeGroup = container.append('g').attr('class', 'nodes');

    // Create edges
    const edgeElements = edgeGroup.selectAll('line')
      .data(graphEdges)
      .enter()
      .append('line')
      .attr('stroke', '#d1d5db')
      .attr('stroke-width', 2)
      .style('transition', 'all 0.3s ease');

    // Create nodes
    const nodeElements = nodeGroup.selectAll('g')
      .data(graphNodes)
      .enter()
      .append('g')
      .style('cursor', 'grab')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) sim.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
          d3.select(event.currentTarget).style('cursor', 'grabbing');
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) sim.alphaTarget(0);
          d.fx = null;
          d.fy = null;
          d3.select(event.currentTarget).style('cursor', 'grab');
        })
      );

    // Add node circles with modern styling
    nodeElements.append('circle')
      .attr('r', 25)
      .attr('fill', '#ffffff')
      .attr('stroke', '#6b7280')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))')
      .style('transition', 'all 0.3s ease');

    // Add node labels
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#374151')
      .attr('font-size', '16px')
      .attr('font-weight', '600')
      .attr('font-family', 'system-ui, -apple-system, sans-serif')
      .text(d => d.id)
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // Update positions on simulation tick
    sim.on('tick', () => {
      edgeElements
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      nodeElements
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    // Update styles based on traversal state
    const updateStyles = () => {
      // Update node styles
      nodeElements.select('circle')
        .attr('fill', d => {
          if (traversalState.visited.has(d.id)) return '#10b981';
          if (traversalState.current === d.id) return '#3b82f6';
          return '#ffffff';
        })
        .attr('stroke', d => {
          if (traversalState.visited.has(d.id)) return '#059669';
          if (traversalState.current === d.id) return '#2563eb';
          return '#6b7280';
        })
        .attr('stroke-width', d => {
          if (traversalState.visited.has(d.id) || traversalState.current === d.id) return 3;
          return 2;
        })
        .style('filter', d => {
          if (traversalState.visited.has(d.id) || traversalState.current === d.id) {
            return 'drop-shadow(0 4px 12px rgba(59,130,246,0.3))';
          }
          return 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))';
        });

      // Update node text color
      nodeElements.select('text')
        .attr('fill', d => {
          if (traversalState.visited.has(d.id) || traversalState.current === d.id) return '#ffffff';
          return '#374151';
        });

      // Update edge styles
      edgeElements
        .attr('stroke', d => {
          if (traversalState.currentEdge === d.id) return '#ef4444';
          return '#d1d5db';
        })
        .attr('stroke-width', d => {
          if (traversalState.currentEdge === d.id) return 4;
          return 2;
        })
        .style('filter', d => {
          if (traversalState.currentEdge === d.id) {
            return 'drop-shadow(0 2px 4px rgba(239,68,68,0.3))';
          }
          return 'none';
        });
    };

    updateStyles();

    // Cleanup
    return () => {
      if (sim) sim.stop();
    };

  }, [nodes, edges, traversalState]);

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
          height: 450, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f9fafb',
          borderRadius: '8px',
          color: '#6b7280',
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
      title="Graph Visualization" 
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e8e8e8'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        padding: '10px',
        background: '#f9fafb',
        borderRadius: '8px'
      }}>
        <svg ref={svgRef}></svg>
      </div>
    </Card>
  );
};
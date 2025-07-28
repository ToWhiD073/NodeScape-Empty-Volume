import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';
import * as d3 from 'd3';
import { useGraphStore } from '../store/graphStore';

export const GraphVisualizer = () => {
  const { nodes, edges, traversalState } = useGraphStore();
  const svgRef = useRef();

  useEffect(() => {
    if (nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 400;
    const margin = 40;

    // Create graph data
    const graphNodes = nodes.map(node => ({
      id: node.id,
      x: node.position.x,
      y: node.position.y
    }));

    const graphEdges = edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      id: edge.id
    }));

    // Create container
    const container = svg
      .attr('width', width)
      .attr('height', height)
      .style('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
      .style('border-radius', '12px');

    // Add glow filter
    const defs = container.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'glow');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Draw edges
    const edgeGroup = container.append('g').attr('class', 'edges');
    
    edgeGroup.selectAll('line')
      .data(graphEdges)
      .enter()
      .append('line')
      .attr('x1', d => {
        const sourceNode = graphNodes.find(n => n.id === d.source);
        return sourceNode ? sourceNode.x : 0;
      })
      .attr('y1', d => {
        const sourceNode = graphNodes.find(n => n.id === d.source);
        return sourceNode ? sourceNode.y : 0;
      })
      .attr('x2', d => {
        const targetNode = graphNodes.find(n => n.id === d.target);
        return targetNode ? targetNode.x : 0;
      })
      .attr('y2', d => {
        const targetNode = graphNodes.find(n => n.id === d.target);
        return targetNode ? targetNode.y : 0;
      })
      .attr('stroke', d => traversalState.currentEdge === d.id ? '#ff4d4f' : '#ffffff')
      .attr('stroke-width', d => traversalState.currentEdge === d.id ? 4 : 2)
      .attr('opacity', 0.8)
      .style('filter', d => traversalState.currentEdge === d.id ? 'url(#glow)' : 'none');

    // Draw nodes
    const nodeGroup = container.append('g').attr('class', 'nodes');
    
    const nodeElements = nodeGroup.selectAll('g')
      .data(graphNodes)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Add node circles
    nodeElements.append('circle')
      .attr('r', 20)
      .attr('fill', d => {
        if (traversalState.visited.has(d.id)) {
          return 'url(#visitedGradient)';
        } else if (traversalState.current === d.id) {
          return 'url(#currentGradient)';
        }
        return 'url(#defaultGradient)';
      })
      .attr('stroke', d => {
        if (traversalState.visited.has(d.id)) return '#389e0d';
        if (traversalState.current === d.id) return '#096dd9';
        return '#d9d9d9';
      })
      .attr('stroke-width', 3)
      .style('filter', d => {
        if (traversalState.visited.has(d.id) || traversalState.current === d.id) {
          return 'url(#glow)';
        }
        return 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
      });

    // Add node labels
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(d => d.id);

    // Define gradients
    const gradients = defs.selectAll('linearGradient')
      .data([
        { id: 'visitedGradient', colors: ['#52c41a', '#389e0d'] },
        { id: 'currentGradient', colors: ['#1890ff', '#096dd9'] },
        { id: 'defaultGradient', colors: ['#ffffff', '#f0f0f0'] }
      ])
      .enter()
      .append('linearGradient')
      .attr('id', d => d.id)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%');

    gradients.selectAll('stop')
      .data(d => d.colors.map((color, i) => ({ color, offset: i * 100 + '%' })))
      .enter()
      .append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);

  }, [nodes, edges, traversalState]);

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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: 'white',
          fontSize: '18px',
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
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        padding: '10px'
      }}>
        <svg ref={svgRef}></svg>
      </div>
    </Card>
  );
};
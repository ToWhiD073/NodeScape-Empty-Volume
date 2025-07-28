import React, { useState } from 'react';
import { Card, Input, Button, message } from 'antd';
import { useGraphStore } from '../store/graphStore';

const { TextArea } = Input;

export const GraphInput = () => {
  const [inputValue, setInputValue] = useState('');
  const setEdges = useGraphStore(state => state.setEdges);

  const handleSubmit = () => {
    try {
      const lines = inputValue.trim().split('\n').filter(line => line.trim());
      const edges = lines.map(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length < 2) {
          throw new Error(`Invalid line: ${line}`);
        }
        return [parts[0], parts[1], parts[2] || null];
      });
      setEdges(edges);
      message.success('Graph loaded successfully!');
    } catch (error) {
      message.error('Invalid input format. Each line should be: u v [w]');
    }
  };

  return (
    <Card title="Graph Input" style={{ marginBottom: 16 }}>
      <TextArea
        rows={4}
        placeholder='Enter edges (one per line):\nA B\nA C 5\nB D'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <Button type="primary" onClick={handleSubmit}>
        Load Graph
      </Button>
    </Card>
  );
};
import React, { useState } from 'react';
import { Card, Input, Button, message } from 'antd';
import { useGraphStore } from '../store/graphStore';

const { TextArea } = Input;

export const GraphInput = () => {
  const [inputValue, setInputValue] = useState('');
  const setEdges = useGraphStore(state => state.setEdges);

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(inputValue);
      if (!Array.isArray(parsed) || !parsed.every(edge => 
        Array.isArray(edge) && edge.length === 2
      )) {
        throw new Error('Invalid format');
      }
      setEdges(parsed);
      message.success('Graph loaded successfully!');
    } catch (error) {
      message.error('Invalid input format. Use: [["A", "B"], ["A", "C"]]');
    }
  };

  return (
    <Card title="Graph Input" style={{ marginBottom: 16 }}>
      <TextArea
        rows={4}
        placeholder='Enter edges as JSON array: [["A", "B"], ["A", "C"], ["B", "D"]]'
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
"use client";

import { useState, useEffect } from 'react';

const MEMORY_KEY = 'mom_biography';

export function useMemory() {
  const [memories, setMemories] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(MEMORY_KEY);
    if (stored) {
      try {
        setMemories(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse memories", e);
      }
    }
  }, []);

  const addMemory = (memory: string) => {
    setMemories((prev) => {
      const newMemories = [...prev, memory];
      localStorage.setItem(MEMORY_KEY, JSON.stringify(newMemories));
      return newMemories;
    });
  };

  const processMessageForMemory = (text: string) => {
    // Regex to find [UPDATE_MEMORY: факт]
    const memoryRegex = /\[UPDATE_MEMORY:\s*(.*?)\]/g;
    let match;
    let newMemories = [];
    
    while ((match = memoryRegex.exec(text)) !== null) {
      if (match[1]) {
        const memoryFact = match[1].trim();
        addMemory(memoryFact);
        newMemories.push(memoryFact);
      }
    }

    // Return text without the tag for displaying to user
    const cleanText = text.replace(memoryRegex, '').trim();
    return { cleanText, newMemories };
  };

  return {
    memories,
    addMemory,
    processMessageForMemory
  };
}

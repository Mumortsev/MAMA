"use client";

import { useEffect, useState } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function AnimatedText({ text, className = "", delay = 0, duration = 0.08 }: AnimatedTextProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const letters = text.split("");
      letters.forEach((_, i) => {
        setTimeout(() => {
          setVisibleCount((prev) => prev + 1);
        }, i * duration * 1000);
      });
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay, duration, text]);

  return (
    <span className={className}>
      {text.split("").map((letter, i) => (
        <span
          key={i}
          className="animate-letter"
          style={{ animationDelay: `${delay + i * duration * 1000}ms` }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
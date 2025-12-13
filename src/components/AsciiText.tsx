"use client";
import { useEffect, useRef, useState } from "react";

interface AsciiTextProps {
  text: string;
  size?: number;
  speed?: number;
  useWaves?: boolean;
  className?: string;
}

export function AsciiText({
  text,
  size = 1,
  speed = 50,
  useWaves = true,
  className = "",
}: AsciiTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const chars = "@%#*+=-:;.";
    let frame = 0;
    const totalFrames = speed;

    const interval = setInterval(() => {
      if (frame >= totalFrames) {
        setDisplayText(text);
        clearInterval(interval);
        return;
      }

      const progress = frame / totalFrames;
      const visibleChars = Math.floor(text.length * progress);

      const newText = text
        .split("")
        .map((char, i) => {
          if (i < visibleChars) return char;
          if (char === " ") return " ";
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setDisplayText(newText);
      frame++;
    }, 30);

    return () => clearInterval(interval);
  }, [text, speed]);

  const fontSize = size === 1 ? "text-9xl" : size === 2 ? "text-8xl" : "text-7xl";
  const waveClass = useWaves ? "animate-wave" : "";

  return (
    <div
      ref={containerRef}
      className={`font-mono font-bold tracking-tight ${fontSize} ${waveClass} ${className}`}
      style={{
        fontFamily: "'Courier New', monospace",
        letterSpacing: "-0.05em",
        lineHeight: "1",
      }}
    >
      {displayText}
    </div>
  );
}

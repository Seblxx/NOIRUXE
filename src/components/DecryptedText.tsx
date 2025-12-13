"use client";
import { useEffect, useState } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  sequential?: boolean;
  className?: string;
}

export function DecryptedText({
  text,
  speed = 50,
  sequential = false,
  className = "",
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState("");
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

  useEffect(() => {
    let iteration = 0;
    const speed_interval = Math.max(20, 100 - speed);

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            
            if (sequential) {
              if (index < iteration) {
                return text[index];
              }
              return characters[Math.floor(Math.random() * characters.length)];
            } else {
              if (Math.random() < iteration / text.length) {
                return text[index];
              }
              return characters[Math.floor(Math.random() * characters.length)];
            }
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, speed_interval);

    return () => clearInterval(interval);
  }, [text, speed, sequential]);

  return <span className={className}>{displayText}</span>;
}

"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface SplashCursorProps {
  color?: string;
  size?: number;
  particleCount?: number;
}

export function SplashCursor({
  color = "#ffffff",
  size = 4,
  particleCount = 5,
}: SplashCursorProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;

    // Parse color
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const rgb = hexToRgb(color);

    const handleMouseMove = (e: MouseEvent) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Calculate velocity for particle spread
      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const speed = Math.random() * 3 + velocity * 0.1;
        
        particles.push({
          x: mouseX + (Math.random() - 0.5) * size,
          y: mouseY + (Math.random() - 0.5) * size,
          vx: Math.cos(angle) * speed + dx * 0.2,
          vy: Math.sin(angle) * speed + dy * 0.2,
          life: 0,
          maxLife: Math.random() * 30 + 40,
          size: Math.random() * size + size * 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
        });
      }

      // Limit particle count for performance
      if (particles.length > 500) {
        particles.splice(0, particles.length - 500);
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    function drawParticle(p: Particle, ctx: CanvasRenderingContext2D) {
      const progress = p.life / p.maxLife;
      const opacity = Math.pow(1 - progress, 2);
      const currentSize = p.size * (1 - progress * 0.5);

      if (opacity <= 0 || currentSize <= 0) return;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // Outer glow
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize * 2);
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.8})`);
      gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.4})`);
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, currentSize * 2, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
      ctx.beginPath();
      ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
      ctx.fill();

      // Add shimmer effect
      if (Math.random() > 0.7) {
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(currentSize * 0.3, -currentSize * 0.3, currentSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function animate() {
      if (!ctx || !canvas) return;

      // Fade effect for trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update particle
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98; // Friction
        p.vy *= 0.98;
        p.vy += 0.1; // Gravity
        p.life++;
        p.rotation += p.rotationSpeed;

        // Draw particle
        drawParticle(p, ctx);

        // Remove dead particles
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [color, size, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      data-testid="splash-cursor-canvas"
    />
  );
}

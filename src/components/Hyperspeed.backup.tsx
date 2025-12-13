// This is the backup of the original simple Hyperspeed
import { useEffect, useRef } from 'react';

interface HyperspeedProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function Hyperspeed({ isActive, onComplete }: HyperspeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Array<{ x: number; y: number; z: number }> = [];
    const starCount = 500;
    const speed = 50;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
      });
    }

    let animationId: number;
    let frame = 0;

    function animate() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';

      stars.forEach((star) => {
        star.z -= speed;

        if (star.z <= 0) {
          star.z = canvas.width;
        }

        const x = (star.x / star.z) * canvas.width + canvas.width / 2;
        const y = (star.y / star.z) * canvas.height + canvas.height / 2;
        const size = (1 - star.z / canvas.width) * 3;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw trail
        const prevZ = star.z + speed;
        const prevX = (star.x / prevZ) * canvas.width + canvas.width / 2;
        const prevY = (star.y / prevZ) * canvas.height + canvas.height / 2;

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - star.z / canvas.width})`;
        ctx.lineWidth = size;
        ctx.stroke();
      });

      frame++;

      if (frame < 60) {
        animationId = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    }

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

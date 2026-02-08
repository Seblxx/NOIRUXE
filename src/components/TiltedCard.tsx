import { useEffect, useRef } from 'react';

export function TiltedCard() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = container.querySelectorAll('.tilted-card');
      
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        (card as HTMLElement).style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale3d(1.02, 1.02, 1.02)
        `;
      });
    };

    const handleMouseLeave = () => {
      const cards = container.querySelectorAll('.tilted-card');
      cards.forEach((card) => {
        (card as HTMLElement).style.transform = `
          perspective(1000px)
          rotateX(0deg)
          rotateY(0deg)
          scale3d(1, 1, 1)
        `;
      });
    };

    // Use window for mouse tracking so it works even with pointer-events-none elements above
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-4 p-4">
        {Array.from({ length: 36 }).map((_, i) => (
          <div
            key={i}
            className="tilted-card transition-transform duration-200 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              backgroundColor: 'transparent',
            }}
          />
        ))}
      </div>
    </div>
  );
}

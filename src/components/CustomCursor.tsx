import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="fixed pointer-events-none custom-cursor-dot"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'white',
          zIndex: 2147483647,
          boxShadow: '0 0 6px rgba(255,255,255,0.5)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      />
    </>
  );
}

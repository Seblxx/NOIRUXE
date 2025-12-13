import './Hyperspeed.css';

export default function Hyperspeed() {
  return (
    <div id="lights" style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none' }}>
      <div style={{
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at center, rgba(216, 86, 191, 0.3) 0%, rgba(3, 179, 195, 0.2) 50%, rgba(0, 0, 0, 0) 100%)',
        animation: 'pulse 2s ease-in-out infinite'
      }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

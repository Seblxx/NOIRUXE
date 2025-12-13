import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Artist {
  name: string;
  color: string;
  accent?: string;
}

interface CardSwapProps {
  artists: Artist[];
  onSelect: (artist: string) => void;
}

export function CardSwap({ artists, onSelect }: CardSwapProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % artists.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + artists.length) % artists.length);
  };

  const currentArtist = artists[currentIndex];

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <button
        onClick={handlePrev}
        className="absolute left-8 z-10 text-white text-4xl hover:scale-110 transition-transform"
      >
        ←
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-96 h-96 rounded-2xl cursor-pointer flex items-center justify-center"
          style={{
            background: currentArtist.color,
            transformStyle: 'preserve-3d',
          }}
          onClick={() => onSelect(currentArtist.name)}
        >
          <h2 className="text-6xl text-white">{currentArtist.name}</h2>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={handleNext}
        className="absolute right-8 z-10 text-white text-4xl hover:scale-110 transition-transform"
      >
        →
      </button>

      <div className="absolute bottom-8 flex gap-2">
        {artists.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

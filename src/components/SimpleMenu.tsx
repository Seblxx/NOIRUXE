import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface SimpleMenuProps {
  items: MenuItem[];
  isExpanded: boolean;
}

export function SimpleMenu({ items, isExpanded }: SimpleMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <AnimatePresence mode="wait">
        {(isExpanded || menuOpen) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center gap-6"
          >
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-white uppercase tracking-wider"
              style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700 }}
            >
              <span>Menu</span>
              <span className="text-2xl">{menuOpen ? '−' : '+'}</span>
            </button>
            
            <div className="h-6 w-px bg-white/30" />
            
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick();
                  setMenuOpen(false);
                }}
                className="text-white uppercase tracking-wider hover:text-white/70 transition-colors"
                style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700 }}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(true)}
            className="flex items-center gap-2 text-white uppercase tracking-wider"
            style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700 }}
          >
            <span>Menu</span>
            <span className="text-2xl">+</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

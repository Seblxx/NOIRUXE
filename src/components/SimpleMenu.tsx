import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();

  // Handle spacebar to toggle menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger on home section (isExpanded) and when not typing in an input
      if (e.code === 'Space' && isExpanded) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          e.preventDefault();
          setMenuOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  return (
    <>
      {/* Bottom Menu - Only visible on home screen */}
      {isExpanded && (
        <div className="fixed bottom-8 left-8 z-50">
          <AnimatePresence mode="wait">
            {menuOpen ? (
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
                  <span>{t('menu.menu', 'Menu', 'Menu')}</span>
                  <span className="text-2xl">−</span>
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
                <span>{t('menu.menu', 'Menu', 'Menu')}</span>
                <span className="text-2xl">+</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Left Sidebar Menu - Visible after scrolling past home */}
      {!isExpanded && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed left-0 top-0 h-screen flex items-center z-50"
        >
          <div className="bg-gradient-to-r from-black/80 via-black/60 to-transparent backdrop-blur-md border-r border-white/10 py-12 px-6">
            <div className="flex flex-col gap-8">
              {/* Menu Items */}
              {items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className="group relative text-white uppercase tracking-wider hover:text-cyan-400 transition-all duration-300 text-left"
                  style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700, fontSize: '1rem' }}
                >
                  <div className="flex items-center gap-3">
                    {/* Animated line indicator */}
                    <motion.div
                      className="h-px bg-gradient-to-r from-cyan-500 to-transparent"
                      initial={{ width: 0 }}
                      whileHover={{ width: '2rem' }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Label - rotated vertical */}
                    <span className="writing-mode-vertical-rl rotate-180 whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}


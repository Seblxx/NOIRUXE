import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { TiltedCard } from '../components/TiltedCard';
import { ArrowLeft, ChevronLeft, ChevronRight, Gamepad2, Music, Camera, Palette, Book, Dumbbell, Plane, Coffee, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { T } from '../components/Translate';
import * as hobbiesService from '../services/hobbiesService';
import gsap from 'gsap';

// Icon mapping for hobbies
const iconMap: { [key: string]: React.ElementType } = {
  gaming: Gamepad2,
  music: Music,
  photography: Camera,
  art: Palette,
  reading: Book,
  fitness: Dumbbell,
  travel: Plane,
  coffee: Coffee,
  default: Heart,
};

// Glitch text component
const GlitchText = ({ text }: { text: string }) => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-block">
      <span
        className="relative z-10 text-white"
        style={{
          fontFamily: "'GT Pressura', sans-serif",
          textShadow: glitchActive 
            ? '2px 0 #ff00ff, -2px 0 #00ffff' 
            : '0 0 20px rgba(255, 255, 255, 0.5)',
        }}
      >
        {text}
      </span>
      {glitchActive && (
        <>
          <span
            className="absolute top-0 left-0 z-0"
            style={{
              fontFamily: "'GT Pressura', sans-serif",
              color: '#00ffff',
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
              transform: 'translate(-4px, -2px)',
              opacity: 0.8,
            }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 z-0"
            style={{
              fontFamily: "'GT Pressura', sans-serif",
              color: '#ff00ff',
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              transform: 'translate(4px, 2px)',
              opacity: 0.8,
            }}
          >
            {text}
          </span>
        </>
      )}
    </div>
  );
};

// Marquee background component
const MarqueeGlitchText = ({ direction = 1, speed = 20, opacity = 0.1, glowColor = '#00ffff', text = 'HOBBIES' }: { direction?: number; speed?: number; opacity?: number; glowColor?: string; text?: string }) => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 2000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const marqueeText = `${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • `;

  return (
    <div 
      className="whitespace-nowrap"
      style={{
        animation: `marquee ${speed}s linear infinite`,
        animationDirection: direction > 0 ? 'normal' : 'reverse',
      }}
    >
      <span
        style={{
          fontFamily: "'GT Pressura', sans-serif",
          fontSize: '8rem',
          fontWeight: 900,
          color: glitchActive ? glowColor : 'white',
          opacity: glitchActive ? opacity * 3 : opacity,
          textShadow: glitchActive 
            ? `0 0 30px ${glowColor}, 0 0 60px ${glowColor}` 
            : 'none',
          transition: 'all 0.05s',
        }}
      >
        {marqueeText}{marqueeText}
      </span>
    </div>
  );
};

export const Hobbies = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [hobbies, setHobbies] = useState<hobbiesService.Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await hobbiesService.getHobbies();
        setHobbies(data);
      } catch (error) {
        console.error('Error fetching hobbies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const title = language === 'fr' ? 'LOISIRS' : 'HOBBIES';

  const currentHobby = hobbies[currentIndex];

  const getIcon = (iconName: string) => {
    const key = iconName?.toLowerCase() || 'default';
    return iconMap[key] || iconMap.default;
  };

  const nextItem = () => {
    if (cardRef.current && hobbies.length > 1) {
      gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        onComplete: () => {
          setCurrentIndex((prev) => (prev + 1) % hobbies.length);
          gsap.fromTo(cardRef.current, 
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, duration: 0.3 }
          );
        }
      });
    } else {
      setCurrentIndex((prev) => (prev + 1) % hobbies.length);
    }
  };

  const prevItem = () => {
    if (cardRef.current && hobbies.length > 1) {
      gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        onComplete: () => {
          setCurrentIndex((prev) => (prev - 1 + hobbies.length) % hobbies.length);
          gsap.fromTo(cardRef.current, 
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, duration: 0.3 }
          );
        }
      });
    } else {
      setCurrentIndex((prev) => (prev - 1 + hobbies.length) % hobbies.length);
    }
  };

  const Icon = currentHobby ? getIcon(currentHobby.icon_url?.split('/').pop()?.split('.')[0] || '') : Heart;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden crt-effect">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="scanline" />
      <CustomCursor />
      <TiltedCard />

      {/* Marquee background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-center gap-4">
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={1} speed={15} opacity={0.08} glowColor="#ec4899" text={title} />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={-1} speed={18} opacity={0.12} glowColor="#00ffff" text={title} />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={1} speed={12} opacity={0.08} glowColor="#a855f7" text={title} />
        </div>
      </div>

      {/* Back button */}
      <motion.button
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -5 }}
        className="fixed top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors z-50"
        style={{ fontFamily: "'GT Pressura', sans-serif", letterSpacing: '0.2em' }}
      >
        <ArrowLeft size={18} />
        <span className="text-sm tracking-widest"><T>HOME</T></span>
      </motion.button>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/10"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 80px rgba(255, 255, 255, 0.05)',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none">
              <GlitchText text={title} />
            </h1>
          </motion.div>

          {loading ? (
            <div className="text-center text-white/50 py-12">
              <T>Loading...</T>
            </div>
          ) : hobbies.length === 0 ? (
            <div className="text-center text-white/50 py-12">
              <T>No hobbies found</T>
            </div>
          ) : (
            <>
              {/* Navigation */}
              <div className="flex items-center justify-between mb-8">
                <motion.button
                  onClick={prevItem}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-pink-500/50 transition-all"
                >
                  <ChevronLeft size={24} />
                </motion.button>

                <div className="text-center">
                  <p className="text-white/40 text-sm">
                    {currentIndex + 1} / {hobbies.length}
                  </p>
                </div>

                <motion.button
                  onClick={nextItem}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-pink-500/50 transition-all"
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>

              {/* Hobby card */}
              <div ref={cardRef}>
                {currentHobby && (
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      <motion.div 
                        className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Icon size={56} className="text-pink-400" />
                      </motion.div>
                    </div>

                    <h2 
                      className="text-2xl md:text-3xl font-bold text-white mb-4"
                      style={{ fontFamily: "'GT Pressura', sans-serif" }}
                    >
                      <T>{currentHobby.name_en || currentHobby.name_fr}</T>
                    </h2>

                    <p className="text-white/60 leading-relaxed max-w-md mx-auto">
                      <T>{currentHobby.description_en || currentHobby.description_fr}</T>
                    </p>
                  </div>
                )}
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {hobbies.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex 
                        ? 'bg-pink-400 w-6' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

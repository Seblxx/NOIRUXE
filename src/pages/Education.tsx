import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { TiltedCard } from '../components/TiltedCard';
import { ArrowLeft, ChevronLeft, ChevronRight, GraduationCap, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as educationService from '../services/educationService';
import gsap from 'gsap';

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
const MarqueeGlitchText = ({ direction = 1, speed = 20, opacity = 0.1, glowColor = '#00ffff', text = 'EDUCATION' }: { direction?: number; speed?: number; opacity?: number; glowColor?: string; text?: string }) => {
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

export const Education = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [education, setEducation] = useState<educationService.Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await educationService.getEducation();
        setEducation(data);
      } catch (error) {
        console.error('Error fetching education:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const title = language === 'fr' ? 'ÉDUCATION' : 'EDUCATION';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'short' });
  };

  const currentEdu = education[currentIndex];

  const nextItem = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        opacity: 0,
        x: -100,
        duration: 0.2,
        onComplete: () => {
          setCurrentIndex((prev) => (prev + 1) % education.length);
          gsap.fromTo(cardRef.current, 
            { opacity: 0, x: 100 },
            { opacity: 1, x: 0, duration: 0.3 }
          );
        }
      });
    } else {
      setCurrentIndex((prev) => (prev + 1) % education.length);
    }
  };

  const prevItem = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        opacity: 0,
        x: 100,
        duration: 0.2,
        onComplete: () => {
          setCurrentIndex((prev) => (prev - 1 + education.length) % education.length);
          gsap.fromTo(cardRef.current, 
            { opacity: 0, x: -100 },
            { opacity: 1, x: 0, duration: 0.3 }
          );
        }
      });
    } else {
      setCurrentIndex((prev) => (prev - 1 + education.length) % education.length);
    }
  };

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
          <MarqueeGlitchText direction={1} speed={15} opacity={0.08} glowColor="#a855f7" text={title} />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={-1} speed={18} opacity={0.12} glowColor="#00ffff" text={title} />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={1} speed={12} opacity={0.08} glowColor="#ff00ff" text={title} />
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
        <span className="text-sm tracking-widest">HOME</span>
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
            maxWidth: '700px',
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
              {language === 'fr' ? 'Chargement...' : 'Loading...'}
            </div>
          ) : education.length === 0 ? (
            <div className="text-center text-white/50 py-12">
              {language === 'fr' ? 'Aucune éducation trouvée' : 'No education found'}
            </div>
          ) : (
            <>
              {/* Navigation */}
              <div className="flex items-center justify-between mb-8">
                <motion.button
                  onClick={prevItem}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-purple-500/50 transition-all"
                >
                  <ChevronLeft size={24} />
                </motion.button>

                <div className="text-center">
                  <p className="text-white/40 text-sm">
                    {currentIndex + 1} / {education.length}
                  </p>
                </div>

                <motion.button
                  onClick={nextItem}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-purple-500/50 transition-all"
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>

              {/* Education card */}
              <div ref={cardRef}>
                {currentEdu && (
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30">
                        <GraduationCap size={40} className="text-purple-400" />
                      </div>
                    </div>

                    <h2 
                      className="text-2xl md:text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: "'GT Pressura', sans-serif" }}
                    >
                      {language === 'fr' ? currentEdu.degree_fr : currentEdu.degree_en}
                    </h2>

                    <p className="text-xl text-purple-400 mb-2">{currentEdu.institution_name}</p>

                    {(currentEdu.field_of_study_en || currentEdu.field_of_study_fr) && (
                      <p className="text-white/60 mb-4">
                        {language === 'fr' ? currentEdu.field_of_study_fr : currentEdu.field_of_study_en}
                      </p>
                    )}

                    <div className="flex items-center justify-center gap-2 text-white/50 mb-6">
                      <Calendar size={16} />
                      <span>
                        {formatDate(currentEdu.start_date)} - {currentEdu.is_current ? (language === 'fr' ? 'Présent' : 'Present') : formatDate(currentEdu.end_date || '')}
                      </span>
                    </div>

                    {(currentEdu.description_en || currentEdu.description_fr) && (
                      <p className="text-white/60 leading-relaxed max-w-xl mx-auto">
                        {language === 'fr' ? currentEdu.description_fr : currentEdu.description_en}
                      </p>
                    )}

                    {currentEdu.grade && (
                      <div className="mt-6 inline-block px-4 py-2 bg-purple-500/20 rounded-full text-sm text-purple-300 border border-purple-500/30">
                        GPA: {currentEdu.grade}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {education.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex 
                        ? 'bg-purple-400 w-6' 
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

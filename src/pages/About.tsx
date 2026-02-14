import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { TiltedCard } from '../components/TiltedCard';
import { SimpleMenu } from '../components/SimpleMenu';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { T } from '../components/Translate';
import { useMenuItems } from '../hooks/useMenuItems';
import * as skillsService from '../services/skillsService';
import * as resumesService from '../services/resumesService';

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
const MarqueeGlitchText = ({ direction = 1, speed = 20, opacity = 0.1, glowColor = '#00ffff', text = 'ABOUT' }: { direction?: number; speed?: number; opacity?: number; glowColor?: string; text?: string }) => {
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

export const About = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { menuItems } = useMenuItems();

  const title = language === 'fr' ? 'À PROPOS' : 'ABOUT';
  const subtitle = language === 'fr' ? 'Développeur Full-Stack' : 'Full-Stack Developer';

  const content = {
    intro: language === 'fr'
      ? "Je suis Sebastien Legagneur, un développeur Full-Stack passionné basé à Montréal, spécialisé dans la création d'applications web modernes et responsive avec des technologies de pointe."
      : "I'm Sebastien Legagneur, a passionate Full-Stack Developer based in Montreal, specializing in building modern, responsive web applications with cutting-edge technologies.",
    expertise: language === 'fr'
      ? "Avec une expertise en React, TypeScript, Java Spring Boot et Python, je crée des expériences numériques fluides qui allient design élégant et fonctionnalité robuste. Je suis dédié à l'apprentissage continu et à rester à la pointe du développement web."
      : "With expertise in React, TypeScript, Java Spring Boot, and Python, I create seamless digital experiences that blend elegant design with robust functionality. I'm dedicated to continuous learning and staying at the forefront of web development trends.",
    experience: language === 'fr'
      ? "J'ai de l'expérience dans le travail avec des équipes agiles, le développement de solutions full-stack et la création d'interfaces utilisateur immersives avec des animations et des effets 3D."
      : "I have experience working with agile teams, developing full-stack solutions, and creating immersive user interfaces with animations and 3D effects."
  };

  // Fetch skills from API for the technologies display
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>('CV.pdf');

  useEffect(() => {
    const fetchData = async () => {
      // Fetch skills categories as technologies
      try {
        const skills = await skillsService.getSkills();
        const categories = [...new Set(skills.map(s => s.category))];
        if (categories.length > 0) {
          setTechnologies(categories);
        }
      } catch {
        // Fallback stays empty
      }

      // Fetch active resume for CV download
      try {
        const resume = await resumesService.getActiveResume(language as 'en' | 'fr');
        setResumeUrl(resume.file_url);
        setResumeFileName(resume.file_name || 'CV.pdf');
      } catch {
        try {
          const fallbackLang = language === 'en' ? 'fr' : 'en';
          const resume = await resumesService.getActiveResume(fallbackLang as 'en' | 'fr');
          setResumeUrl(resume.file_url);
          setResumeFileName(resume.file_name || 'CV.pdf');
        } catch {
          // Final fallback to static file
          setResumeUrl('/Media/FINAL CV III.pdf');
          setResumeFileName('Sebastien_Legagneur_CV.pdf');
        }
      }
    };
    fetchData();
  }, [language]);

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Seblxx', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/sebastien-legagneur', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:sebmoleg@gmail.com', label: 'Email' },
  ];

  const handleDownloadCV = () => {
    if (!resumeUrl) return;
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <MarqueeGlitchText direction={1} speed={15} opacity={0.08} glowColor="#00ffff" text={title} />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={-1} speed={18} opacity={0.12} glowColor="#ff00ff" text={title} />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={1} speed={12} opacity={0.08} glowColor="#00ff88" text={title} />
        </div>
      </div>

      {/* Menu */}
      <SimpleMenu items={menuItems} isExpanded={true} />

      {/* Main content - no box */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl mx-auto text-center">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
              <GlitchText text={title} />
            </h1>
            <p 
              className="mt-4 text-xl tracking-widest uppercase"
              style={{ fontFamily: "'GT Pressura', sans-serif", color: '#ffffff' }}
            >
              <T>{subtitle}</T>
            </p>
          </motion.div>

          {/* Content - single block, tighter spacing */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 leading-relaxed text-xl md:text-2xl space-y-4"
          >
            <p><T>{content.intro}</T></p>
            <p><T>{content.expertise}</T></p>
            <p><T>{content.experience}</T></p>
          </motion.div>

          {/* Technologies */}
          {technologies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap justify-center gap-3 mt-10"
            >
              {technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/70 text-sm tracking-wider uppercase"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          )}

          {/* Download CV Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-10"
          >
            <motion.button
              onClick={handleDownloadCV}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-3 px-8 py-4 rounded-xl border border-white/40 hover:border-white/70 transition-all duration-300"
              style={{ fontFamily: "'GT Pressura', sans-serif", color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.08)' }}
            >
              <Download size={22} className="group-hover:scale-110 transition-transform" />
              <span className="text-lg tracking-widest uppercase font-bold">
                <T>Download CV</T>
              </span>
            </motion.button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-6 mt-12"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-3 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              >
                <social.icon size={22} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

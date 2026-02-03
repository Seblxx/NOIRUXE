import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { ArrowLeft, Github, Linkedin, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const About = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'ABOUT ME',
      subtitle: 'Full-Stack Developer',
      intro: "I'm Sebastien Legagneur, a passionate Full-Stack Developer based in Montreal, specializing in building modern, responsive web applications with cutting-edge technologies.",
      description: "With expertise in React, TypeScript, Java Spring Boot, and Python, I create seamless digital experiences that blend elegant design with robust functionality. I'm dedicated to continuous learning and staying at the forefront of web development trends.",
      skills: 'Core Technologies',
      experience: 'I have experience working with agile teams, developing full-stack solutions, and creating immersive user interfaces with animations and 3D effects.',
    },
    fr: {
      title: 'À PROPOS',
      subtitle: 'Développeur Full-Stack',
      intro: "Je suis Sebastien Legagneur, un développeur Full-Stack passionné basé à Montréal, spécialisé dans la création d'applications web modernes et responsives avec des technologies de pointe.",
      description: "Avec une expertise en React, TypeScript, Java Spring Boot et Python, je crée des expériences numériques fluides qui allient design élégant et fonctionnalité robuste. Je suis dédié à l'apprentissage continu et à rester à la pointe des tendances du développement web.",
      skills: 'Technologies Principales',
      experience: "J'ai de l'expérience de travail avec des équipes agiles, le développement de solutions full-stack, et la création d'interfaces utilisateur immersives avec animations et effets 3D.",
    }
  };

  const t = content[language];
  const coreSkills = ['React', 'TypeScript', 'Java', 'Spring Boot', 'Python', 'PostgreSQL', 'Docker', 'Tailwind CSS'];

  return (
    <div className="min-h-screen bg-black text-white crt-effect">
      <div className="scanline" />
      <CustomCursor />

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

      <div className="container mx-auto px-8 py-24 max-w-4xl">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black mb-4"
          style={{ fontFamily: "'GT Pressura', sans-serif" }}
        >
          {t.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-cyan-400 mb-12"
          style={{ fontFamily: "'GT Pressura', sans-serif" }}
        >
          {t.subtitle}
        </motion.p>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 mb-12"
        >
          <p className="text-lg text-white/80 leading-relaxed">{t.intro}</p>
          <p className="text-lg text-white/70 leading-relaxed">{t.description}</p>
          <p className="text-lg text-white/70 leading-relaxed">{t.experience}</p>
        </motion.div>

        {/* Core Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-white" style={{ fontFamily: "'GT Pressura', sans-serif" }}>
            {t.skills}
          </h2>
          <div className="flex flex-wrap gap-3">
            {coreSkills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="px-4 py-2 border border-cyan-500/50 text-cyan-400 rounded-full text-sm"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-6"
        >
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
            <Github size={28} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
            <Linkedin size={28} />
          </a>
          <a href="mailto:contact@example.com" className="text-white/50 hover:text-white transition-colors">
            <Mail size={28} />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

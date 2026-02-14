import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { TiltedCard } from '../components/TiltedCard';
import { SimpleMenu } from '../components/SimpleMenu';
import { Github, Linkedin, Mail, Send } from 'lucide-react';
import * as contactService from '../services/contactService';
import { useMenuItems } from '../hooks/useMenuItems';
import { useLanguage } from '../contexts/LanguageContext';
import { T } from '../components/Translate';

// Glitch text component matching login page
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

export const Contact = () => {
  const navigate = useNavigate();
  const { menuItems } = useMenuItems();
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(language === 'fr' ? 'Veuillez entrer une adresse courriel valide.' : 'Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      await contactService.sendContactMessage({ name, email, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || (language === 'fr' ? 'Échec de l\'envoi du message. Veuillez réessayer.' : 'Failed to send message. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/Seblxx',
      label: 'GitHub',
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com/in/sebastien-legagneur',
      label: 'LinkedIn',
    },
    {
      icon: Mail,
      href: 'mailto:sebmoleg@gmail.com',
      label: 'Email',
    },
  ];

  // Marquee glitch text component
  const MarqueeGlitchText = ({ direction = 1, speed = 20, opacity = 0.1, glowColor = '#00ffff' }: { direction?: number; speed?: number; opacity?: number; glowColor?: string }) => {
    const [glitchActive, setGlitchActive] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }, 2000 + Math.random() * 2000);
      return () => clearInterval(interval);
    }, []);

    const text = 'CONTACT • CONTACT • CONTACT • CONTACT • CONTACT • CONTACT • CONTACT • CONTACT • ';

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
          {text}{text}
        </span>
      </div>
    );
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
          <MarqueeGlitchText direction={1} speed={10} opacity={0.15} glowColor="#ff3333" />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={-1} speed={12} opacity={0.2} glowColor="#00ffff" />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={1} speed={8} opacity={0.15} glowColor="#ff66b2" />
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Menu */}
        <SimpleMenu items={menuItems} isExpanded={true} />

        {/* Contact card container */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-black/80 backdrop-blur-xl rounded-2xl p-10 md:p-12 border border-white/10"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 80px rgba(255, 255, 255, 0.05)',
            width: '100%',
            maxWidth: '520px',
          }}
        >
          {/* CONTACT text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 text-center"
          >
            <h1 
              className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none"
              style={{ fontFamily: "'GT Pressura', sans-serif" }}
            >
              <GlitchText text={language === 'fr' ? 'CONTACT' : 'CONTACT'} />
            </h1>
            <p 
              className="mt-4 text-white/40 text-sm tracking-widest uppercase"
              style={{ fontFamily: "'GT Pressura', sans-serif" }}
            >
              <T>Let's connect</T>
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-6 mb-10"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/30 transition-all">
                  <social.icon size={24} className="text-white/70 group-hover:text-white transition-colors" />
                </div>
                <span 
                  className="text-xs text-white/40 group-hover:text-white/70 transition-colors tracking-wider uppercase"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  {social.label}
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/10" />
            <span 
              className="text-white/30 text-xs tracking-widest uppercase"
              style={{ fontFamily: "'GT Pressura', sans-serif" }}
            >
              <T>or send a message</T>
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                <Send size={28} className="text-green-400" />
              </div>
              <h3 
                className="text-xl text-white mb-2"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                <T>Message Sent!</T>
              </h3>
              <p 
                className="text-white/50 text-sm mb-6"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                <T>Thanks for reaching out. I'll get back to you soon.</T>
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-white/50 hover:text-white text-sm tracking-wider uppercase transition-colors"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                <T>Send another message</T>
              </button>
            </motion.div>
          ) : (
            <>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 rounded-lg border border-red-500/50 bg-red-500/10 text-red-400 text-sm text-center"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  {error}
                </motion.div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label 
                    className="block text-xs text-white/50 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    <T>Name</T>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                    placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label 
                    className="block text-xs text-white/50 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    <T>Email</T>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                    placeholder={language === 'fr' ? 'votre@courriel.com' : 'your@email.com'}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label 
                    className="block text-xs text-white/50 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    <T>Message</T>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all resize-none"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                    placeholder={language === 'fr' ? 'Qu\'avez-vous en tête ?' : "What's on your mind?"}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="pt-2"
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full py-4 bg-white text-black font-bold tracking-[0.2em] uppercase text-sm rounded-lg hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden flex items-center justify-center gap-2"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    <span>{loading ? <T>Sending...</T> : <T>Send Message</T>}</span>
                    {!loading && <Send size={16} />}
                  </button>
                </motion.div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

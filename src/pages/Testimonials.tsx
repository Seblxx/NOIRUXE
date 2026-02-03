import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { DownloadCVButton } from '../components/DownloadCVButton';
import { ArrowLeft, MessageSquarePlus, Send, X, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as testimonialsService from '../services/testimonialsService';
import { supabase } from '../services/authService';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export const Testimonials = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [testimonials, setTestimonials] = useState<testimonialsService.Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newRating, setNewRating] = useState(5);
  const boardRef = useRef<HTMLDivElement>(null);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUser({ email: session.user.email });
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user?.email) {
        setUser({ email: session.user.email });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch testimonials
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await testimonialsService.getApprovedTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const title = language === 'fr' ? 'TÉMOIGNAGES' : 'TESTIMONIALS';

  const handleSubmit = async () => {
    if (!user || !newMessage.trim()) return;

    setSubmitting(true);
    try {
      await testimonialsService.submitTestimonial({
        author_name: user.email.split('@')[0],
        author_email: user.email,
        testimonial_text_en: newMessage,
        rating: newRating,
      });

      setNewMessage('');
      setNewRating(5);
      setShowForm(false);
      alert(language === 'fr' 
        ? 'Merci! Votre témoignage sera visible après approbation.' 
        : 'Thanks! Your testimonial will be visible after approval.');
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert(language === 'fr' ? 'Erreur lors de l\'envoi' : 'Error submitting');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate random positions for neon game effect
  const getRandomPosition = (index: number) => {
    const seed = index * 137.508; // Golden angle
    const x = (Math.sin(seed) * 0.35 + 0.5) * 100;
    const y = (Math.cos(seed * 0.7) * 0.35 + 0.5) * 100;
    const rotation = Math.sin(seed) * 3;
    return { x: `${x}%`, y: `${y}%`, rotation };
  };

  const neonColors = [
    'from-cyan-500 to-blue-500',
    'from-pink-500 to-purple-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-violet-500 to-indigo-500',
  ];

  return (
    <div className="min-h-screen bg-black text-white crt-effect overflow-hidden">
      <div className="scanline" />
      <CustomCursor />

      {/* Neon grid background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-cyan-900/5" />
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

      {/* Download CV button */}
      <div className="fixed top-8 right-8 z-50">
        <DownloadCVButton />
      </div>

      {/* Drop Message Button - Fixed position */}
      <motion.button
        onClick={() => user ? setShowForm(true) : navigate('/login')}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold shadow-lg shadow-cyan-500/30"
        style={{ fontFamily: "'GT Pressura', sans-serif" }}
      >
        <MessageSquarePlus size={20} />
        <span>{language === 'fr' ? 'DÉPOSER UN MESSAGE' : 'DROP A MESSAGE'}</span>
      </motion.button>

      {/* Title */}
      <div className="container mx-auto px-8 pt-24 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-center mb-4"
          style={{ 
            fontFamily: "'GT Pressura', sans-serif",
            textShadow: '0 0 40px rgba(0,255,255,0.5), 0 0 80px rgba(255,0,255,0.3)'
          }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white/50"
        >
          {user 
            ? (language === 'fr' ? `Connecté en tant que ${user.email}` : `Logged in as ${user.email}`)
            : (language === 'fr' ? 'Connectez-vous pour laisser un message' : 'Sign in to leave a message')}
        </motion.p>
      </div>

      {/* Testimonials Board - Neon Game Style */}
      <div 
        ref={boardRef}
        className="relative min-h-[70vh] mx-8 rounded-3xl border border-white/10 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(20,20,40,0.8) 0%, rgba(0,0,0,0.95) 100%)'
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-96 text-white/50">
            {language === 'fr' ? 'Chargement...' : 'Loading...'}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-white/50">
            <MessageSquarePlus size={48} className="mb-4 opacity-50" />
            <p>{language === 'fr' ? 'Soyez le premier à laisser un témoignage!' : 'Be the first to leave a testimonial!'}</p>
          </div>
        ) : (
          <div className="relative w-full h-[70vh] p-8">
            {testimonials.map((testimonial, i) => {
              const pos = getRandomPosition(i);
              const colorClass = neonColors[i % neonColors.length];

              return (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, scale: 0, rotate: pos.rotation }}
                  animate={{ opacity: 1, scale: 1, rotate: pos.rotation }}
                  transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.1, rotate: 0, zIndex: 100 }}
                  className="absolute cursor-pointer"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                  }}
                >
                  <div 
                    className={`relative p-4 rounded-xl border-2 max-w-xs backdrop-blur-sm`}
                    style={{
                      borderImage: `linear-gradient(135deg, ${colorClass.includes('cyan') ? '#00ffff' : colorClass.includes('pink') ? '#ff00ff' : colorClass.includes('green') ? '#00ff00' : colorClass.includes('yellow') ? '#ffff00' : '#8b5cf6'}, transparent) 1`,
                      boxShadow: `0 0 20px rgba(${colorClass.includes('cyan') ? '0,255,255' : colorClass.includes('pink') ? '255,0,255' : colorClass.includes('green') ? '0,255,0' : colorClass.includes('yellow') ? '255,255,0' : '139,92,246'},0.3)`,
                      background: 'rgba(0,0,0,0.7)',
                    }}
                  >
                    {/* Rating stars */}
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, j) => (
                        <Star 
                          key={j} 
                          size={12} 
                          className={j < (testimonial.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-white/90 mb-3 line-clamp-3">
                      "{language === 'fr' && testimonial.testimonial_text_fr ? testimonial.testimonial_text_fr : testimonial.testimonial_text_en}"
                    </p>

                    <div className="text-xs text-white/50">
                      — {testimonial.author_name}
                      {testimonial.author_email && (
                        <span className="block text-[10px] opacity-70">{testimonial.author_email}</span>
                      )}
                    </div>

                    {/* Neon corner decorations */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-cyan-500" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-purple-500" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-purple-500" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-cyan-500" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md mx-4 p-8 rounded-2xl border border-cyan-500/50 bg-black/90"
              style={{
                boxShadow: '0 0 50px rgba(0,255,255,0.3), 0 0 100px rgba(255,0,255,0.2)'
              }}
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                {language === 'fr' ? 'Laisser un témoignage' : 'Leave a Testimonial'}
              </h2>

              <div className="mb-6">
                <label className="block text-sm text-white/50 mb-2">
                  {language === 'fr' ? 'Note' : 'Rating'}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star 
                        size={28} 
                        className={star <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-white/50 mb-2">
                  {language === 'fr' ? 'Votre message' : 'Your message'}
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={language === 'fr' ? 'Partagez votre expérience...' : 'Share your experience...'}
                  className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-cyan-500/50 focus:outline-none resize-none"
                />
              </div>

              <div className="text-sm text-white/50 mb-6">
                {language === 'fr' 
                  ? `Sera publié avec: ${user?.email}` 
                  : `Will be posted as: ${user?.email}`}
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !newMessage.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                <Send size={18} />
                {submitting 
                  ? (language === 'fr' ? 'Envoi...' : 'Sending...') 
                  : (language === 'fr' ? 'ENVOYER' : 'SEND')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

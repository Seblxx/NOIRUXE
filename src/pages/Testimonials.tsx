import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { TiltedCard } from '../components/TiltedCard';
import { SimpleMenu } from '../components/SimpleMenu';
import { Send, Check, X, Trash2, Clock, Shield, MessageSquareQuote, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../services/authService';
import * as testimonialsService from '../services/testimonialsService';
import type { Testimonial, TestimonialSubmission } from '../services/testimonialsService';
import { useMenuItems } from '../hooks/useMenuItems';
import { useLanguage } from '../contexts/LanguageContext';
import { T } from '../components/Translate';

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

// Marquee background text
const MarqueeGlitchText = ({ direction = 1, speed = 20, opacity = 0.1, glowColor = '#00ffff' }: { direction?: number; speed?: number; opacity?: number; glowColor?: string }) => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 2000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const text = 'TESTIMONIALS \u2022 TESTIMONIALS \u2022 TESTIMONIALS \u2022 TESTIMONIALS \u2022 TESTIMONIALS \u2022 ';

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

// Status badge - uses inline styles to guarantee visibility
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { icon: typeof Clock; label: string; textColor: string; bgColor: string; borderColor: string }> = {
    pending: { icon: Clock, label: 'Pending', textColor: '#facc15', bgColor: 'rgba(250,204,21,0.12)', borderColor: 'rgba(250,204,21,0.4)' } as const,
    approved: { icon: Check, label: 'Approved', textColor: '#4ade80', bgColor: 'rgba(74,222,128,0.12)', borderColor: 'rgba(74,222,128,0.4)' } as const,
    rejected: { icon: X, label: 'Rejected', textColor: '#f87171', bgColor: 'rgba(248,113,113,0.12)', borderColor: 'rgba(248,113,113,0.4)' } as const,
  };
  const c = config[status] || { icon: Clock, label: status, textColor: '#ffffff', bgColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' };
  const Icon = c.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs tracking-wider uppercase"
      style={{
        fontFamily: "'GT Pressura', sans-serif",
        color: c.textColor,
        backgroundColor: c.bgColor,
        border: `1px solid ${c.borderColor}`,
      }}
    >
      <Icon size={12} />
      <T>{c.label}</T>
    </span>
  );
};

const ITEMS_PER_PAGE = 4;

export const Testimonials = () => {
  const navigate = useNavigate();
  const { menuItems } = useMenuItems();
  const { language } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'public' | 'admin'>('public');

  // Public testimonials
  const [approvedTestimonials, setApprovedTestimonials] = useState<Testimonial[]>([]);
  const [loadingPublic, setLoadingPublic] = useState(true);
  const [publicPage, setPublicPage] = useState(0);

  // Admin testimonials
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);
  const [adminFilter, setAdminFilter] = useState<string>('pending');
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminPage, setAdminPage] = useState(0);

  // Submission form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<TestimonialSubmission>({
    author_name: '',
    author_email: 'visitor@testimonial.com',
    testimonial_text_en: '',
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Action loading states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [adminError, setAdminError] = useState('');

  const syncToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      localStorage.setItem('token', session.access_token);
      return true;
    }
    return false;
  };

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const loggedIn = !!session?.user;
      if (loggedIn && session.access_token) {
        localStorage.setItem('token', session.access_token);
      }
      setIsAdmin(loggedIn);
    };
    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const loggedIn = !!session?.user;
      if (loggedIn && session?.access_token) {
        localStorage.setItem('token', session.access_token);
      }
      setIsAdmin(loggedIn);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load approved testimonials
  useEffect(() => {
    const loadApproved = async () => {
      try {
        setLoadingPublic(true);
        const data = await testimonialsService.getApprovedTestimonials();
        setApprovedTestimonials(data);
      } catch {
        console.error('Failed to load testimonials');
      } finally {
        setLoadingPublic(false);
      }
    };
    loadApproved();
  }, []);

  // Load admin testimonials
  useEffect(() => {
    if (isAdmin) {
      loadAdminTestimonials();
    }
  }, [isAdmin, adminFilter]);

  const loadAdminTestimonials = async () => {
    try {
      setLoadingAdmin(true);
      setAdminError('');
      await syncToken();
      const data = await testimonialsService.getAllTestimonialsAdmin(adminFilter || undefined);
      setAllTestimonials(data);
      setAdminPage(0);
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.message || 'Unknown error';
      console.error('Failed to load admin testimonials:', detail, err);
      setAdminError(`Failed to load testimonials: ${detail}`);
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.testimonial_text_en.trim()) {
      setSubmitError(language === 'fr' ? 'Veuillez entrer un témoignage.' : 'Please enter a testimonial.');
      return;
    }

    try {
      setSubmitting(true);
      await testimonialsService.submitTestimonial(formData);
      setSubmitSuccess(true);
      setFormData({ ...formData, author_name: '', testimonial_text_en: '' });
    } catch (err: any) {
      setSubmitError(err.response?.data?.detail || (language === 'fr' ? 'Échec de la soumission du témoignage. Veuillez réessayer.' : 'Failed to submit testimonial. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await syncToken();
      await testimonialsService.approveTestimonial(id);
      await loadAdminTestimonials();
      const data = await testimonialsService.getApprovedTestimonials();
      setApprovedTestimonials(data);
    } catch {
      console.error('Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await syncToken();
      await testimonialsService.rejectTestimonial(id);
      await loadAdminTestimonials();
      const data = await testimonialsService.getApprovedTestimonials();
      setApprovedTestimonials(data);
    } catch {
      console.error('Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer définitivement ce témoignage ?' : 'Are you sure you want to permanently delete this testimonial?')) return;
    setActionLoading(id);
    try {
      await syncToken();
      await testimonialsService.deleteTestimonial(id);
      await loadAdminTestimonials();
      const data = await testimonialsService.getApprovedTestimonials();
      setApprovedTestimonials(data);
    } catch {
      console.error('Failed to delete');
    } finally {
      setActionLoading(null);
    }
  };

  // Pagination helpers
  const publicTotalPages = Math.max(1, Math.ceil(approvedTestimonials.length / ITEMS_PER_PAGE));
  const publicItems = approvedTestimonials.slice(publicPage * ITEMS_PER_PAGE, (publicPage + 1) * ITEMS_PER_PAGE);

  const adminTotalPages = Math.max(1, Math.ceil(allTestimonials.length / ITEMS_PER_PAGE));
  const adminItems = allTestimonials.slice(adminPage * ITEMS_PER_PAGE, (adminPage + 1) * ITEMS_PER_PAGE);

  return (
    <>
    <div className="h-screen bg-black relative overflow-hidden crt-effect">
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
          <MarqueeGlitchText direction={1} speed={12} opacity={0.12} glowColor="#00ffff" />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={-1} speed={15} opacity={0.08} glowColor="#ff00ff" />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={1} speed={10} opacity={0.1} glowColor="#ff3333" />
        </div>
      </div>

      {/* Menu */}
      <SimpleMenu items={menuItems} isExpanded={true} />

      {/* Main content - fixed viewport, no scroll, vertically centered */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 text-center flex-shrink-0"
        >
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none"
            style={{ fontFamily: "'GT Pressura', sans-serif" }}
          >
            <GlitchText text="TESTIMONIALS" />
          </h1>
          <p
            className="mt-2 text-sm tracking-widest uppercase"
            style={{ fontFamily: "'GT Pressura', sans-serif", color: 'rgba(255,255,255,0.7)' }}
          >
            <T>What people say</T>
          </p>
        </motion.div>

        {/* Admin tab toggle */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2 mb-4 flex-shrink-0"
          >
            <button
              onClick={() => setActiveTab('public')}
              className={`px-4 py-1.5 rounded-lg text-xs tracking-wider uppercase transition-all border ${
                activeTab === 'public'
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/20'
              }`}
              style={{ fontFamily: "'GT Pressura', sans-serif" }}
            >
              <T>Public View</T>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="px-4 py-1.5 rounded-lg text-xs tracking-wider uppercase transition-all border flex items-center gap-2"
              style={{
                fontFamily: "'GT Pressura', sans-serif",
                backgroundColor: activeTab === 'admin' ? 'rgba(0,255,255,0.1)' : 'transparent',
                borderColor: activeTab === 'admin' ? 'rgba(0,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                color: activeTab === 'admin' ? '#22d3ee' : 'rgba(255,255,255,0.6)',
              }}
            >
              <Shield size={14} />
              <T>Admin Panel</T>
            </button>
          </motion.div>
        )}

        {/* ==================== PUBLIC VIEW ==================== */}
        {activeTab === 'public' && (
          <div className="w-full max-w-5xl flex flex-col">
            {loadingPublic ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
              </div>
            ) : approvedTestimonials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <MessageSquareQuote size={48} className="mb-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
                <p className="text-lg mb-8" style={{ fontFamily: "'GT Pressura', sans-serif", color: 'rgba(255,255,255,0.7)' }}>
                  <T>No testimonials yet. Be the first to share your experience!</T>
                </p>
                {!showForm && !submitSuccess && (
                  <motion.button
                    onClick={() => setShowForm(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3"
                    style={{ fontFamily: "'GT Pressura', sans-serif", letterSpacing: '0.15em' }}
                  >
                    <MessageSquareQuote size={18} />
                    <span className="text-sm uppercase tracking-widest"><T>Write a Testimonial</T></span>
                  </motion.button>
                )}
              </div>
            ) : (
              <>
                {/* Cards with arrows */}
                <div className="flex items-center gap-4">
                  {/* Left Arrow */}
                  {publicTotalPages > 1 && (
                    <motion.button
                      onClick={() => setPublicPage((prev) => (prev - 1 + publicTotalPages) % publicTotalPages)}
                      whileHover={{ scale: 1.1, x: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all"
                      style={{ border: '1px solid rgba(0,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0.8)', color: '#22d3ee' }}
                    >
                      <ChevronLeft size={28} />
                    </motion.button>
                  )}

                  {/* Testimonials grid */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
                    <AnimatePresence mode="wait">
                      {publicItems.map((t) => (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="group relative bg-black/60 backdrop-blur-xl rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all duration-500"
                          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
                        >
                          <div className="absolute top-3 right-4 group-hover:text-cyan-500/25 transition-colors duration-500" style={{ color: 'rgba(255,255,255,0.2)' }}>
                            <MessageSquareQuote size={32} />
                          </div>
                          <p
                            className="text-white text-sm leading-relaxed mb-4 relative z-10"
                            style={{ fontFamily: "'GT Pressura', sans-serif" }}
                          >
                            &quot;{language === 'fr' ? (t.testimonial_text_fr || t.testimonial_text_en) : t.testimonial_text_en}&quot;
                          </p>
                          <div className="pt-3 border-t border-white/10">
                            <p
                              className="text-white text-xs font-medium tracking-wider uppercase"
                              style={{ fontFamily: "'GT Pressura', sans-serif" }}
                            >
                              &#x2014; {t.author_name}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Right Arrow */}
                  {publicTotalPages > 1 && (
                    <motion.button
                      onClick={() => setPublicPage((prev) => (prev + 1) % publicTotalPages)}
                      whileHover={{ scale: 1.1, x: 3 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all"
                      style={{ border: '1px solid rgba(0,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0.8)', color: '#22d3ee' }}
                    >
                      <ChevronRight size={28} />
                    </motion.button>
                  )}
                </div>

                {/* Page indicator */}
                {publicTotalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4 flex-shrink-0">
                    {Array.from({ length: publicTotalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPublicPage(i)}
                        className="rounded-full transition-all"
                        style={{
                          width: i === publicPage ? '1.5rem' : '0.5rem',
                          height: '0.5rem',
                          backgroundColor: i === publicPage ? '#22d3ee' : 'rgba(255,255,255,0.2)',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Write a Testimonial button */}
                <div className="flex justify-center mt-3 flex-shrink-0">
                  {!showForm && !submitSuccess && (
                    <motion.button
                      onClick={() => setShowForm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3"
                      style={{ fontFamily: "'GT Pressura', sans-serif", letterSpacing: '0.15em' }}
                    >
                      <MessageSquareQuote size={16} />
                      <span className="text-xs uppercase tracking-widest"><T>Write a Testimonial</T></span>
                    </motion.button>
                  )}
                </div>
              </>
            )}

          </div>
        )}

        {/* ==================== ADMIN PANEL ==================== */}
        {activeTab === 'admin' && isAdmin && (
          <div className="w-full max-w-5xl flex flex-col">
            {/* Filter buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-4 justify-center flex-shrink-0"
            >
              {[
                { value: '', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setAdminFilter(filter.value)}
                  className={`px-4 py-1.5 rounded-lg text-xs tracking-wider uppercase transition-all border ${
                    adminFilter === filter.value
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'bg-transparent border-white/10 text-white/60 hover:text-white'
                  }`}
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  <T>{filter.label}</T>
                </button>
              ))}
            </motion.div>

            {adminError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-4 rounded-lg text-center flex-shrink-0"
                style={{ border: '1px solid rgba(248,113,113,0.3)', backgroundColor: 'rgba(248,113,113,0.1)' }}
              >
                <p className="text-white text-sm mb-3" style={{ fontFamily: "'GT Pressura', sans-serif" }}>
                  {adminError}
                </p>
                <button
                  onClick={() => loadAdminTestimonials()}
                  className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs tracking-wider uppercase transition-all"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  <T>Retry</T>
                </button>
              </motion.div>
            )}

            {loadingAdmin ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
              </div>
            ) : allTestimonials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <MessageSquareQuote size={48} className="mb-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
                <p className="text-white text-lg" style={{ fontFamily: "'GT Pressura', sans-serif" }}>
                  <T>{`No testimonials found${adminFilter ? ` with status "${adminFilter}"` : ''}.`}</T>
                </p>
              </div>
            ) : (
              <>
                {/* Admin cards with arrows */}
                <div className="flex items-center gap-4">
                  {/* Left Arrow */}
                  {adminTotalPages > 1 && (
                    <motion.button
                      onClick={() => setAdminPage((prev) => (prev - 1 + adminTotalPages) % adminTotalPages)}
                      whileHover={{ scale: 1.1, x: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all"
                      style={{ border: '1px solid rgba(0,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0.8)', color: '#22d3ee' }}
                    >
                      <ChevronLeft size={28} />
                    </motion.button>
                  )}

                  {/* Testimonials list */}
                  <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <AnimatePresence mode="wait">
                      {adminItems.map((t) => (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="bg-black/60 backdrop-blur-xl rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <StatusBadge status={t.status} />
                                <span
                                  className="text-xs"
                                  style={{ fontFamily: "'GT Pressura', sans-serif", color: 'rgba(255,255,255,0.6)' }}
                                >
                                  {new Date(t.created_at).toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                              </div>

                              <p
                                className="text-white text-sm leading-relaxed mb-2 line-clamp-2"
                                style={{ fontFamily: "'GT Pressura', sans-serif" }}
                              >
                                &quot;{language === 'fr' ? (t.testimonial_text_fr || t.testimonial_text_en) : t.testimonial_text_en}&quot;
                              </p>

                              <div className="flex items-center gap-2">
                                <User size={12} style={{ color: 'rgba(255,255,255,0.6)' }} />
                                <p
                                  className="text-xs"
                                  style={{ fontFamily: "'GT Pressura', sans-serif", color: 'rgba(255,255,255,0.8)' }}
                                >
                                  {t.author_name}
                                </p>
                              </div>
                            </div>

                            {/* Action buttons - all use inline styles for guaranteed visibility */}
                            <div className="flex gap-2 flex-shrink-0">
                              {t.status !== 'approved' && (
                                <button
                                  onClick={() => handleApprove(t.id)}
                                  disabled={actionLoading === t.id}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs tracking-wider uppercase disabled:opacity-50 transition-all"
                                  style={{
                                    fontFamily: "'GT Pressura', sans-serif",
                                    color: '#4ade80',
                                    backgroundColor: 'rgba(74,222,128,0.1)',
                                    border: '1px solid rgba(74,222,128,0.3)',
                                  }}
                                  title="Approve"
                                >
                                  <Check size={14} />
                                  <span><T>Approve</T></span>
                                </button>
                              )}
                              {t.status !== 'rejected' && (
                                <button
                                  onClick={() => handleReject(t.id)}
                                  disabled={actionLoading === t.id}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs tracking-wider uppercase disabled:opacity-50 transition-all"
                                  style={{
                                    fontFamily: "'GT Pressura', sans-serif",
                                    color: '#facc15',
                                    backgroundColor: 'rgba(250,204,21,0.1)',
                                    border: '1px solid rgba(250,204,21,0.3)',
                                  }}
                                  title="Reject"
                                >
                                  <X size={14} />
                                  <span><T>Reject</T></span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(t.id)}
                                disabled={actionLoading === t.id}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs tracking-wider uppercase disabled:opacity-50 transition-all"
                                style={{
                                  fontFamily: "'GT Pressura', sans-serif",
                                  color: '#f87171',
                                  backgroundColor: 'rgba(248,113,113,0.1)',
                                  border: '1px solid rgba(248,113,113,0.3)',
                                }}
                                title="Delete"
                              >
                                <Trash2 size={14} />
                                <span><T>Delete</T></span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Right Arrow */}
                  {adminTotalPages > 1 && (
                    <motion.button
                      onClick={() => setAdminPage((prev) => (prev + 1) % adminTotalPages)}
                      whileHover={{ scale: 1.1, x: 3 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all"
                      style={{ border: '1px solid rgba(0,255,255,0.5)', backgroundColor: 'rgba(0,0,0,0.8)', color: '#22d3ee' }}
                    >
                      <ChevronRight size={28} />
                    </motion.button>
                  )}
                </div>

                {/* Page indicator */}
                {adminTotalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-3 flex-shrink-0">
                    {Array.from({ length: adminTotalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setAdminPage(i)}
                        className="rounded-full transition-all"
                        style={{
                          width: i === adminPage ? '1.5rem' : '0.5rem',
                          height: '0.5rem',
                          backgroundColor: i === adminPage ? '#22d3ee' : 'rgba(255,255,255,0.2)',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Count */}
                <div className="text-center mt-2 flex-shrink-0">
                  <span className="text-xs tracking-widest" style={{ fontFamily: "'GT Pressura', sans-serif", color: 'rgba(255,255,255,0.6)' }}>
                    {adminPage * ITEMS_PER_PAGE + 1} &#x2013; {Math.min((adminPage + 1) * ITEMS_PER_PAGE, allTestimonials.length)} of {allTestimonials.length}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

    </div>

      {/* Portaled modals - rendered outside the crt-effect container to avoid transform breaking fixed positioning */}
      {createPortal(
        <>
          <AnimatePresence>
            {showForm && !submitSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="modal-cursor"
                style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.88)', cursor: 'default !important' } as React.CSSProperties}
                onClick={(e: React.MouseEvent) => { if (e.target === e.currentTarget) { setShowForm(false); setSubmitError(''); } }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  style={{ position: 'relative', maxWidth: '42rem', width: '100%', margin: '0 1.5rem', borderRadius: '0.5rem', padding: '3rem 4rem', backgroundColor: 'rgba(10,10,10,0.98)', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)', cursor: 'default !important' } as React.CSSProperties}
                >
                  {/* Close X button */}
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setSubmitError(''); }}
                    style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer !important', padding: '0.5rem', lineHeight: 1 } as React.CSSProperties}
                  >
                    <X size={22} />
                  </button>

                  <h3 className="text-white text-xl mb-8 tracking-widest uppercase text-center" style={{ fontFamily: "'GT Pressura', sans-serif" }}>
                    <T>Write a Testimonial</T>
                  </h3>

                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-3 rounded-lg text-sm text-center"
                      style={{ fontFamily: "'GT Pressura', sans-serif", color: '#f87171', backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.5)' }}
                    >
                      {submitError}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        className="block text-xs mb-2 tracking-[0.2em] uppercase"
                        style={{ fontFamily: "'GT Pressura', sans-serif", color: 'rgba(255,255,255,0.7)' }}
                      >
                        <T>Name</T> *
                      </label>
                      <input
                        type="text"
                        value={formData.author_name}
                        onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                        required
                        className="w-full px-5 py-4 rounded-lg text-base focus:outline-none transition-all"
                        style={{ fontFamily: "'GT Pressura', sans-serif", color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'text' }}
                        placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}  // Placeholder text stays English
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs mb-2 tracking-[0.2em] uppercase"
                        style={{ fontFamily: "'GT Pressura', sans-serif", color: 'rgba(255,255,255,0.7)' }}
                      >
                        <T>Your Message</T> *
                      </label>
                      <textarea
                        value={formData.testimonial_text_en}
                        onChange={(e) => setFormData({ ...formData, testimonial_text_en: e.target.value })}
                        required
                        rows={6}
                        className="w-full px-5 py-4 rounded-lg text-base focus:outline-none transition-all resize-none"
                        style={{ fontFamily: "'GT Pressura', sans-serif", color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'text' }}
                        placeholder={language === 'fr' ? 'Votre message' : 'Your message'}
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 font-bold tracking-[0.2em] uppercase text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ fontFamily: "'GT Pressura', sans-serif", backgroundColor: '#ffffff', color: '#000000', cursor: 'pointer !important' } as React.CSSProperties}
                      >
                        <span>{submitting ? <T>Submitting...</T> : <T>Submit Testimonial</T>}</span>
                        {!submitting && <Send size={16} />}
                      </button>
                    </div>

                    <p
                      className="text-xs text-center"
                      style={{ fontFamily: "'GT Pressura', sans-serif", color: 'rgba(255,255,255,0.6)' }}
                    >
                      <T>Your testimonial will be reviewed before being published.</T>
                    </p>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="modal-cursor"
                style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.88)', cursor: 'default !important' } as React.CSSProperties}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ maxWidth: '28rem', margin: '0 1rem', borderRadius: '0.5rem', padding: '2rem', backgroundColor: 'rgba(10,10,10,0.98)', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center', cursor: 'default !important' } as React.CSSProperties}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.5)' }}>
                    <Check size={28} style={{ color: '#4ade80' }} />
                  </div>
                  <h3
                    className="text-xl text-white mb-2"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    <T>Thank You!</T>
                  </h3>
                  <p
                    className="text-sm mb-6"
                    style={{ fontFamily: "'GT Pressura', sans-serif", color: 'rgba(255,255,255,0.7)' }}
                  >
                    <T>Your testimonial has been submitted and is awaiting review.</T>
                  </p>
                  <button
                    onClick={() => { setSubmitSuccess(false); setShowForm(false); }}
                    className="text-sm tracking-wider uppercase transition-colors"
                    style={{ fontFamily: "'GT Pressura', sans-serif", color: 'rgba(255,255,255,0.7)', cursor: 'pointer !important' } as React.CSSProperties}
                  >
                    <T>Done</T>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
};

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import * as testimonialsService from '../services/testimonialsService';
import { User } from '@supabase/supabase-js';

type Testimonial = testimonialsService.Testimonial;

interface TestimonialBoard3DProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAddClick: () => void;
}

export const TestimonialBoard3D: React.FC<TestimonialBoard3DProps> = ({ 
  isOpen, 
  onClose, 
  user,
  onAddClick 
}) => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    if (isOpen) {
      const loadData = async () => {
        setLoading(true);
        try {
          const data = await testimonialsService.getApprovedTestimonials();
          if (isMounted) {
            setTestimonials(data);
          }
        } catch (error) {
          console.error('Error loading testimonials:', error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      loadData();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const data = await testimonialsService.getApprovedTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMessage = () => {
    if (!user) {
      onClose();
      navigate('/login');
    } else {
      onAddClick();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            style={{ cursor: 'pointer' }}
          />

          {/* 3D Board */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateX: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-8 md:inset-16 lg:inset-24 z-[101] pointer-events-none"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="relative w-full h-full pointer-events-auto"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: 'translateZ(50px)'
              }}
            >
              {/* Board Shadow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-3xl blur-3xl transform translate-y-8" />
              
              {/* Main Board */}
              <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-3xl border-4 border-purple-500/30 shadow-2xl overflow-hidden">
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.03)_50%)] bg-[length:100%_4px] pointer-events-none animate-scan" />
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                
                {/* Glow Border */}
                <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-3xl shadow-[0_0_30px_rgba(34,211,238,0.3)] pointer-events-none" />
                
                {/* Header */}
                <div className="relative p-6 border-b-2 border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 
                          className="text-3xl font-bold text-white tracking-wider"
                          style={{ 
                            fontFamily: 'GT Pressura, monospace',
                            textShadow: '0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(168,85,247,0.4)'
                          }}
                        >
                          TESTIMONIAL BOARD
                        </h2>
                        <p className="text-cyan-400 text-sm tracking-widest">★ {testimonials.length} MESSAGES ★</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddMessage}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-green-500/30 border-2 border-green-400/50 transition-all hover:scale-105"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        POST MESSAGE
                      </Button>
                      <Button
                        onClick={onClose}
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white w-10 h-10 p-0 rounded-lg shadow-lg shadow-red-500/30 border-2 border-red-400/50 transition-all hover:scale-105"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative h-[calc(100%-5rem)] overflow-y-auto p-6 custom-scrollbar">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-cyan-400 text-xl tracking-wider">LOADING...</p>
                      </div>
                    </div>
                  ) : testimonials.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30">
                        <Star className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                        <p className="text-gray-400 text-xl">No testimonials yet!</p>
                        <p className="text-gray-500 text-sm mt-2">Be the first to leave one</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {testimonials.map((testimonial, index) => {
                        const colors = [
                          { border: 'border-cyan-400', glow: 'shadow-cyan-400/50', bg: 'from-cyan-900/30 to-blue-900/30', text: 'text-cyan-400' },
                          { border: 'border-pink-400', glow: 'shadow-pink-400/50', bg: 'from-pink-900/30 to-purple-900/30', text: 'text-pink-400' },
                          { border: 'border-green-400', glow: 'shadow-green-400/50', bg: 'from-green-900/30 to-emerald-900/30', text: 'text-green-400' },
                          { border: 'border-yellow-400', glow: 'shadow-yellow-400/50', bg: 'from-yellow-900/30 to-orange-900/30', text: 'text-yellow-400' },
                          { border: 'border-purple-400', glow: 'shadow-purple-400/50', bg: 'from-purple-900/30 to-indigo-900/30', text: 'text-purple-400' },
                          { border: 'border-blue-400', glow: 'shadow-blue-400/50', bg: 'from-blue-900/30 to-indigo-900/30', text: 'text-blue-400' },
                        ];
                        const colorScheme = colors[index % colors.length];

                        return (
                          <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`relative group bg-gradient-to-br ${colorScheme.bg} backdrop-blur-sm rounded-xl border-2 ${colorScheme.border} shadow-lg ${colorScheme.glow} hover:scale-105 transition-all duration-300 overflow-hidden`}
                            style={{
                              transform: 'translateZ(20px)',
                              transformStyle: 'preserve-3d'
                            }}
                          >
                            {/* Pixel corners */}
                            <div className={`absolute top-0 left-0 w-3 h-3 ${colorScheme.border} border-t-2 border-l-2`} />
                            <div className={`absolute top-0 right-0 w-3 h-3 ${colorScheme.border} border-t-2 border-r-2`} />
                            <div className={`absolute bottom-0 left-0 w-3 h-3 ${colorScheme.border} border-b-2 border-l-2`} />
                            <div className={`absolute bottom-0 right-0 w-3 h-3 ${colorScheme.border} border-b-2 border-r-2`} />
                            
                            <div className="p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${colorScheme.border} flex items-center justify-center ${colorScheme.text} text-xl font-bold shadow-lg`}>
                                  {testimonial.author_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <h4 className={`${colorScheme.text} font-bold text-sm tracking-wide`}>
                                    {testimonial.author_name}
                                  </h4>
                                  <p className="text-gray-500 text-xs font-mono">
                                    {new Date(testimonial.created_at).toLocaleDateString('en-US', { 
                                      month: '2-digit', 
                                      day: '2-digit',
                                      year: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {testimonial.testimonial_text_en}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

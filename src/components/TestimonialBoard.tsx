import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, User } from 'lucide-react';
import { Button } from './ui/button';
import * as testimonialsService from '../services/testimonialsService';

interface Testimonial {
  id: number;
  author_name: string;
  testimonial_text_en: string;
  created_at: string;
}

interface TestimonialBoardProps {
  isOpen: boolean;
  onClose: () => void;
  testimonials: Testimonial[];
  user: any;
  onAddTestimonial: () => void;
  onLogin: () => void;
}

export const TestimonialBoard: React.FC<TestimonialBoardProps> = ({
  isOpen,
  onClose,
  testimonials,
  user,
  onAddTestimonial,
  onLogin,
}) => {
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

          {/* 3D Board Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ 
                scale: 0.5, 
                opacity: 0,
                rotateX: -30,
                y: 100
              }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                rotateX: 0,
                y: 0
              }}
              exit={{ 
                scale: 0.5, 
                opacity: 0,
                rotateX: 30,
                y: -100
              }}
              transition={{ 
                type: "spring", 
                damping: 25,
                stiffness: 300
              }}
              className="w-full max-w-6xl max-h-[85vh] pointer-events-auto"
              style={{ 
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* 3D Board */}
              <div 
                className="relative"
                style={{
                  transform: 'rotateX(2deg) rotateY(-2deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Board Shadow/Depth */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-amber-900 to-amber-950 rounded-3xl"
                  style={{
                    transform: 'translateZ(-20px)',
                    filter: 'blur(10px)',
                    opacity: 0.6,
                  }}
                />
                
                {/* Main Board */}
                <div className="relative bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 rounded-3xl shadow-2xl overflow-hidden border-8 border-amber-950">
                  {/* Wood grain texture overlay */}
                  <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        90deg,
                        rgba(139, 69, 19, 0.3) 0px,
                        rgba(160, 82, 45, 0.3) 2px,
                        rgba(139, 69, 19, 0.3) 4px
                      )`,
                    }}
                  />
                  
                  {/* Cork board texture */}
                  <div 
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage: `radial-gradient(circle, rgba(222, 184, 135, 0.5) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Header with pins */}
                  <div className="relative p-6 border-b-4 border-amber-950 bg-gradient-to-b from-amber-600/50 to-transparent">
                    <div className="flex items-center justify-between">
                      {/* Decorative pins */}
                      <div className="flex gap-3">
                        {[1, 2, 3].map((i) => (
                          <div 
                            key={i}
                            className="w-4 h-4 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-lg"
                            style={{
                              boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)',
                            }}
                          />
                        ))}
                      </div>
                      
                      <h2 
                        className="text-3xl md:text-4xl font-bold text-center flex-1 neon-text"
                        style={{ 
                          fontFamily: 'Press Start 2P, cursive',
                          color: '#00ffff',
                          textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #ff00ff',
                          letterSpacing: '2px'
                        }}
                      >
                        TESTIMONIALS
                      </h2>

                      <button
                        onClick={onClose}
                        className="game-button text-xs px-4 py-2 text-cyan-400 hover:text-cyan-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-center gap-4 mt-6">
                      {user ? (
                        <button
                          onClick={onAddTestimonial}
                          className="game-button text-xs px-6 py-3 text-cyan-400 hover:scale-105"
                        >
                          + ADD NOTE
                        </button>
                      ) : (
                        <button
                          onClick={onLogin}
                          className="game-button text-xs px-6 py-3 text-magenta-400"
                        >
                          LOGIN TO POST
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Scrollable content area */}
                  <div className="relative p-8 max-h-[calc(85vh-200px)] overflow-y-auto custom-scrollbar">
                    {testimonials.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="pixel-card p-8 max-w-md mx-auto">
                          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                          <p 
                            className="text-lg text-cyan-400"
                            style={{ fontFamily: 'VT323, monospace' }}
                          >
                            NO MESSAGES YET!<br/>
                            BE THE FIRST PLAYER TO LEAVE A NOTE
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => {
                          const colors = [
                            { bg: 'from-yellow-200 to-yellow-300', shadow: 'shadow-yellow-500/50', pin: 'from-red-500 to-red-700' },
                            { bg: 'from-pink-200 to-pink-300', shadow: 'shadow-pink-500/50', pin: 'from-blue-500 to-blue-700' },
                            { bg: 'from-green-200 to-green-300', shadow: 'shadow-green-500/50', pin: 'from-yellow-500 to-yellow-700' },
                            { bg: 'from-blue-200 to-blue-300', shadow: 'shadow-blue-500/50', pin: 'from-green-500 to-green-700' },
                            { bg: 'from-purple-200 to-purple-300', shadow: 'shadow-purple-500/50', pin: 'from-purple-500 to-purple-700' },
                            { bg: 'from-orange-200 to-orange-300', shadow: 'shadow-orange-500/50', pin: 'from-pink-500 to-pink-700' },
                          ];
                          const colorScheme = colors[index % colors.length];
                          
                          const rotation = (index % 3 === 0) ? -2 : (index % 3 === 1) ? 2 : -1;

                          return (
                            <motion.div
                              key={testimonial.id}
                              initial={{ opacity: 0, scale: 0.8, rotateZ: 0 }}
                              animate={{ opacity: 1, scale: 1, rotateZ: rotation }}
                              transition={{ delay: index * 0.05 }}
                              className="relative group"
                              style={{ transformStyle: 'preserve-3d' }}
                            >
                              {/* Push pin */}
                              <div 
                                className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br ${colorScheme.pin} z-10 shadow-lg`}
                                style={{
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)',
                                  transform: 'translateZ(10px) translateX(-50%)',
                                }}
                              >
                                <div className="absolute inset-0 rounded-full bg-white/30 blur-sm" />
                              </div>

                              {/* Sticky note */}
                              <div 
                                className={`relative p-5 bg-gradient-to-br ${colorScheme.bg} rounded-sm shadow-xl ${colorScheme.shadow} hover:shadow-2xl transition-all duration-300 hover:scale-105`}
                                style={{
                                  minHeight: '200px',
                                  transform: 'translateZ(5px)',
                                  boxShadow: `
                                    0 10px 25px rgba(0,0,0,0.2),
                                    0 20px 48px rgba(0,0,0,0.1),
                                    inset 0 0 20px rgba(255,255,255,0.3)
                                  `,
                                }}
                              >
                                {/* Paper lines */}
                                <div 
                                  className="absolute inset-0 opacity-10"
                                  style={{
                                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 24px, rgba(0,0,0,0.1) 24px, rgba(0,0,0,0.1) 25px)',
                                  }}
                                />

                                <div className="relative z-10">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-md">
                                      <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <h4 
                                        className="font-bold text-gray-900"
                                        style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                                      >
                                        {testimonial.author_name}
                                      </h4>
                                      <p 
                                        className="text-xs text-gray-600"
                                        style={{ fontFamily: 'VT323, monospace' }}
                                      >
                                        {new Date(testimonial.created_at).toLocaleDateString('en-US', { 
                                          month: 'short', 
                                          day: 'numeric',
                                          year: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  <p 
                                    className="text-gray-800 leading-relaxed"
                                    style={{ 
                                      fontFamily: 'VT323, monospace',
                                      fontSize: '18px',
                                      textShadow: '1px 1px 0px rgba(255,255,255,0.5)',
                                    }}
                                  >
                                    {testimonial.testimonial_text_en}
                                  </p>
                                </div>

                                {/* Corner curl effect */}
                                <div 
                                  className="absolute bottom-0 right-0 w-8 h-8 bg-gray-400/20"
                                  style={{
                                    clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                                  }}
                                />
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
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

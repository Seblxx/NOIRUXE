import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { SimpleMenu } from '../components/SimpleMenu';
import { ArrowLeft, ChevronLeft, ChevronRight, Grid, X, ExternalLink, Github } from 'lucide-react';

// Glitch text component with custom colors
const GlitchText = ({ text, color1, color2 }: { text: string; color1: string; color2: string }) => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block">
      <span
        className="relative z-10 text-white"
        style={{
          fontFamily: "'GT Pressura', sans-serif",
          textShadow: glitchActive 
            ? `2px 0 ${color1}, -2px 0 ${color2}` 
            : '0 0 40px rgba(255, 255, 255, 0.2)',
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
              color: color2,
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
              color: color1,
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              transform: 'translate(4px, 2px)',
              opacity: 0.8,
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
};

// Project data - you can later fetch this from your API
const projectsData = [
  {
    id: 'twin',
    title: 'TWIN',
    description: 'A full-stack dual panel stock market prediction interface built with Python, JavaScript, and HTML/CSS. Trained on Yahoo Finance data with login features, deployed via Render. The TWIN- panel offers quick EMA drift predictions, while TWIN+ enables complex analysis using Mean Reversion, GBM, and a Light ML model. Logged-in users can save predictions, track accuracy, or freely explore market trends.',
    videoUrl: '/Media/TWIN..mp4',
    images: [
      '/Media/TWIN picture.jpg',
      '/Media/TWIN picture II.jpg',
      '/Media/TWIN picture III.jpg',
      '/Media/TWIN picture III IV.jpg',
    ],
    technologies: ['Python', 'JavaScript', 'HTML/CSS'],
    projectUrl: '',
    githubUrl: '',
    glitchColors: { color1: '#ff00ff', color2: '#00bfff' }, // pink and blue
  },
  {
    id: 'vladtech',
    title: 'VLADTECH',
    description: 'A full-stack portfolio and booking system for a home renovation company, developed with a team of five. Focused primarily on front-end development, the platform includes an admin dashboard and employee manager to handle diverse business requirements. Built with Java, Spring Boot, Docker, React, and TypeScript.',
    videoUrl: '/Media/VLADTECH.mp4',
    images: [
      '/Media/VLADTECH picture.jpg',
      '/Media/VLADTECH picture II.jpg',
      '/Media/VLADTECH picture III.jpg',
    ],
    technologies: ['React', 'TypeScript', 'Java', 'Spring Boot', 'Docker'],
    projectUrl: '',
    githubUrl: '',
    glitchColors: { color1: '#ffff00', color2: '#ffffff' }, // yellow and white
  },
];

export const Projects = () => {
  const navigate = useNavigate();
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewAll, setViewAll] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentProject = projectsData[currentProjectIndex];

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentProjectIndex]);

  // Handle video transition and speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.playbackRate = 2.5; // Play video 2.5x faster
      videoRef.current.play();
    }
  }, [currentProjectIndex]);

  const nextProject = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentProjectIndex((prev) => (prev + 1) % projectsData.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevProject = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentProjectIndex((prev) => (prev - 1 + projectsData.length) % projectsData.length);
      setIsTransitioning(false);
    }, 300);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentProject.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentProject.images.length) % currentProject.images.length);
  };

  const selectProject = (index: number) => {
    setCurrentProjectIndex(index);
    setViewAll(false);
  };

  return (
    <div className="min-h-screen h-screen bg-black relative overflow-hidden crt-effect">
      <div className="scanline" />
      <CustomCursor />

      {/* Video Background */}
      <AnimatePresence mode="wait">
        {!viewAll && (
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0"
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.35)' }}
            >
              <source src={currentProject.videoUrl} type="video/mp4" />
            </video>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button - positioned at top left (matching Contact page) */}
      <motion.button
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ x: -5 }}
        className="fixed top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors z-50"
        style={{ fontFamily: "'GT Pressura', sans-serif", letterSpacing: '0.2em' }}
      >
        <ArrowLeft size={18} />
        <span className="text-sm tracking-widest">HOME</span>
      </motion.button>

      {/* View All button - positioned at top right */}
      <motion.button
        onClick={() => setViewAll(!viewAll)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        className="fixed top-8 right-8 flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg text-white/50 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all z-50"
        style={{ fontFamily: "'GT Pressura', sans-serif", letterSpacing: '0.1em' }}
      >
        {viewAll ? <X size={18} /> : <Grid size={18} />}
        <span className="text-sm tracking-wider">{viewAll ? 'CLOSE' : 'VIEW ALL'}</span>
      </motion.button>

      <AnimatePresence mode="wait">
        {viewAll ? (
          /* View All Grid */
          <motion.div
            key="grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 h-screen flex items-center justify-center px-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
              {projectsData.map((project, index) => (
                <motion.button
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => selectProject(index)}
                  className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ filter: 'brightness(0.4)' }}
                  >
                    <source src={project.videoUrl} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 
                      className="text-4xl md:text-5xl font-black text-white tracking-tight"
                      style={{ 
                        fontFamily: "'GT Pressura', sans-serif",
                        textShadow: '0 0 30px rgba(255,255,255,0.3)'
                      }}
                    >
                      {project.title}
                    </h3>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Immersive Project View - Centered Layout with Description on Right */
          <motion.div
            key="immersive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 h-screen flex items-center justify-center"
          >
            {/* Centered content */}
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              {/* Title with Project Navigation Arrows */}
              <div className="flex items-center gap-5 mb-2">
                <motion.button
                  onClick={prevProject}
                  whileHover={{ scale: 1.1, x: -3 }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <ChevronLeft size={36} className="text-white/50 hover:text-white" />
                </motion.button>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter">
                  <GlitchText 
                    text={currentProject.title} 
                    color1={currentProject.glitchColors.color1}
                    color2={currentProject.glitchColors.color2}
                  />
                </h1>

                <motion.button
                  onClick={nextProject}
                  whileHover={{ scale: 1.1, x: 3 }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <ChevronRight size={36} className="text-white/50 hover:text-white" />
                </motion.button>
              </div>

              {/* Project counter */}
              <div 
                className="text-white/30 text-xs tracking-widest mb-4"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                {String(currentProjectIndex + 1).padStart(2, '0')} / {String(projectsData.length).padStart(2, '0')}
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {currentProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs tracking-wider text-white/60 border border-white/20 rounded-full"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Image with arrows - CENTERED + FLIP CARD */}
              <div className="flex items-center gap-5">
                <motion.button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  whileHover={{ scale: 1.1, x: -2 }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <ChevronLeft size={24} className="text-white/50 hover:text-white" />
                </motion.button>

                {/* Smooth Zoom/Fade Transition Container */}
                <div 
                  className="cursor-pointer relative"
                  style={{ width: '520px', height: '293px' }}
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <AnimatePresence mode="wait">
                    {!showDetails ? (
                      /* Image View */
                      <motion.div
                        key="image"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-lg overflow-hidden border border-white/20"
                      >
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={currentImageIndex}
                            src={currentProject.images[currentImageIndex]}
                            alt={`${currentProject.title} screenshot`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full object-cover"
                          />
                        </AnimatePresence>
                        
                        {/* Image counter */}
                        <div 
                          className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-white/70 text-xs tracking-wider"
                          style={{ fontFamily: "'GT Pressura', sans-serif" }}
                        >
                          {currentImageIndex + 1} / {currentProject.images.length}
                        </div>
                      </motion.div>
                    ) : (
                      /* Description View */
                      <motion.div
                        key="description"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-lg overflow-hidden bg-black/95 flex flex-col justify-center items-center p-8"
                      >
                        <p 
                          className="text-white text-sm leading-relaxed text-center mb-4"
                          style={{ fontFamily: "'GT Pressura', sans-serif" }}
                        >
                          {currentProject.description}
                        </p>
                        
                        {/* Links */}
                        <div className="flex gap-3">
                          {currentProject.projectUrl && (
                            <a
                              href={currentProject.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold text-xs tracking-wider rounded hover:bg-white/90 transition-all"
                              style={{ fontFamily: "'GT Pressura', sans-serif" }}
                            >
                              <ExternalLink size={12} />
                              VIEW
                            </a>
                          )}
                          {currentProject.githubUrl && (
                            <a
                              href={currentProject.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 px-4 py-2 border border-white/30 text-white font-bold text-xs tracking-wider rounded hover:bg-white/10 transition-all"
                              style={{ fontFamily: "'GT Pressura', sans-serif" }}
                            >
                              <Github size={12} />
                              CODE
                            </a>
                          )}
                        </div>
                        
                        {/* Click to go back */}
                        <div 
                          className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-wider"
                          style={{ fontFamily: "'GT Pressura', sans-serif" }}
                        >
                          CLICK TO GO BACK
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  whileHover={{ scale: 1.1, x: 2 }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <ChevronRight size={24} className="text-white/50 hover:text-white" />
                </motion.button>
              </div>

              {/* Click for details text - positioned below image */}
              {!showDetails && (
                <div 
                  className="mt-3 text-white/50 text-xs tracking-wider"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  CLICK FOR DETAILS
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Menu */}
      <SimpleMenu 
        items={[
          { label: 'Projects', onClick: () => {} },
          { label: 'Contact', onClick: () => navigate('/contact') },
        ]} 
        isExpanded={!viewAll} 
      />
    </div>
  );
};

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SimpleMenu } from '../components/SimpleMenu';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import { useMenuItems } from '../hooks/useMenuItems';
import { T } from '../components/Translate';
import { useLanguage } from '../contexts/LanguageContext';
import * as projectsService from '../services/projectsService';

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

// Cycle through glitch color pairs for projects
const glitchColorPairs = [
  { color1: '#ff00ff', color2: '#00bfff' },
  { color1: '#ffff00', color2: '#ffffff' },
  { color1: '#00ff88', color2: '#ff3333' },
  { color1: '#a855f7', color2: '#22d3ee' },
  { color1: '#ff6b6b', color2: '#4ade80' },
];

export const Projects = () => {
  const navigate = useNavigate();
  const { menuItems } = useMenuItems();
  const { language } = useLanguage();
  const [projects, setProjects] = useState<projectsService.Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Custom cursor tracking for Projects page
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const currentProject = projects[currentProjectIndex];

  // Get glitch colors for a project index
  const getGlitchColors = (index: number) => glitchColorPairs[index % glitchColorPairs.length];

  // Parse gallery URLs from project or use image_url as fallback
  const getProjectImages = (project: projectsService.Project) => {
    const fixUrl = (url: string) => {
      // Encode spaces in URLs that aren't already encoded
      if (url.startsWith('http')) return url;
      // For relative paths like /Media/TWIN picture.jpg, encode the filename part
      const parts = url.split('/');
      return parts.map(part => encodeURIComponent(part)).join('/');
    };
    if (project.gallery_urls && project.gallery_urls.length > 0) return project.gallery_urls.map(fixUrl);
    if (project.image_url) return [fixUrl(project.image_url)];
    return [];
  };

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentProjectIndex]);

  // Handle reset when project changes
  useEffect(() => {
    setShowDetails(false);
  }, [currentProjectIndex]);


  const nextProject = () => {
    if (isTransitioning || projects.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevProject = () => {
    if (isTransitioning || projects.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
      setIsTransitioning(false);
    }, 300);
  };

  const nextImage = () => {
    if (!currentProject) return;
    const images = getProjectImages(currentProject);
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!currentProject) return;
    const images = getProjectImages(currentProject);
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };



  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  // No projects
  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center crt-effect">
        <div className="scanline" />
        <p className="text-white/50 text-lg" style={{ fontFamily: "'GT Pressura', sans-serif" }}><T>No projects yet.</T></p>
        <motion.button
          onClick={() => navigate('/')}
          className="mt-6 text-white/50 hover:text-white transition-colors"
          style={{ fontFamily: "'GT Pressura', sans-serif", letterSpacing: '0.2em' }}
        >
          <T>HOME</T>
        </motion.button>
      </div>
    );
  }

  const currentImages = getProjectImages(currentProject);
  const currentGlitch = getGlitchColors(currentProjectIndex);

  return (
    <>
    <div
      className="fixed w-2 h-2 bg-white rounded-full pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 99999,
        boxShadow: '0 0 6px 2px rgba(255,255,255,0.5)',
      }}
    />
    <div className="min-h-screen h-screen bg-black relative overflow-hidden crt-effect">
      <div className="scanline" />

      {/* Background: Video or Image */}
      <AnimatePresence mode="wait">
        {currentProject && (
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0"
          >
            {currentProject.video_url ? (
              <video
                key={currentProject.video_url}
                src={currentProject.video_url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.35)' }}
              />
            ) : currentProject.image_url ? (
              <img
                src={currentProject.image_url}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.35)' }}
              />
            ) : null}
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
        <span className="text-sm tracking-widest"><T>HOME</T></span>
      </motion.button>

      {/* Visit Project link - bottom right */}
      {currentProject?.project_url && (
        <motion.a
          href={currentProject.project_url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.05, y: -3 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 border border-white/30 rounded-lg text-white/60 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all backdrop-blur-sm"
          style={{ fontFamily: "'GT Pressura', sans-serif", letterSpacing: '0.15em' }}
        >
          <ExternalLink size={16} />
          <span className="text-xs md:text-sm tracking-widest uppercase"><T>VISIT</T></span>
        </motion.a>
      )}

      {/* Immersive Project View - Centered Layout with Description on Right */}
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
                    text={(language === 'fr' ? (currentProject.title_fr || currentProject.title_en) : currentProject.title_en).toUpperCase()} 
                    color1={currentGlitch.color1}
                    color2={currentGlitch.color2}
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
                {String(currentProjectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </div>

              {/* Technologies */}
              {currentProject.technologies && currentProject.technologies.length > 0 && (
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
              )}

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
                        {currentImages.length > 0 ? (
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={currentImageIndex}
                              src={currentImages[currentImageIndex]}
                              alt={`${language === 'fr' ? (currentProject.title_fr || currentProject.title_en) : currentProject.title_en} screenshot`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="w-full h-full object-cover"
                            />
                          </AnimatePresence>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black/80">
                            <p className="text-white/30 text-sm tracking-widest uppercase" style={{ fontFamily: "'GT Pressura', sans-serif" }}>
                              <T>No images</T>
                            </p>
                          </div>
                        )}
                        
                        {/* Image counter */}
                        {currentImages.length > 1 && (
                          <div 
                            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-white/70 text-xs tracking-wider"
                            style={{ fontFamily: "'GT Pressura', sans-serif" }}
                          >
                            {currentImageIndex + 1} / {currentImages.length}
                          </div>
                        )}
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
                          {language === 'fr' ? (currentProject.description_fr || currentProject.description_en) : currentProject.description_en}
                        </p>
                        
                        {/* Links */}
                        <div className="flex gap-3">
                          {currentProject.project_url && (
                            <a
                              href={currentProject.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold text-xs tracking-wider rounded hover:bg-white/90 transition-all"
                              style={{ fontFamily: "'GT Pressura', sans-serif" }}
                            >
                              <ExternalLink size={12} />
                              <T>VIEW</T>
                            </a>
                          )}
                          {currentProject.github_url && (
                            <a
                              href={currentProject.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 px-4 py-2 border border-white/30 text-white font-bold text-xs tracking-wider rounded hover:bg-white/10 transition-all"
                              style={{ fontFamily: "'GT Pressura', sans-serif" }}
                            >
                              <Github size={12} />
                              <T>CODE</T>
                            </a>
                          )}
                        </div>
                        
                        {/* Click to go back */}
                        <div 
                          className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-wider"
                          style={{ fontFamily: "'GT Pressura', sans-serif" }}
                        >
                          <T>CLICK TO GO BACK</T>
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
                  <T>CLICK FOR DETAILS</T>
                </div>
              )}
        </motion.div>
      </motion.div>

      {/* Next Project Button - bottom left */}
      {projects.length > 1 && (
        <motion.button
          onClick={nextProject}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ y: -3 }}
          className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-40 flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 border border-white/30 rounded-lg text-white/60 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all backdrop-blur-sm"
          style={{ fontFamily: "'GT Pressura', sans-serif", letterSpacing: '0.15em' }}
        >
          <span className="text-xs md:text-sm tracking-widest uppercase">
            {language === 'fr' ? 'SUIVANT' : 'NEXT'}
          </span>
          <ChevronRight size={16} />
        </motion.button>
      )}

      {/* Bottom Menu */}
      <SimpleMenu 
        items={menuItems} 
        isExpanded={true} 
      />
    </div>
    </>
  );
};

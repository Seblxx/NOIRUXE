import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { TiltedCard } from '../components/TiltedCard';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, GraduationCap, Heart, Gamepad2, Music, Camera, Palette, Book, Dumbbell, Plane, Coffee } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as skillsService from '../services/skillsService';
import * as workExperienceService from '../services/workExperienceService';
import * as educationService from '../services/educationService';
import * as hobbiesService from '../services/hobbiesService';

// Icon mapping for hobbies
const iconMap: { [key: string]: React.ElementType } = {
  gaming: Gamepad2,
  music: Music,
  photography: Camera,
  art: Palette,
  reading: Book,
  fitness: Dumbbell,
  travel: Plane,
  coffee: Coffee,
  default: Heart,
};

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
    <span className="relative inline-block">
      <span
        className="relative z-10 text-white"
        style={{
          fontFamily: "'GT Pressura', sans-serif",
          textShadow: glitchActive 
            ? '2px 0 #00ffff, -2px 0 #ff00ff' 
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
              color: '#ff00ff',
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
              color: '#00ffff',
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

// Marquee background
const MarqueeGlitchText = ({ direction = 1, speed = 20, opacity = 0.1, glowColor = '#00ffff', text = 'SKILLS' }: { direction?: number; speed?: number; opacity?: number; glowColor?: string; text?: string }) => {
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

// Category colors
const categoryColors: Record<string, string> = {
  'Programming Languages': '#00ffff',
  'Web Technologies': '#00ffff',
  'Databases': '#00ffff',
  'Frontend': '#00ffff',
  'Backend': '#00ffff',
  'DevOps': '#00ffff',
  'Cloud': '#00ffff',
  'Tools': '#00ffff',
  'Methodologies': '#00ffff',
};

export const Skills = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [skills, setSkills] = useState<skillsService.Skill[]>([]);
  const [experiences, setExperiences] = useState<workExperienceService.WorkExperience[]>([]);
  const [education, setEducation] = useState<educationService.Education[]>([]);
  const [hobbies, setHobbies] = useState<hobbiesService.Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Index states for each section
  const [currentExpIndex, setCurrentExpIndex] = useState(0);
  const [currentSkillCatIndex, setCurrentSkillCatIndex] = useState(0);
  const [currentEduIndex, setCurrentEduIndex] = useState(0);
  const [currentHobbyIndex, setCurrentHobbyIndex] = useState(0);
  
  const skillsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsData, expData, eduData, hobbiesData] = await Promise.all([
          skillsService.getSkills(),
          workExperienceService.getWorkExperience(),
          educationService.getEducation(),
          hobbiesService.getHobbies()
        ]);
        setSkills(skillsData);
        setExperiences(expData);
        setEducation(eduData);
        setHobbies(hobbiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, skillsService.Skill[]>);

  const categories = Object.entries(groupedSkills);

  // Skills navigation
  const nextSkillCat = () => {
    if (categories.length <= 1) return;
    setCurrentSkillCatIndex((prev) => (prev + 1) % categories.length);
  };

  const prevSkillCat = () => {
    if (categories.length <= 1) return;
    setCurrentSkillCatIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  // Experience navigation
  const nextExp = () => {
    if (experiences.length <= 1) return;
    setCurrentExpIndex((prev) => (prev + 1) % experiences.length);
  };

  const prevExp = () => {
    if (experiences.length <= 1) return;
    setCurrentExpIndex((prev) => (prev - 1 + experiences.length) % experiences.length);
  };

  // Education navigation
  const nextEdu = () => {
    if (education.length <= 1) return;
    setCurrentEduIndex((prev) => (prev + 1) % education.length);
  };

  const prevEdu = () => {
    if (education.length <= 1) return;
    setCurrentEduIndex((prev) => (prev - 1 + education.length) % education.length);
  };

  // Hobbies navigation
  const nextHobby = () => {
    if (hobbies.length <= 1) return;
    setCurrentHobbyIndex((prev) => (prev + 1) % hobbies.length);
  };

  const prevHobby = () => {
    if (hobbies.length <= 1) return;
    setCurrentHobbyIndex((prev) => (prev - 1 + hobbies.length) % hobbies.length);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'short' });
  };

  const getIcon = (iconName: string) => {
    const key = iconName?.toLowerCase() || 'default';
    return iconMap[key] || iconMap.default;
  };

  const currentExp = experiences[currentExpIndex];
  const currentEdu = education[currentEduIndex];
  const currentHobby = hobbies[currentHobbyIndex];
  const HobbyIcon = currentHobby ? getIcon(currentHobby.icon_url?.split('/').pop()?.split('.')[0] || '') : Heart;

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
          <MarqueeGlitchText direction={1} speed={15} opacity={0.04} glowColor="#00ffff" text={language === 'fr' ? 'COMPÉTENCES' : 'SKILLS'} />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={-1} speed={18} opacity={0.05} glowColor="#22c55e" text={language === 'fr' ? 'EXPÉRIENCE' : 'EXPERIENCE'} />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={1} speed={12} opacity={0.04} glowColor="#a855f7" text={language === 'fr' ? 'ÉDUCATION' : 'EDUCATION'} />
        </div>
        <div className="overflow-hidden">
          <MarqueeGlitchText direction={-1} speed={16} opacity={0.05} glowColor="#ec4899" text={language === 'fr' ? 'LOISIRS' : 'HOBBIES'} />
        </div>
      </div>

      {/* Back button */}
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

      {/* Main content - 2x2 Grid */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
          
          {/* ============ SKILLS SECTION (Top Left) ============ */}
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            {/* Title */}
            <div className="text-center mb-4">
              <h2 
                className="text-xl md:text-2xl font-black tracking-tight"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                <GlitchText text={language === 'fr' ? 'COMPÉTENCES' : 'SKILLS'} />
              </h2>
              {categories.length > 0 && (
                <div 
                  className="text-white/30 text-xs tracking-widest mt-1"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  {String(currentSkillCatIndex + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
                </div>
              )}
            </div>

            {/* Skills carousel */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-white/50 min-h-[200px]">
                {language === 'fr' ? 'Chargement...' : 'Loading...'}
              </div>
            ) : (
              <div className="flex items-stretch gap-4">
                {/* Left Arrow */}
                <motion.button
                  onClick={prevSkillCat}
                  whileHover={{ scale: 1.1, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-12 h-auto rounded-xl border border-cyan-500/50 bg-black/80 backdrop-blur-sm flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-all"
                >
                  <ChevronLeft size={28} />
                </motion.button>

                {/* Skill Category Card */}
                <motion.div
                  key={currentSkillCatIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  ref={skillsContainerRef}
                  className="flex-1 p-5 rounded-xl border bg-black/70 backdrop-blur-md min-h-[200px]"
                  style={{ 
                    borderColor: (categoryColors[categories[currentSkillCatIndex]?.[0]] || '#ffffff') + '50',
                    boxShadow: `0 0 40px ${(categoryColors[categories[currentSkillCatIndex]?.[0]] || '#ffffff')}15`
                  }}
                >
                  {categories[currentSkillCatIndex] && (
                    <>
                      <h3 
                        className="text-sm font-bold mb-3 tracking-widest uppercase"
                        style={{ 
                          fontFamily: "'GT Pressura', sans-serif",
                          color: categoryColors[categories[currentSkillCatIndex][0]] || '#00ffff'
                        }}
                      >
                        {categories[currentSkillCatIndex][0]}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories[currentSkillCatIndex][1].map((skill) => (
                          <div 
                            key={skill.id}
                            className="flex items-center gap-2"
                          >
                            <div 
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: categoryColors[categories[currentSkillCatIndex][0]] || '#00ffff' }}
                            />
                            <span className="text-white/90 text-sm">
                              {language === 'fr' ? skill.name_fr : skill.name_en}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Right Arrow */}
                <motion.button
                  onClick={nextSkillCat}
                  whileHover={{ scale: 1.1, x: 3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-12 h-auto rounded-xl border border-cyan-500/50 bg-black/80 backdrop-blur-sm flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-all"
                >
                  <ChevronRight size={28} />
                </motion.button>
              </div>
            )}
          </motion.section>

          {/* ============ EXPERIENCE SECTION (Top Right) ============ */}
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Title */}
            <div className="text-center mb-4">
              <h2 
                className="text-xl md:text-2xl font-black tracking-tight"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                <GlitchText text={language === 'fr' ? 'EXPÉRIENCE' : 'EXPERIENCE'} />
              </h2>
              {experiences.length > 0 && (
                <div 
                  className="text-white/30 text-xs tracking-widest mt-1"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  {String(currentExpIndex + 1).padStart(2, '0')} / {String(experiences.length).padStart(2, '0')}
                </div>
              )}
            </div>

            {/* Experience carousel */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-white/50 min-h-[200px]">
                {language === 'fr' ? 'Chargement...' : 'Loading...'}
              </div>
            ) : experiences.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-white/50 min-h-[200px]">
                {language === 'fr' ? 'Aucune expérience' : 'No experience'}
              </div>
            ) : (
              <div className="flex items-stretch gap-4">
                {/* Left Arrow */}
                <motion.button
                  onClick={prevExp}
                  whileHover={{ scale: 1.1, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-12 h-auto rounded-xl border border-green-500/50 bg-black/80 backdrop-blur-sm flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-all"
                >
                  <ChevronLeft size={28} />
                </motion.button>

                {/* Experience Card */}
                <motion.div
                  key={currentExpIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 p-5 rounded-xl border border-green-500/30 bg-black/70 backdrop-blur-md relative overflow-hidden min-h-[200px]"
                  style={{
                    boxShadow: '0 0 40px rgba(34, 197, 94, 0.1)'
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[60px]" />
                  
                  {currentExp && (
                    <div className="relative z-10">
                      <h3 
                        className="text-base font-bold text-white mb-1"
                        style={{ fontFamily: "'GT Pressura', sans-serif" }}
                      >
                        {language === 'fr' ? currentExp.position_fr : currentExp.position_en}
                      </h3>
                      <p className="text-green-400 font-medium text-sm mb-2">{currentExp.company_name}</p>
                      
                      <div className="flex items-center gap-2 text-white/50 text-xs mb-3">
                        <Calendar size={12} />
                        <span>
                          {formatDate(currentExp.start_date)} — {currentExp.is_current ? (language === 'fr' ? 'Présent' : 'Present') : formatDate(currentExp.end_date || '')}
                        </span>
                      </div>

                      <p className="text-white/60 text-sm line-clamp-3">
                        {language === 'fr' ? currentExp.description_fr : currentExp.description_en}
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Right Arrow */}
                <motion.button
                  onClick={nextExp}
                  whileHover={{ scale: 1.1, x: 3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-12 h-auto rounded-xl border border-green-500/50 bg-black/80 backdrop-blur-sm flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-all"
                >
                  <ChevronRight size={28} />
                </motion.button>
              </div>
            )}
          </motion.section>

          {/* ============ EDUCATION SECTION (Bottom Left) ============ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Title */}
            <div className="text-center mb-4">
              <h2 
                className="text-xl md:text-2xl font-black tracking-tight"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                <GlitchText text={language === 'fr' ? 'ÉDUCATION' : 'EDUCATION'} />
              </h2>
              {education.length > 0 && (
                <div 
                  className="text-white/30 text-xs tracking-widest mt-1"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  {String(currentEduIndex + 1).padStart(2, '0')} / {String(education.length).padStart(2, '0')}
                </div>
              )}
            </div>

            {/* Education carousel */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-white/50 min-h-[200px]">
                {language === 'fr' ? 'Chargement...' : 'Loading...'}
              </div>
            ) : education.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-white/50 min-h-[200px]">
                {language === 'fr' ? 'Aucune éducation' : 'No education'}
              </div>
            ) : (
              <div className="flex items-stretch gap-4">
                {/* Left Arrow */}
                <motion.button
                  onClick={prevEdu}
                  whileHover={{ scale: 1.1, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-12 h-auto rounded-xl border border-purple-500/50 bg-black/80 backdrop-blur-sm flex items-center justify-center text-purple-400 hover:bg-purple-500/20 transition-all"
                >
                  <ChevronLeft size={28} />
                </motion.button>

                {/* Education Card */}
                <motion.div
                  key={currentEduIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 p-5 rounded-xl border border-purple-500/30 bg-black/70 backdrop-blur-md relative overflow-hidden min-h-[200px]"
                  style={{
                    boxShadow: '0 0 40px rgba(168, 85, 247, 0.1)'
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px]" />
                  
                  {currentEdu && (
                    <div className="relative z-10">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                          <GraduationCap size={20} className="text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h3 
                            className="text-base font-bold text-white"
                            style={{ fontFamily: "'GT Pressura', sans-serif" }}
                          >
                            {language === 'fr' ? currentEdu.degree_fr : currentEdu.degree_en}
                          </h3>
                          <p className="text-purple-400 font-medium text-sm">{currentEdu.institution_name}</p>
                        </div>
                      </div>

                      {(currentEdu.field_of_study_en || currentEdu.field_of_study_fr) && (
                        <p className="text-white/60 text-sm mb-2">
                          {language === 'fr' ? currentEdu.field_of_study_fr : currentEdu.field_of_study_en}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-white/50 text-xs">
                        <Calendar size={12} />
                        <span>
                          {formatDate(currentEdu.start_date)} — {currentEdu.is_current ? (language === 'fr' ? 'Présent' : 'Present') : formatDate(currentEdu.end_date || '')}
                        </span>
                        {currentEdu.grade && (
                          <span className="ml-2 px-2 py-0.5 bg-purple-500/20 rounded text-purple-300 text-xs">
                            GPA: {currentEdu.grade}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Right Arrow */}
                <motion.button
                  onClick={nextEdu}
                  whileHover={{ scale: 1.1, x: 3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-12 h-auto rounded-xl border border-purple-500/50 bg-black/80 backdrop-blur-sm flex items-center justify-center text-purple-400 hover:bg-purple-500/20 transition-all"
                >
                  <ChevronRight size={28} />
                </motion.button>
              </div>
            )}
          </motion.section>

          {/* ============ HOBBIES SECTION (Bottom Right) ============ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col"
          >
            {/* Title */}
            <div className="text-center mb-4">
              <h2 
                className="text-xl md:text-2xl font-black tracking-tight"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                <GlitchText text={language === 'fr' ? 'LOISIRS' : 'HOBBIES'} />
              </h2>
              {hobbies.length > 0 && (
                <div 
                  className="text-white/30 text-xs tracking-widest mt-1"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  {String(currentHobbyIndex + 1).padStart(2, '0')} / {String(hobbies.length).padStart(2, '0')}
                </div>
              )}
            </div>

            {/* Hobbies carousel */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-white/50 min-h-[200px]">
                {language === 'fr' ? 'Chargement...' : 'Loading...'}
              </div>
            ) : hobbies.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-white/50 min-h-[200px]">
                {language === 'fr' ? 'Aucun loisir' : 'No hobbies'}
              </div>
            ) : (
              <div className="flex items-stretch gap-4">
                {/* Left Arrow */}
                <motion.button
                  onClick={prevHobby}
                  whileHover={{ scale: 1.1, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-12 h-auto rounded-xl border border-pink-500/50 bg-black/80 backdrop-blur-sm flex items-center justify-center text-pink-400 hover:bg-pink-500/20 transition-all"
                >
                  <ChevronLeft size={28} />
                </motion.button>

                {/* Hobby Card */}
                <motion.div
                  key={currentHobbyIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 p-5 rounded-xl border border-pink-500/30 bg-black/70 backdrop-blur-md relative overflow-hidden min-h-[200px]"
                  style={{
                    boxShadow: '0 0 40px rgba(236, 72, 153, 0.1)'
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[60px]" />
                  
                  {currentHobby && (
                    <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                      <motion.div 
                        className="p-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 mb-3"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <HobbyIcon size={32} className="text-pink-400" />
                      </motion.div>

                      <h3 
                        className="text-base font-bold text-white mb-2"
                        style={{ fontFamily: "'GT Pressura', sans-serif" }}
                      >
                        {language === 'fr' ? currentHobby.name_fr : currentHobby.name_en}
                      </h3>

                      <p className="text-white/60 text-sm line-clamp-3">
                        {language === 'fr' ? currentHobby.description_fr : currentHobby.description_en}
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Right Arrow */}
                <motion.button
                  onClick={nextHobby}
                  whileHover={{ scale: 1.1, x: 3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-12 h-auto rounded-xl border border-pink-500/50 bg-black/80 backdrop-blur-sm flex items-center justify-center text-pink-400 hover:bg-pink-500/20 transition-all"
                >
                  <ChevronRight size={28} />
                </motion.button>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { SimpleMenu } from '../components/SimpleMenu';
import { supabase } from '../services/authService';
import { useMenuItems } from '../hooks/useMenuItems';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  GraduationCap, 
  Heart, 
  Gamepad2, 
  Music, 
  Camera, 
  Palette, 
  Book, 
  Dumbbell, 
  Plane, 
  Coffee,
  Code,
  Briefcase,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { T } from '../components/Translate';
import * as skillsService from '../services/skillsService';
import * as workExperienceService from '../services/workExperienceService';
import * as educationService from '../services/educationService';
import * as hobbiesService from '../services/hobbiesService';

// Icon mapping for hobbies
const hobbyIconMap: { [key: string]: React.ElementType } = {
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

// Category colors for skills
const categoryColors: Record<string, string> = {
  'Programming Languages': '#00ffff',
  'Web Technologies': '#ff00ff',
  'Databases': '#00ff88',
  'Frontend': '#ffaa00',
  'Backend': '#ff6b6b',
  'DevOps': '#a855f7',
  'Cloud': '#3b82f6',
  'Tools': '#22c55e',
  'Methodologies': '#f59e0b',
};

// Section colors
const sectionColors = {
  skills: { primary: '#00ffff', secondary: 'cyan' },
  experience: { primary: '#22c55e', secondary: 'green' },
  education: { primary: '#a855f7', secondary: 'purple' },
  hobbies: { primary: '#ec4899', secondary: 'pink' },
};

// Navigation button component
const NavButton = ({ 
  direction, 
  onClick, 
  color 
}: { 
  direction: 'left' | 'right'; 
  onClick: () => void; 
  color: string;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 0.9 }}
    className="flex-shrink-0 w-10 h-10 rounded-full border bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all"
    style={{ 
      borderColor: `${color}40`,
      color: color,
    }}
  >
    {direction === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
  </motion.button>
);

// Section header component
const SectionHeader = ({ 
  icon: Icon, 
  title, 
  current = 0, 
  total = 0, 
  color,
  showCounter = true,
}: { 
  icon: React.ElementType; 
  title: string; 
  current?: number; 
  total?: number; 
  color: string;
  showCounter?: boolean;
}) => (
  <div className="flex items-center justify-between mb-2 px-1 flex-shrink-0">
    <div className="flex items-center gap-2">
      <div 
        className="p-2 rounded-lg border"
        style={{ 
          backgroundColor: `${color}15`,
          borderColor: `${color}30`,
        }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <h2 
        className="text-base md:text-xl font-black tracking-wider uppercase"
        style={{ 
          fontFamily: "'GT Pressura', sans-serif",
          color: color,
        }}
      >
        {title}
      </h2>
    </div>
    {showCounter && total > 0 && (
      <div 
        className="text-xs tracking-widest opacity-50"
        style={{ fontFamily: "'GT Pressura', sans-serif" }}
      >
        {String(current + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
      </div>
    )}
  </div>
);

export const Overview = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  // Data states
  const [skills, setSkills] = useState<skillsService.Skill[]>([]);
  const [experiences, setExperiences] = useState<workExperienceService.WorkExperience[]>([]);
  const [education, setEducation] = useState<educationService.Education[]>([]);
  const [hobbies, setHobbies] = useState<hobbiesService.Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Index states for each section
  const [skillCatIndex, setSkillCatIndex] = useState(0);
  const [expIndex, setExpIndex] = useState(0);
  const [eduIndex, setEduIndex] = useState(0);
  const [hobbyIndex, setHobbyIndex] = useState(0);
  const { menuItems } = useMenuItems();

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

  // Navigation functions
  const navSkill = (dir: number) => {
    if (categories.length <= 1) return;
    setSkillCatIndex((prev) => (prev + dir + categories.length) % categories.length);
  };
  
  const navExp = (dir: number) => {
    if (experiences.length <= 1) return;
    setExpIndex((prev) => (prev + dir + experiences.length) % experiences.length);
  };
  
  const navEdu = (dir: number) => {
    if (education.length <= 1) return;
    setEduIndex((prev) => (prev + dir + education.length) % education.length);
  };
  
  const navHobby = (dir: number) => {
    if (hobbies.length <= 1) return;
    setHobbyIndex((prev) => (prev + dir + hobbies.length) % hobbies.length);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    // Parse as local date (not UTC) to avoid timezone offset shifting the day
    const parts = dateStr.split('T')[0].split('-');
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]) || 1);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const getHobbyIcon = (iconName: string) => {
    const key = iconName?.toLowerCase() || 'default';
    return hobbyIconMap[key] || hobbyIconMap.default;
  };

  // Current items
  const currentCat = categories[skillCatIndex];
  const currentExp = experiences[expIndex];
  const currentEdu = education[eduIndex];
  const currentHobby = hobbies[hobbyIndex];
  const HobbyIcon = currentHobby ? getHobbyIcon(currentHobby.icon_url?.split('/').pop()?.split('.')[0] || '') : Heart;

  return (
    <div className="h-screen w-screen bg-black overflow-hidden crt-effect fixed inset-0">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>
      <div className="scanline" />
      <CustomCursor />

      {/* Menu Bar */}
      <SimpleMenu items={menuItems} isExpanded={true} />

      {/* 2x2 Grid Container */}
      <div 
        className="h-full w-full p-3 md:p-5 gap-3 md:gap-4"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
        }}
      >
        
        {/* ============ SKILLS QUADRANT (Top Left) ============ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-xl bg-black/60 backdrop-blur-md overflow-hidden"
          style={{ border: `2px solid ${sectionColors.skills.primary}40` }}
        >
          <div className="relative z-10 h-full flex flex-col p-4 md:p-5">
            <SectionHeader 
              icon={Code} 
              title={language === 'fr' ? 'COMPÉTENCES' : 'SKILLS'}
              color={sectionColors.skills.primary}
              showCounter={true}
              current={skillCatIndex}
              total={categories.length}
            />
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
                <T>Loading...</T>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-white/30 text-base">
                <T>No skills</T>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-3">
                {categories.length > 1 && (
                  <NavButton direction="left" onClick={() => navSkill(-1)} color={sectionColors.skills.primary} />
                )}

                <div className="flex-1 min-w-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={skillCatIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="w-full text-center"
                    >
                      {currentCat && (
                        <>
                          <h3 
                            className="text-xl md:text-2xl font-bold mb-3 tracking-widest uppercase"
                            style={{ 
                              fontFamily: "'GT Pressura', sans-serif",
                              color: categoryColors[currentCat[0]] || sectionColors.skills.primary
                            }}
                          >
                            <T>{currentCat[0]}</T>
                          </h3>
                          <p className="text-white/60 text-base md:text-lg leading-relaxed">
                            {currentCat[1].map((skill, i) => (
                              <span key={skill.id}>
                                {language === 'fr' ? (skill.name_fr || skill.name_en) : skill.name_en}
                                {i < currentCat[1].length - 1 && ', '}
                              </span>
                            ))}
                          </p>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {categories.length > 1 && (
                  <NavButton direction="right" onClick={() => navSkill(1)} color={sectionColors.skills.primary} />
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* ============ EXPERIENCE QUADRANT (Top Right) ============ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative rounded-xl bg-black/60 backdrop-blur-md overflow-hidden"
          style={{ border: `2px solid ${sectionColors.experience.primary}40` }}
        >
          <div className="relative z-10 h-full flex flex-col p-4 md:p-5">
            <SectionHeader 
              icon={Briefcase} 
              title={language === 'fr' ? 'EXPÉRIENCE' : 'EXPERIENCE'}
              current={expIndex}
              total={experiences.length}
              color={sectionColors.experience.primary}
            />
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
                <T>Loading...</T>
              </div>
            ) : experiences.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-white/30 text-base">
                <T>No experience</T>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-3">
                {experiences.length > 1 && (
                  <NavButton direction="left" onClick={() => navExp(-1)} color={sectionColors.experience.primary} />
                )}
                
                <div className="flex-1 min-w-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={expIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="w-full text-center"
                    >
                      {currentExp && (
                        <div className="space-y-3">
                          <h3 
                            className="text-xl md:text-2xl font-bold text-white"
                            style={{ fontFamily: "'GT Pressura', sans-serif" }}
                          >
                            {language === 'fr' ? (currentExp.position_fr || currentExp.position_en) : currentExp.position_en}
                          </h3>
                          <p 
                            className="font-semibold text-base md:text-lg"
                            style={{ color: sectionColors.experience.primary }}
                          >
                            {language === 'fr' && currentExp.company_name === 'Self Employed'
                              ? 'Travailleur Autonome'
                              : <T>{currentExp.company_name}</T>}
                          </p>
                          
                          <div className="flex items-center justify-center gap-2 text-white/60 text-sm md:text-base">
                            <Calendar size={16} />
                            <span>
                              {formatDate(currentExp.start_date)} — {currentExp.is_current 
                                ? (language === 'fr' ? 'Présent' : 'Present')
                                : currentExp.end_date ? formatDate(currentExp.end_date) : '—'}
                            </span>
                          </div>

                          <p className="text-white/60 text-base md:text-lg leading-relaxed line-clamp-4 max-w-lg mx-auto">
                            {language === 'fr' ? (currentExp.description_fr || currentExp.description_en) : currentExp.description_en}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {experiences.length > 1 && (
                  <NavButton direction="right" onClick={() => navExp(1)} color={sectionColors.experience.primary} />
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* ============ EDUCATION QUADRANT (Bottom Left) ============ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative rounded-xl bg-black/60 backdrop-blur-md overflow-hidden"
          style={{ border: `2px solid ${sectionColors.education.primary}40` }}
        >
          <div className="relative z-10 h-full flex flex-col p-4 md:p-5">
            <SectionHeader 
              icon={BookOpen} 
              title={language === 'fr' ? 'ÉDUCATION' : 'EDUCATION'}
              color={sectionColors.education.primary}
              showCounter={false}
            />
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
                <T>Loading...</T>
              </div>
            ) : education.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-white/30 text-base">
                <T>No education</T>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar flex items-center justify-center">
                <div className="space-y-6 py-2 w-full max-w-md mx-auto">
                  {education.map((edu, idx) => (
                    <div key={edu.id} className="text-center">
                      <h3 
                        className="text-xl md:text-2xl font-bold text-white leading-tight"
                        style={{ fontFamily: "'GT Pressura', sans-serif" }}
                      >
                        {language === 'fr' ? (edu.degree_fr || edu.degree_en) : edu.degree_en}
                      </h3>
                      <p 
                        className="font-semibold text-base md:text-lg mt-1"
                        style={{ color: sectionColors.education.primary }}
                      >
                        {edu.institution_name}
                      </p>
                      {(edu.field_of_study_en || edu.field_of_study_fr) && (
                        <p className="text-white/50 text-base md:text-lg mt-0.5">
                          {language === 'fr' ? (edu.field_of_study_fr || edu.field_of_study_en) : edu.field_of_study_en}
                        </p>
                      )}
                      {edu.start_date && (
                        <div className="flex items-center justify-center gap-2 text-white/60 text-sm md:text-base mt-2">
                          <Calendar size={16} />
                          <span>
                            {formatDate(edu.start_date)} — {edu.is_current 
                              ? (language === 'fr' ? 'Présent' : 'Present')
                              : edu.end_date ? formatDate(edu.end_date) : '—'}
                          </span>
                          {edu.grade && (
                            <span 
                              className="ml-1 px-1.5 py-0.5 rounded text-xs"
                              style={{ 
                                backgroundColor: `${sectionColors.education.primary}20`,
                                color: sectionColors.education.primary 
                              }}
                            >
                              <T>GPA</T>: {edu.grade}
                            </span>
                          )}
                        </div>
                      )}
                      {idx < education.length - 1 && (
                        <div className="mt-4 mx-auto w-16 h-px bg-white/10" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ============ HOBBIES QUADRANT (Bottom Right) ============ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative rounded-xl bg-black/60 backdrop-blur-md overflow-hidden"
          style={{ border: `2px solid ${sectionColors.hobbies.primary}40` }}
        >
          <div className="relative z-10 h-full flex flex-col p-4 md:p-5">
            <SectionHeader 
              icon={Sparkles} 
              title={language === 'fr' ? 'LOISIRS' : 'HOBBIES'}
              current={hobbyIndex}
              total={hobbies.length}
              color={sectionColors.hobbies.primary}
            />
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
                <T>Loading...</T>
              </div>
            ) : hobbies.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-white/30 text-base">
                <T>No hobbies</T>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-3">
                {hobbies.length > 1 && (
                  <NavButton direction="left" onClick={() => navHobby(-1)} color={sectionColors.hobbies.primary} />
                )}
                
                <div className="flex-1 min-w-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={hobbyIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="w-full text-center"
                    >
                      {currentHobby && (
                        <>
                          <motion.div 
                            className="p-5 rounded-xl border mb-4 inline-block"
                            style={{ 
                              background: `linear-gradient(135deg, ${sectionColors.hobbies.primary}20, ${sectionColors.education.primary}20)`,
                              borderColor: `${sectionColors.hobbies.primary}30`,
                            }}
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <HobbyIcon size={36} style={{ color: sectionColors.hobbies.primary }} />
                          </motion.div>

                          <h3 
                            className="text-xl md:text-2xl font-bold text-white mb-2"
                            style={{ fontFamily: "'GT Pressura', sans-serif" }}
                          >
                            {language === 'fr' ? (currentHobby.name_fr || currentHobby.name_en) : currentHobby.name_en}
                          </h3>

                          <p className="text-white/60 text-base md:text-lg line-clamp-3 max-w-lg mx-auto">
                            {language === 'fr' ? (currentHobby.description_fr || currentHobby.description_en) : currentHobby.description_en}
                          </p>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {hobbies.length > 1 && (
                  <NavButton direction="right" onClick={() => navHobby(1)} color={sectionColors.hobbies.primary} />
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { TiltedCard } from './components/TiltedCard';
import { AsciiText3D } from './components/AsciiText3D';
import { CustomCursor } from './components/CustomCursor';
import { SimpleMenu } from './components/SimpleMenu';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import * as skillsService from './services/skillsService';
import * as projectsService from './services/projectsService';
import * as workExperienceService from './services/workExperienceService';
import * as educationService from './services/educationService';
import { useNavigate } from 'react-router-dom';
import { supabase } from './services/authService';
import { User } from '@supabase/supabase-js';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import { useLanguage } from './contexts/LanguageContext';

type Section = 'home' | 'about' | 'skills' | 'projects' | 'experience' | 'education' | 'contact';

export default function App() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [isHomeSection, setIsHomeSection] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Portfolio data state
  const [skills, setSkills] = useState<skillsService.Skill[]>([]);
  const [projects, setProjects] = useState<projectsService.Project[]>([]);
  const [workExperience, setWorkExperience] = useState<workExperienceService.WorkExperience[]>([]);
  const [education, setEducation] = useState<educationService.Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch portfolio data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        console.log('Fetching portfolio data from API...');
        const [skillsData, projectsData, workData, educationData] = await Promise.all([
          skillsService.getSkills().catch((err) => { console.error('Skills error:', err); return []; }),
          projectsService.getProjects().catch((err) => { console.error('Projects error:', err); return []; }),
          workExperienceService.getWorkExperience().catch((err) => { console.error('Work error:', err); return []; }),
          educationService.getEducation().catch((err) => { console.error('Education error:', err); return []; })
        ]);
        
        if (!isMounted) return;
        
        console.log('Data fetched:', {
          skills: skillsData.length,
          projects: projectsData.length,
          workExperience: workData.length,
          education: educationData.length
        });
        
        setSkills(skillsData);
        setProjects(projectsData);
        setWorkExperience(workData);
        setEducation(educationData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Check if user is logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initialize scroll animations
  useScrollAnimations({ setCurrentSection, setIsHomeSection, loading });

  const menuItems = [
    { label: t('menu.about', 'About', 'À propos'), onClick: () => navigate('/about') },
    { label: t('menu.skills', 'Skills & Experience', 'Compétences & Expérience'), onClick: () => navigate('/skills') },
    { label: t('menu.projects', 'Projects', 'Projets'), onClick: () => navigate('/projects') },
    { label: t('menu.testimonials', 'Testimonials', 'Témoignages'), onClick: () => navigate('/testimonials') },
    { label: t('menu.contact', 'Contact', 'Contact'), onClick: () => navigate('/contact') },
    ...(user 
      ? [
          { label: t('menu.dashboard', 'Dashboard', 'Tableau de bord'), onClick: () => navigate('/admin/dashboard') },
          { label: t('menu.signout', 'Sign Out', 'Déconnexion'), onClick: () => { supabase.auth.signOut(); setUser(null); } },
        ] 
      : [{ label: t('menu.login', 'Login', 'Connexion'), onClick: () => navigate('/login') }]
    ),
  ];

  return (
    <div ref={containerRef} className="relative bg-black text-white crt-effect">
      <div className="scanline" />
      
      <CustomCursor />
      <SimpleMenu items={menuItems} isExpanded={isHomeSection} />

      {/* Language Switcher - Top Right */}
      {isHomeSection && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="fixed top-8 right-8 z-50"
        >
          <LanguageSwitcher />
        </motion.div>
      )}

      <section 
        id="home" 
        data-section="home"
        className="section relative min-h-screen flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={(e) => {
          // Only navigate if not clicking on menu or other interactive elements
          const target = e.target as HTMLElement;
          if (!target.closest('button') && !target.closest('a') && !target.closest('[role="menu"]') && !user) {
            navigate('/login');
          }
        }}
      >
        <TiltedCard />
        <div className="relative z-10 w-full h-screen flex items-center justify-center overflow-x-auto px-4">
          <AsciiText3D 
            text="LEGAGNEUR" 
            asciiFontSize={isMobile ? 2 : 4} 
            enableWaves={false} 
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50 tracking-[0.3em] z-20 pointer-events-none"
          style={{ fontFamily: 'GT Pressura, sans-serif', textTransform: 'uppercase' }}
        >
          {t('home.explore', 'Explore', 'Explorer')}
        </motion.div>
      </section>
    </div>
  );
}

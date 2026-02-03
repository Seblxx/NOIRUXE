import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { TiltedCard } from './components/TiltedCard';
import { AsciiText3D } from './components/AsciiText3D';
import { CustomCursor } from './components/CustomCursor';
import { SimpleMenu } from './components/SimpleMenu';
import { DownloadCVButton } from './components/DownloadCVButton';
import { AddTestimonialModal } from './components/AddTestimonialModal';
import { TestimonialBoard3D } from './components/TestimonialBoard3D';
import { ProjectModal } from './components/ProjectModal';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Mail, ExternalLink, Github, Linkedin, Briefcase, GraduationCap, Code, Calendar } from 'lucide-react';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Button } from './components/ui/button';
import * as skillsService from './services/skillsService';
import * as projectsService from './services/projectsService';
import * as workExperienceService from './services/workExperienceService';
import * as educationService from './services/educationService';
import * as contactService from './services/contactService';
import * as testimonialsService from './services/testimonialsService';
import { useNavigate } from 'react-router-dom';
import { supabase } from './services/authService';
import { User } from '@supabase/supabase-js';
import { useScrollAnimations } from './hooks/useScrollAnimations';

type Section = 'home' | 'about' | 'skills' | 'projects' | 'experience' | 'education' | 'testimonials' | 'contact';

export default function App() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [isHomeSection, setIsHomeSection] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Portfolio data state
  const [skills, setSkills] = useState<skillsService.Skill[]>([]);
  const [projects, setProjects] = useState<projectsService.Project[]>([]);
  const [workExperience, setWorkExperience] = useState<workExperienceService.WorkExperience[]>([]);
  const [education, setEducation] = useState<educationService.Education[]>([]);
  const [testimonials, setTestimonials] = useState<testimonialsService.Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAddTestimonialModal, setShowAddTestimonialModal] = useState(false);
  const [showTestimonialBoard, setShowTestimonialBoard] = useState(false);
  const [selectedProject, setSelectedProject] = useState<projectsService.Project | null>(null);

  // Fetch portfolio data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        console.log('Fetching portfolio data from API...');
        const [skillsData, projectsData, workData, educationData, testimonialsData] = await Promise.all([
          skillsService.getSkills().catch((err) => { console.error('Skills error:', err); return []; }),
          projectsService.getProjects().catch((err) => { console.error('Projects error:', err); return []; }),
          workExperienceService.getWorkExperience().catch((err) => { console.error('Work error:', err); return []; }),
          educationService.getEducation().catch((err) => { console.error('Education error:', err); return []; }),
          testimonialsService.getApprovedTestimonials().catch((err) => { console.error('Testimonials error:', err); return []; })
        ]);
        
        if (!isMounted) return;
        
        console.log('Data fetched:', {
          skills: skillsData.length,
          projects: projectsData.length,
          workExperience: workData.length,
          education: educationData.length,
          testimonials: testimonialsData.length
        });
        
        setSkills(skillsData);
        setProjects(projectsData);
        setWorkExperience(workData);
        setEducation(educationData);
        setTestimonials(testimonialsData);
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    setContactSubmitting(true);
    
    try {
      await contactService.sendContactMessage(contactForm);
      alert('Message sent successfully!');
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const menuItems = [
    { label: 'About', onClick: () => navigate('/about') },
    { label: 'Skills', onClick: () => navigate('/skills') },
    { label: 'Projects', onClick: () => navigate('/projects') },
    { label: 'Experience', onClick: () => navigate('/experience') },
    { label: 'Education', onClick: () => navigate('/education') },
    { label: 'Testimonials', onClick: () => navigate('/testimonials') },
    { label: 'Contact', onClick: () => navigate('/contact') },
    { label: user ? 'Sign Out' : 'Login', onClick: () => {
      if (user) {
        supabase.auth.signOut();
        setUser(null);
      } else {
        navigate('/login');
      }
    }},
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
        className="section relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <TiltedCard />
        <div className="relative z-10 w-full h-screen flex items-center justify-center">
          <AsciiText3D text="LEGAGNEUR" asciiFontSize={4} enableWaves={false} />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50 tracking-[0.3em] z-20"
          style={{ fontFamily: 'GT Pressura, sans-serif', textTransform: 'uppercase' }}
        >
          Explore
        </motion.div>
      </section>
    </div>
  );
}

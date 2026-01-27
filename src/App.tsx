import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TiltedCard } from './components/TiltedCard';
import { AsciiText3D } from './components/AsciiText3D';
import { CustomCursor } from './components/CustomCursor';
import { SimpleMenu } from './components/SimpleMenu';
import { DownloadCVButton } from './components/DownloadCVButton';
import { Mail, ExternalLink, Github, Linkedin, Briefcase, GraduationCap, Code, Calendar } from 'lucide-react';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Button } from './components/ui/button';
import * as skillsService from './services/skillsService';
import * as projectsService from './services/projectsService';
import * as workExperienceService from './services/workExperienceService';
import * as educationService from './services/educationService';
import * as contactService from './services/contactService';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type Section = 'home' | 'about' | 'skills' | 'projects' | 'experience' | 'education' | 'contact';

export default function App() {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [isHomeSection, setIsHomeSection] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Portfolio data state
  const [skills, setSkills] = useState<skillsService.Skill[]>([]);
  const [projects, setProjects] = useState<projectsService.Project[]>([]);
  const [workExperience, setWorkExperience] = useState<workExperienceService.WorkExperience[]>([]);
  const [education, setEducation] = useState<educationService.Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Fetch portfolio data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsData, projectsData, workData, educationData] = await Promise.all([
          skillsService.getSkills().catch(() => []),
          projectsService.getProjects().catch(() => []),
          workExperienceService.getWorkExperience().catch(() => []),
          educationService.getEducation().catch(() => [])
        ]);
        
        setSkills(skillsData);
        setProjects(projectsData);
        setWorkExperience(workData);
        setEducation(educationData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.section');
    
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setCurrentSection(section.dataset.section as Section);
          setIsHomeSection(section.dataset.section === 'home');
        },
        onEnterBack: () => {
          setCurrentSection(section.dataset.section as Section);
          setIsHomeSection(section.dataset.section === 'home');
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      gsap.to(window, { 
        duration: 1.5, 
        scrollTo: { y: section, offsetY: 0 }, 
        ease: 'power3.inOut' 
      });
    }
    
    setTimeout(() => {
      setCurrentSection(sectionId as Section);
      setIsHomeSection(sectionId === 'home');
    }, 100);
  };

  const menuItems = [
    { label: 'About', onClick: () => scrollToSection('about') },
    { label: 'Skills', onClick: () => scrollToSection('skills') },
    { label: 'Projects', onClick: () => scrollToSection('projects') },
    { label: 'Experience', onClick: () => scrollToSection('experience') },
    { label: 'Education', onClick: () => scrollToSection('education') },
    { label: 'Contact', onClick: () => scrollToSection('contact') },
  ];

  return (
    <div ref={containerRef} className="relative bg-black text-white">
      <CustomCursor />
      <SimpleMenu items={menuItems} isExpanded={isHomeSection} />

      {/* HOME SECTION */}
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

      {/* ABOUT SECTION */}
      <section 
        id="about" 
        data-section="about"
        className="section relative min-h-screen flex items-center justify-center p-12 bg-gradient-to-b from-zinc-950 to-black"
      >
        <div className="max-w-6xl w-full">
          <motion.div className="animate-in mb-20">
            <h2 
              className="text-9xl tracking-tight"
              style={{ 
                fontFamily: 'GT Pressura, sans-serif',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'linear-gradient(to right, #ffffff, #888888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              About
            </h2>
          </motion.div>
          
          <motion.div className="animate-in space-y-8">
            <p 
              className="text-4xl leading-relaxed text-white/90"
              style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
            >
              I'm Sebastien Legagneur, a passionate full-stack developer and Computer Science student at Champlain College St-Lambert.
            </p>
            <p 
              className="text-3xl leading-relaxed text-white/70"
              style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
            >
              With expertise in Java, Python, JavaScript, and modern frameworks like React and Spring Boot, I specialize in building scalable web applications with clean, efficient code. I'm proficient in both frontend and backend development, utilizing tools like Docker, AWS, and Git for seamless deployment and collaboration.
            </p>
            <p 
              className="text-3xl leading-relaxed text-white/70"
              style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
            >
              I thrive in Agile environments and have experience working on diverse projects, from stock prediction interfaces to full-stack clinic management systems. My passion lies in creating innovative solutions that combine technical excellence with exceptional user experiences.
            </p>
            <p 
              className="text-3xl leading-relaxed text-white/70"
              style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
            >
              Beyond coding, I'm a piano teacher and active in the Champlain College music community, where I organize events and lead activities as an iLEAD executive member.
            </p>
            
            <div className="pt-8">
              <DownloadCVButton className="bg-white text-black hover:bg-white/90 text-xl px-8 py-4" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section 
        id="skills" 
        data-section="skills"
        className="section relative min-h-screen flex items-center justify-center p-12 bg-gradient-to-b from-black to-zinc-950"
      >
        <div className="max-w-6xl w-full">
          <motion.div className="animate-in mb-20">
            <h2 
              className="text-9xl tracking-tight"
              style={{ 
                fontFamily: 'GT Pressura, sans-serif',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'linear-gradient(to right, #ffffff, #888888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Skills
            </h2>
          </motion.div>
          
          {loading ? (
            <p className="text-2xl text-white/50">Loading skills...</p>
          ) : skills.length === 0 ? (
            <p className="text-2xl text-white/50">No skills data available. Please add skills via the backend API.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 border-2 border-white/20 hover:border-white/40 transition-all duration-300 bg-gradient-to-br from-white/5 to-transparent group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold" style={{ fontFamily: 'GT Pressura, sans-serif' }}>
                      {skill.name_en}
                    </h3>
                    <Code className="w-6 h-6 text-white/50 group-hover:text-white/80 transition-colors" />
                  </div>
                  <p className="text-white/60 mb-3 uppercase tracking-wider text-sm">{skill.category}</p>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.05 + 0.2 }}
                      className="h-full bg-gradient-to-r from-white/80 to-white/50"
                    />
                  </div>
                  <p className="text-right text-white/40 mt-2 text-sm">{skill.proficiency}%</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section 
        id="projects" 
        data-section="projects"
        className="section relative min-h-screen flex items-center justify-center p-12 bg-gradient-to-b from-zinc-950 to-black"
      >
        <div className="max-w-6xl w-full">
          <motion.div className="animate-in mb-20">
            <h2 
              className="text-9xl tracking-tight"
              style={{ 
                fontFamily: 'GT Pressura, sans-serif',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'linear-gradient(to right, #ffffff, #888888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Projects
            </h2>
          </motion.div>
          
          {loading ? (
            <p className="text-2xl text-white/50">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-2xl text-white/50">No projects available. Please add projects via the backend API.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 border-2 border-white/20 hover:border-white/40 transition-all duration-300 bg-gradient-to-br from-white/5 to-transparent group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-4xl font-bold" style={{ fontFamily: 'GT Pressura, sans-serif' }}>
                      {project.title_en}
                    </h3>
                    {project.is_featured && (
                      <span className="px-3 py-1 bg-white/20 text-sm uppercase tracking-wider">Featured</span>
                    )}
                  </div>
                  <p className="text-xl text-white/70 mb-6">
                    {project.short_description_en || (project.description_en ? project.description_en.substring(0, 150) + '...' : 'No description available')}
                  </p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 text-sm text-white/60">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border-2 border-white/20 hover:border-white/60 transition-all duration-300 text-white/80 hover:text-white"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Project
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                      >
                        <Github className="w-5 h-5" />
                        <span>View Code</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WORK EXPERIENCE SECTION */}
      <section 
        id="experience" 
        data-section="experience"
        className="section relative min-h-screen flex items-center justify-center p-12 bg-gradient-to-b from-black to-zinc-950"
      >
        <div className="max-w-6xl w-full">
          <motion.div className="animate-in mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h2 
              className="text-7xl md:text-9xl tracking-tight"
              style={{ 
                fontFamily: 'GT Pressura, sans-serif',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'linear-gradient(to right, #ffffff, #888888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Experience
            </h2>
          </motion.div>
          
          {loading ? (
            <p className="text-2xl text-white/50">Loading experience...</p>
          ) : workExperience.length === 0 ? (
            <p className="text-2xl text-white/50">No work experience available. Please add experience via the backend API.</p>
          ) : (
            <div className="space-y-8">
              {workExperience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 border-l-4 border-white/40 bg-gradient-to-r from-white/5 to-transparent hover:border-white/70 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                    <div>
                      <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'GT Pressura, sans-serif' }}>
                        {exp.position_en}
                      </h3>
                      <p className="text-xl text-white/80">{exp.company_name}</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-white/50" />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-white/60 mb-4">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(exp.start_date).getFullYear()} - {exp.is_current ? 'Present' : new Date(exp.end_date!).getFullYear()}
                    </span>
                    {exp.location && <span>• {exp.location}</span>}
                    {exp.employment_type && <span>• {exp.employment_type}</span>}
                  </div>
                  
                  {exp.description_en && (
                    <p className="text-lg text-white/70 mb-4">{exp.description_en}</p>
                  )}
                  
                  {exp.achievements_en && exp.achievements_en.length > 0 && (
                    <ul className="space-y-2">
                      {exp.achievements_en.map((achievement, i) => (
                        <li key={i} className="text-white/60 flex items-start gap-3">
                          <span className="text-white/40 mt-1">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EDUCATION SECTION */}
      <section 
        id="education" 
        data-section="education"
        className="section relative min-h-screen flex items-center justify-center p-12 bg-gradient-to-b from-zinc-950 to-black"
      >
        <div className="max-w-6xl w-full">
          <motion.div className="animate-in mb-20">
            <h2 
              className="text-9xl tracking-tight"
              style={{ 
                fontFamily: 'GT Pressura, sans-serif',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'linear-gradient(to right, #ffffff, #888888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Education
            </h2>
          </motion.div>
          
          {loading ? (
            <p className="text-2xl text-white/50">Loading education...</p>
          ) : education.length === 0 ? (
            <p className="text-2xl text-white/50">No education data available. Please add education via the backend API.</p>
          ) : (
            <div className="space-y-8">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 border-l-4 border-white/40 bg-gradient-to-r from-white/5 to-transparent hover:border-white/70 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                    <div>
                      <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'GT Pressura, sans-serif' }}>
                        {edu.degree_en}
                      </h3>
                      <p className="text-xl text-white/80">{edu.institution_name}</p>
                      <p className="text-lg text-white/60">{edu.field_of_study_en}</p>
                    </div>
                    <GraduationCap className="w-8 h-8 text-white/50" />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-white/60 mb-4">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(edu.start_date).getFullYear()} - {edu.is_current ? 'Present' : new Date(edu.end_date!).getFullYear()}
                    </span>
                    {edu.location && <span>• {edu.location}</span>}
                    {edu.grade && <span>• {edu.grade}</span>}
                  </div>
                  
                  {edu.description_en && (
                    <p className="text-lg text-white/70 mb-4">{edu.description_en}</p>
                  )}
                  
                  {edu.achievements_en && edu.achievements_en.length > 0 && (
                    <ul className="space-y-2">
                      {edu.achievements_en.map((achievement, i) => (
                        <li key={i} className="text-white/60 flex items-start gap-3">
                          <span className="text-white/40 mt-1">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section 
        id="contact" 
        data-section="contact"
        className="section relative min-h-screen flex flex-col items-center justify-center p-12 bg-black"
      >
        <div className="max-w-2xl w-full">
          <motion.div className="animate-in">
            <h2 
              className="text-9xl mb-16 text-center tracking-tight"
              style={{ 
                fontFamily: 'GT Pressura, sans-serif',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Contact
            </h2>
          </motion.div>
          
          <motion.form className="animate-in space-y-6" onSubmit={handleContactSubmit}>
            <Input 
              placeholder="Name" 
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              className="bg-white/10 border-white/20 text-white text-xl p-6" 
              required
            />
            <Input 
              placeholder="Email" 
              type="email" 
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              className="bg-white/10 border-white/20 text-white text-xl p-6" 
              required
            />
            <Textarea 
              placeholder="Message" 
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              className="bg-white/10 border-white/20 text-white text-xl p-6 min-h-[200px]" 
              required
            />
            <Button 
              type="submit" 
              disabled={contactSubmitting}
              className="w-full text-xl p-6 bg-white text-black hover:bg-white/90"
            >
              {contactSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </motion.form>

          {/* Social Links */}
          <motion.div className="animate-in mt-16 flex justify-center gap-6">
            <a 
              href="https://github.com/Seblxx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border-2 border-white/20 hover:border-white/40 transition-all duration-300 group"
            >
              <Github className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
            </a>
            <a 
              href="https://www.linkedin.com/in/sebastien-legagneur-5781b2325/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border-2 border-white/20 hover:border-white/40 transition-all duration-300 group"
            >
              <Linkedin className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
            </a>
            <a 
              href="mailto:sebastien.legagneur@example.com"
              className="p-4 border-2 border-white/20 hover:border-white/40 transition-all duration-300 group"
            >
              <Mail className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
            </a>
          </motion.div>

          <motion.p className="animate-in text-center mt-8 text-white/50">© 2026 Sebastien Legagneur</motion.p>
        </div>
      </section>
    </div>
  );
}

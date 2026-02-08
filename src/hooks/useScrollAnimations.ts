import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Section = 'home' | 'about' | 'skills' | 'projects' | 'experience' | 'education' | 'contact';

interface UseScrollAnimationsProps {
  setCurrentSection: (section: Section) => void;
  setIsHomeSection: (isHome: boolean) => void;
  loading: boolean;
}

export const useScrollAnimations = ({ setCurrentSection, setIsHomeSection, loading }: UseScrollAnimationsProps) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Set container reference after mount
    containerRef.current = document.body;
  }, []);

  useGSAP(() => {
    if (loading || !containerRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>('.section');
    
    // Section tracking with callbacks
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          const sectionName = section.dataset.section as Section;
          setCurrentSection(sectionName);
          setIsHomeSection(sectionName === 'home');
        },
        onEnterBack: () => {
          const sectionName = section.dataset.section as Section;
          setCurrentSection(sectionName);
          setIsHomeSection(sectionName === 'home');
        },
      });
    });

    // Content fade-in animations - batch process for performance
    const animElements = gsap.utils.toArray<HTMLElement>('.animate-on-scroll:not(h1):not(h2):not(h3)');
    
    animElements.forEach((element) => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
          once: false,
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    // Parallax backgrounds - optimized with will-change
    const parallaxElements = gsap.utils.toArray<HTMLElement>('.parallax-bg');
    
    parallaxElements.forEach((bg) => {
      const section = bg.closest('.section');
      if (!section) return;

      gsap.set(bg, { willChange: 'transform' });
      
      gsap.to(bg, {
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
        yPercent: -20,
        ease: 'none',
      });
    });

    // Cleanup will-change after animations complete
    return () => {
      parallaxElements.forEach((bg) => {
        gsap.set(bg, { willChange: 'auto' });
      });
    };
  }, { 
    scope: containerRef,
    dependencies: [loading, setCurrentSection, setIsHomeSection],
    revertOnUpdate: true 
  });
};

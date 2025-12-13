import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TiltedCard } from './components/TiltedCard';
import { AsciiText3D } from './components/AsciiText3D';
import { DecryptedText } from './components/DecryptedText';
import { CustomCursor } from './components/CustomCursor';
import { SimpleMenu } from './components/SimpleMenu';
import { ArtistScroll } from './components/ArtistScroll';
import { ArtistPage } from './components/ArtistPage';
import { Mail, ExternalLink, Instagram, Music, Sparkles, ArrowLeft } from 'lucide-react';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Button } from './components/ui/button';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type Section = 'home' | 'about' | 'services' | 'artists' | 'merch' | 'contact';

const artists = [
  { 
    name: 'Gianna', 
    color: '#ff96e6', 
    description: 'Emerging artist pushing boundaries',
    instagram: 'https://www.instagram.com/cchanelxis/',
    soundcloud: 'https://soundcloud.com/shutupimnotemobro'
  },
  { 
    name: 'Liv', 
    color: '#50ecf1', 
    description: 'Captivating vocals with ethereal sound',
    instagram: 'https://www.instagram.com/liviaguilarf/',
    soundcloud: 'https://soundcloud.com/laf-39802002'
  },
  { 
    name: 'Londyn', 
    color: '#fddc5b', 
    description: 'Bold and unapologetic artistry',
    instagram: 'https://www.instagram.com/londynlyrae/',
    comingSoon: true
  },
  { 
    name: 'LindsXY', 
    color: '#4db5f6', 
    description: 'Sky-high energy with infectious beats',
    instagram: 'https://www.instagram.com/lindsxymesenburg/',
    spotify: 'https://open.spotify.com/artist/6VwDZ6kAtwpng8gGLHTkVz'
  },
  { 
    name: 'Vanna', 
    color: '#ff00ff', 
    description: 'Magnetic presence, genre-defying sound',
    instagram: 'https://www.instagram.com/vannarainelle',
    spotify: 'https://open.spotify.com/artist/5KiKWAR8D8UjkuD21Depbe'
  },
];

export default function App() {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [isHomeSection, setIsHomeSection] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedArtist) return; // Don't setup scroll triggers when on artist page

    // Setup smooth scrolling and scroll triggers
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

      // Fade in animations for each section
      gsap.fromTo(
        section.querySelectorAll('.animate-in'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [selectedArtist]);

  const scrollToSection = (sectionId: string) => {
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: `#${sectionId}`, offsetY: 0 },
      ease: 'power2.inOut',
    });
  };

  const handleSelectArtist = (name: string) => {
    setSelectedArtist(name);
    window.scrollTo(0, 0);
  };

  const handleBackToMain = () => {
    setSelectedArtist(null);
    setTimeout(() => {
      scrollToSection('artists');
    }, 100);
  };

  const menuItems = [
    { label: 'About', onClick: () => scrollToSection('about') },
    { label: 'Services', onClick: () => scrollToSection('services') },
    { label: 'Artists', onClick: () => scrollToSection('artists') },
    { label: 'Merch', onClick: () => scrollToSection('merch') },
    { label: 'Contact', onClick: () => scrollToSection('contact') },
  ];

  const getArtistPageData = (artistName: string) => {
    const artist = artists.find(a => a.name === artistName);
    if (!artist) return null;

    const socials = [];
    if (artist.instagram) socials.push({ type: 'instagram' as const, url: artist.instagram });
    if (artist.soundcloud) socials.push({ type: 'soundcloud' as const, url: artist.soundcloud });
    if (artist.spotify) socials.push({ type: 'spotify' as const, url: artist.spotify });

    return {
      name: artist.name,
      colors: {
        bg: artist.color,
        accent: artist.color,
      },
      description: artist.description,
      musicUrl: artist.soundcloud || artist.spotify,
      musicPlatform: artist.soundcloud ? 'soundcloud' as const : 'spotify' as const,
      socials,
      comingSoon: artist.comingSoon,
    };
  };

  if (selectedArtist) {
    const artistData = getArtistPageData(selectedArtist);
    if (!artistData) return null;

    return (
      <div className="relative">
        <CustomCursor />
        
        {/* Back button */}
        <button
          onClick={handleBackToMain}
          className="fixed top-8 left-8 z-50 flex items-center gap-2 text-white uppercase tracking-wider hover:text-white/70 transition-colors"
          style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700 }}
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </button>

        <ArtistPage {...artistData} />
      </div>
    );
  }

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
          <AsciiText3D text="NOIRUXE" asciiFontSize={6} enableWaves={false} />
        </div>
        
        {/* Scroll hint */}
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
        className="section relative min-h-screen flex items-center justify-center p-12 bg-black"
      >
        <div className="max-w-5xl">
          <motion.div className="animate-in">
            <h2 
              className="text-9xl mb-16 tracking-tight"
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
              Noiruxe is an independent record label & curator and publisher founded in 2025 that aims to push the
              next generation of superstars.
            </p>
            <p 
              className="text-3xl leading-relaxed text-white/70"
              style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
            >
              Whether it's from writing your next hit, building your brand image, or
              helping you get more listens — we are here for your next project.
            </p>
          </motion.div>
          
          <motion.div className="animate-in mt-16 flex gap-8">
            <div className="flex items-center gap-3 text-white/50">
              <Sparkles className="w-8 h-8" />
              <span className="text-xl uppercase tracking-wider" style={{ fontFamily: 'GT Pressura, sans-serif' }}>Est. 2025</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section 
        id="services" 
        data-section="services"
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
              Services
            </h2>
          </motion.div>
          
          <motion.div className="animate-in mb-20">
            <p className="text-4xl leading-relaxed text-white/90 mb-12" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}>
              We offer playlisting and various promotional services to elevate your music career.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-6">
            <motion.a
              href="https://open.spotify.com/user/314htejdlm6b2yfywyx2mpbk4rgy?si=88d182b91f904a46"
              target="_blank"
              rel="noopener noreferrer"
              className="animate-in group relative overflow-hidden"
            >
              <div className="relative p-12 border-2 border-white/20 group-hover:border-white/40 transition-all duration-700 bg-gradient-to-br from-white/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Music className="w-16 h-16 text-white/80 group-hover:text-white transition-colors" />
                      <h3 className="text-5xl" style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700 }}>SPOTIFY</h3>
                    </div>
                    <p className="text-2xl text-white/60 group-hover:text-white/80 transition-colors">
                      Curated playlists designed to amplify your reach and connect with new listeners
                    </p>
                  </div>
                  <ExternalLink className="w-10 h-10 text-white/30 group-hover:text-white/70 group-hover:translate-x-2 transition-all" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </motion.a>

            <motion.a
              href="https://www.youtube.com/@Noir1uxe"
              target="_blank"
              rel="noopener noreferrer"
              className="animate-in group relative overflow-hidden"
            >
              <div className="relative p-12 border-2 border-white/20 group-hover:border-white/40 transition-all duration-700 bg-gradient-to-br from-white/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <ExternalLink className="w-16 h-16 text-white/80 group-hover:text-white transition-colors" />
                      <h3 className="text-5xl" style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700 }}>YOUTUBE</h3>
                    </div>
                    <p className="text-2xl text-white/60 group-hover:text-white/80 transition-colors">
                      Professional visual content and music videos to enhance your brand presence
                    </p>
                  </div>
                  <ExternalLink className="w-10 h-10 text-white/30 group-hover:text-white/70 group-hover:translate-x-2 transition-all" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* ARTISTS SECTION */}
      <section 
        id="artists" 
        data-section="artists"
        className="section relative min-h-screen bg-black"
      >
        <div className="p-12 mb-12">
          <motion.div className="animate-in max-w-7xl mx-auto">
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
              Artists
            </h2>
          </motion.div>
        </div>

        <ArtistScroll artists={artists} onSelectArtist={handleSelectArtist} />
      </section>

      {/* MERCH SECTION */}
      <section 
        id="merch" 
        data-section="merch"
        className="section relative min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-950 to-black"
      >
        <div className="text-center">
          <h2 className="text-9xl" style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700 }}>
            <DecryptedText text="COMING SOON" speed={70} sequential={true} />
          </h2>
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
          
          <motion.form className="animate-in space-y-6">
            <Input placeholder="Name" className="bg-white/10 border-white/20 text-white text-xl p-6" />
            <Input placeholder="Email" type="email" className="bg-white/10 border-white/20 text-white text-xl p-6" />
            <Textarea placeholder="Message" className="bg-white/10 border-white/20 text-white text-xl p-6 min-h-[200px]" />
            <Button className="w-full text-xl p-6 bg-white text-black hover:bg-white/90">Send</Button>
          </motion.form>

          {/* Marquee Email */}
          <motion.div className="animate-in mt-16 overflow-hidden relative">
            <div className="flex animate-marquee-fast">
              {[...Array(6)].map((_, i) => (
                <a 
                  key={i} 
                  href="mailto:noiruxe@gmail.com"
                  className="flex items-center whitespace-nowrap text-4xl mr-12 text-white/70 hover:text-white transition-colors group"
                  style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700 }}
                >
                  <Mail className="inline w-8 h-8 mr-3 group-hover:scale-110 transition-transform" />
                  noiruxe@gmail.com
                  <span className="mx-4">•</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Copyright */}
          <motion.p className="animate-in text-center mt-8 text-white/50">© Noiruxe 2025</motion.p>
        </div>
      </section>
    </div>
  );
}

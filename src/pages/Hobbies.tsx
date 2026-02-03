import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { DownloadCVButton } from '../components/DownloadCVButton';
import { ArrowLeft, Gamepad2, Music, Camera, Palette, Book, Dumbbell, Plane, Coffee } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
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
};

export const Hobbies = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [hobbies, setHobbies] = useState<hobbiesService.Hobby[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await hobbiesService.getHobbies();
        setHobbies(data);
      } catch (error) {
        console.error('Error fetching hobbies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const title = language === 'fr' ? 'LOISIRS' : 'HOBBIES';

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName.toLowerCase()] || Gamepad2;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-black text-white crt-effect">
      <div className="scanline" />
      <CustomCursor />

      {/* Back button */}
      <motion.button
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -5 }}
        className="fixed top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors z-50"
        style={{ fontFamily: "'GT Pressura', sans-serif", letterSpacing: '0.2em' }}
      >
        <ArrowLeft size={18} />
        <span className="text-sm tracking-widest">HOME</span>
      </motion.button>

      {/* Download CV button */}
      <div className="fixed top-8 right-8 z-50">
        <DownloadCVButton />
      </div>

      <div className="container mx-auto px-8 py-24 max-w-6xl">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black mb-12"
          style={{ fontFamily: "'GT Pressura', sans-serif" }}
        >
          {title}
        </motion.h1>

        {loading ? (
          <div className="text-center text-white/50 py-20">
            {language === 'fr' ? 'Chargement...' : 'Loading...'}
          </div>
        ) : hobbies.length === 0 ? (
          <div className="text-center text-white/50 py-20">
            {language === 'fr' ? 'Aucun loisir trouvé' : 'No hobbies found'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hobbies.map((hobby, i) => {
              // Use icon_url to determine icon, or default
              const iconName = hobby.icon_url?.split('/').pop()?.split('.')[0] || 'gaming';
              const Icon = getIcon(iconName);
              return (
                <motion.div
                  key={hobby.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="group relative p-6 border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent overflow-hidden"
                >
                  {/* Neon glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-pink-500/10 group-hover:via-purple-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 group-hover:from-pink-500/40 group-hover:to-purple-500/40 transition-all">
                        <Icon size={28} className="text-pink-400" />
                      </div>
                      <h3 className="text-xl font-bold" style={{ fontFamily: "'GT Pressura', sans-serif" }}>
                        {language === 'fr' ? hobby.name_fr : hobby.name_en}
                      </h3>
                    </div>

                    <p className="text-white/60 leading-relaxed">
                      {language === 'fr' ? hobby.description_fr : hobby.description_en}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

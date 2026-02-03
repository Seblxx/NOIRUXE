import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { DownloadCVButton } from '../components/DownloadCVButton';
import { ArrowLeft, Briefcase, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as workExperienceService from '../services/workExperienceService';

export const Experience = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [experiences, setExperiences] = useState<workExperienceService.WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await workExperienceService.getWorkExperience();
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching work experience:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const title = language === 'fr' ? 'EXPÉRIENCE' : 'EXPERIENCE';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'short' });
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

      <div className="container mx-auto px-8 py-24 max-w-4xl">
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
        ) : experiences.length === 0 ? (
          <div className="text-center text-white/50 py-20">
            {language === 'fr' ? 'Aucune expérience trouvée' : 'No experience found'}
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500" />

            <div className="space-y-12">
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="relative pl-12 md:pl-20"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2 md:left-6 top-2 w-4 h-4 rounded-full bg-cyan-500 border-4 border-black" />
                  
                  <div className="p-6 border border-white/10 rounded-xl bg-white/5 hover:border-cyan-500/50 transition-all">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'GT Pressura', sans-serif" }}>
                          {language === 'fr' ? exp.position_fr : exp.position_en}
                        </h3>
                        <p className="text-lg text-cyan-400">{exp.company_name}</p>
                      </div>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/70">
                        {exp.employment_type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-white/50 mb-4">
                      <Calendar size={16} />
                      <span>
                        {formatDate(exp.start_date)} - {exp.is_current ? (language === 'fr' ? 'Présent' : 'Present') : formatDate(exp.end_date || '')}
                      </span>
                    </div>

                    <p className="text-white/70 leading-relaxed">
                      {language === 'fr' ? exp.description_fr : exp.description_en}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

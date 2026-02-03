import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { DownloadCVButton } from '../components/DownloadCVButton';
import { ArrowLeft, GraduationCap, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as educationService from '../services/educationService';

export const Education = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [education, setEducation] = useState<educationService.Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await educationService.getEducation();
        setEducation(data);
      } catch (error) {
        console.error('Error fetching education:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const title = language === 'fr' ? 'ÉDUCATION' : 'EDUCATION';

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
        ) : education.length === 0 ? (
          <div className="text-center text-white/50 py-20">
            {language === 'fr' ? 'Aucune éducation trouvée' : 'No education found'}
          </div>
        ) : (
          <div className="space-y-8">
            {education.map((edu, i) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="group relative p-8 border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent hover:border-purple-500/50 transition-all"
              >
                <div className="absolute top-6 right-6">
                  <GraduationCap size={32} className="text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'GT Pressura', sans-serif" }}>
                  {language === 'fr' ? edu.degree_fr : edu.degree_en}
                </h3>

                <p className="text-xl text-purple-400 mb-4">{edu.institution_name}</p>

                {(edu.field_of_study_en || edu.field_of_study_fr) && (
                  <p className="text-white/70 mb-4">
                    {language === 'fr' ? edu.field_of_study_fr : edu.field_of_study_en}
                  </p>
                )}

                <div className="flex items-center gap-2 text-white/50 mb-4">
                  <Calendar size={16} />
                  <span>
                    {formatDate(edu.start_date)} - {edu.is_current ? (language === 'fr' ? 'Présent' : 'Present') : formatDate(edu.end_date || '')}
                  </span>
                </div>

                {(edu.description_en || edu.description_fr) && (
                  <p className="text-white/60 leading-relaxed">
                    {language === 'fr' ? edu.description_fr : edu.description_en}
                  </p>
                )}

                {edu.grade && (
                  <div className="mt-4 inline-block px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-300">
                    GPA: {edu.grade}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

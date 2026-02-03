import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as skillsService from '../services/skillsService';

export const Skills = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [skills, setSkills] = useState<skillsService.Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await skillsService.getSkills();
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = [...new Set(skills.map(s => s.category))];
  const filteredSkills = selectedCategory 
    ? skills.filter(s => s.category === selectedCategory)
    : skills;

  const title = language === 'fr' ? 'COMPÉTENCES' : 'SKILLS';

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

      <div className="container mx-auto px-8 py-24">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black mb-12"
          style={{ fontFamily: "'GT Pressura', sans-serif" }}
        >
          {title}
        </motion.h1>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full border transition-all ${
              selectedCategory === null
                ? 'bg-cyan-500 border-cyan-500 text-black'
                : 'border-white/30 text-white/70 hover:border-white'
            }`}
            style={{ fontFamily: "'GT Pressura', sans-serif" }}
          >
            {language === 'fr' ? 'Tout' : 'All'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 border-cyan-500 text-black'
                  : 'border-white/30 text-white/70 hover:border-white'
              }`}
              style={{ fontFamily: "'GT Pressura', sans-serif" }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="text-center text-white/50 py-20">
            {language === 'fr' ? 'Chargement...' : 'Loading...'}
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center text-white/50 py-20">
            {language === 'fr' ? 'Aucune compétence trouvée' : 'No skills found'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="group relative p-6 border border-white/10 rounded-xl bg-white/5 hover:border-cyan-500/50 transition-all"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                
                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'GT Pressura', sans-serif" }}>
                    {language === 'fr' ? skill.name_fr : skill.name_en}
                  </h3>
                  <p className="text-sm text-cyan-400 mb-4">{skill.category}</p>
                  
                  {/* Proficiency bar */}
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                  </div>
                  <p className="text-right text-sm text-white/50 mt-1">{skill.proficiency}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

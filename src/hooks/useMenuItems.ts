import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

export function useMenuItems() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const menuItems = [
    { label: t('menu.home', 'Home', 'Accueil'), onClick: () => navigate('/') },
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

  return { menuItems, user, setUser };
}

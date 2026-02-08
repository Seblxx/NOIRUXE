import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../services/authService';
import { CustomCursor } from '../components/CustomCursor';
import { TiltedCard } from '../components/TiltedCard';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Glitch text component
const GlitchText = ({ text }: { text: string }) => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-block">
      <span
        className="relative z-10 text-white"
        style={{
          fontFamily: "'GT Pressura', sans-serif",
          textShadow: glitchActive 
            ? '2px 0 #ff00ff, -2px 0 #00ffff' 
            : '0 0 20px rgba(255, 255, 255, 0.5)',
        }}
      >
        {text}
      </span>
      {glitchActive && (
        <>
          <span
            className="absolute top-0 left-0 z-0"
            style={{
              fontFamily: "'GT Pressura', sans-serif",
              color: '#00ffff',
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
              transform: 'translate(-4px, -2px)',
              opacity: 0.8,
            }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 z-0"
            style={{
              fontFamily: "'GT Pressura', sans-serif",
              color: '#ff00ff',
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              transform: 'translate(4px, 2px)',
              opacity: 0.8,
            }}
          >
            {text}
          </span>
        </>
      )}
    </div>
  );
};

export const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  
  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'signup';
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/', { replace: true });
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [mode]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(t('signup.passwordMismatch', 'Passwords do not match', 'Les mots de passe ne correspondent pas'));
      return;
    }

    if (password.length < 6) {
      setError(t('signup.passwordTooShort', 'Password must be at least 6 characters', 'Le mot de passe doit contenir au moins 6 caractères'));
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      if (signUpError) throw signUpError;
      
      setSuccess(t('signup.success', 'Account created! Check your email to verify.', 'Compte créé ! Vérifiez votre email pour confirmer.'));
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || t('signup.error', 'An error occurred', 'Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (signInError) throw signInError;
      navigate('/');
    } catch (err: any) {
      setError(err.message || t('signup.error', 'An error occurred', 'Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  };

  const AuthMarquee = () => {
    const [glitchActive, setGlitchActive] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }, 3000 + Math.random() * 2000);
      return () => clearInterval(interval);
    }, []);

    const marqueeLabel = mode === 'signup' 
      ? 'SIGN UP • SIGN UP • SIGN UP • SIGN UP • SIGN UP • SIGN UP • SIGN UP • '
      : 'LOGIN • LOGIN • LOGIN • LOGIN • LOGIN • LOGIN • LOGIN • LOGIN • ';

    return (
      <div 
        className="whitespace-nowrap"
        style={{
          animation: 'authMarquee 40s linear infinite',
        }}
      >
        <span
          style={{
            fontFamily: "'GT Pressura', sans-serif",
            fontSize: '10rem',
            fontWeight: 900,
            color: glitchActive ? '#00ffff' : 'white',
            opacity: glitchActive ? 0.15 : 0.06,
            textShadow: glitchActive 
              ? '4px 0 #ff00ff, -4px 0 #00ffff' 
              : 'none',
            transition: 'all 0.1s',
          }}
        >
          {marqueeLabel}{marqueeLabel}
        </span>
      </div>
    );
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden crt-effect">
      <style>{`
        @keyframes authMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="scanline" />
      <CustomCursor />
      <TiltedCard />

      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center">
        <div className="overflow-hidden">
          <AuthMarquee />
        </div>
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.button
          onClick={() => navigate('/')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ x: -5 }}
          className="fixed top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors z-50"
          style={{ fontFamily: "'GT Pressura', sans-serif", letterSpacing: '0.2em' }}
        >
          <ArrowLeft size={18} />
          <span className="text-sm tracking-widest">{t('nav.home', 'HOME', 'ACCUEIL')}</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-black/80 backdrop-blur-xl rounded-2xl p-10 md:p-12 border border-white/10"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 80px rgba(255, 255, 255, 0.05)',
            width: '100%',
            maxWidth: '480px',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 text-center"
            >
              <h1 
                className="text-5xl md:text-6xl font-black tracking-tight leading-none"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                <GlitchText text={mode === 'signup' 
                  ? t('signup.title', 'SIGN UP', 'INSCRIPTION') 
                  : t('login.title', 'LOGIN', 'CONNEXION')} 
                />
              </h1>
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg text-sm text-center"
              style={{ 
                fontFamily: "'GT Pressura', sans-serif",
                border: '1px solid rgba(239, 68, 68, 0.5)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171'
              }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg text-sm text-center"
              style={{ 
                fontFamily: "'GT Pressura', sans-serif",
                border: '1px solid rgba(34, 197, 94, 0.5)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: '#4ade80'
              }}
            >
              {success}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {mode === 'signup' ? (
              <motion.form
                key="signup-form"
                ref={formRef}
                onSubmit={handleSignup}
                className="space-y-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <label 
                    className="block text-xs text-white/50 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    {t('signup.name', 'Name', 'Nom')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                    placeholder={t('signup.namePlaceholder', 'Your name', 'Votre nom')}
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs text-white/50 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    {t('signup.email', 'Email', 'Email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs text-white/50 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    {t('signup.password', 'Password', 'Mot de passe')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all pr-12"
                      style={{ fontFamily: "'GT Pressura', sans-serif" }}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label 
                    className="block text-xs text-white/50 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    {t('signup.confirmPassword', 'Confirm Password', 'Confirmer le mot de passe')}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all pr-12"
                      style={{ fontFamily: "'GT Pressura', sans-serif" }}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full py-4 bg-white text-black font-bold tracking-[0.2em] uppercase text-sm rounded-lg hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    {loading 
                      ? t('signup.creatingAccount', 'Creating account...', 'Création du compte...') 
                      : t('signup.createAccount', 'Create Account', 'Créer un compte')}
                  </button>
                </div>

                <p
                  className="text-center text-white/40 text-sm pt-2"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  {t('signup.alreadyHaveAccount', 'Already a user?', 'Déjà un compte?')}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                  >
                    {t('signup.loginLink', 'Log in here', 'Connectez-vous ici')}
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="login-form"
                ref={formRef}
                onSubmit={handleLogin}
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <label 
                    className="block text-xs text-white/50 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs text-white/50 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    {t('login.password', 'Password', 'Mot de passe')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all pr-12"
                      style={{ fontFamily: "'GT Pressura', sans-serif" }}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full py-4 bg-white text-black font-bold tracking-[0.2em] uppercase text-sm rounded-lg hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    {loading 
                      ? t('login.signingIn', 'Signing in...', 'Connexion en cours...') 
                      : t('login.signIn', 'Sign In', 'Se connecter')}
                  </button>
                </div>

                <p
                  className="text-center text-white/40 text-sm pt-2"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  {t('login.noAccount', "Don't have an account?", "Pas encore de compte?")}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                  >
                    {t('login.signupLink', 'Sign up here', 'Inscrivez-vous ici')}
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

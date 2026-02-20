import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '../services/authService';
import { CustomCursor } from '../components/CustomCursor';
import { TiltedCard } from '../components/TiltedCard';
import { Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { T } from '../components/Translate';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  checkRateLimit, 
  recordFailedAttempt, 
  clearFailedAttempts,
  isTwoFactorRequired,
  generateTwoFactorCode,
  sendTwoFactorEmail,
  verifyTwoFactorCode,
  clearTwoFactorCode
} from '../utils/authSecurity';

const MAX_ATTEMPTS = 7;

// Glitch text component for LOGIN title
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

export const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [twoFactorMode, setTwoFactorMode] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [awaitingTwoFactor, setAwaitingTwoFactor] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Check if already logged in - redirect to home
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // If in 2FA mode, verify the code
      if (twoFactorMode) {
        const result = verifyTwoFactorCode(email, twoFactorCode);
        if (!result.valid) {
          setError(result.error || 'Invalid verification code');
          setLoading(false);
          return;
        }
        
        // Code is valid, complete login
        clearFailedAttempts(email);
        navigate('/');
        return;
      }

      // Check rate limiting
      const rateCheck = checkRateLimit(email);
      if (!rateCheck.allowed) {
        setError(`Too many failed attempts. Please try again in ${rateCheck.lockoutMinutes} minutes.`);
        setLoading(false);
        return;
      }

      // Attempt login
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        recordFailedAttempt(email);
        const remaining = (rateCheck.remainingAttempts || MAX_ATTEMPTS) - 1;
        if (remaining > 0) {
          setError(`Invalid credentials. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`);
        } else {
          setError('Too many failed attempts. Account locked for 15 minutes.');
        }
        setLoading(false);
        return;
      }

      // Login successful, check if 2FA is required
      if (data.user && isTwoFactorRequired(email)) {
        // Generate and send 2FA code
        const code = generateTwoFactorCode();
        const sendResult = await sendTwoFactorEmail(email, code);
        
        if (!sendResult.success) {
          setError('Failed to send verification code. Please try again.');
          setLoading(false);
          return;
        }
        
        // Show 2FA input
        setAwaitingTwoFactor(true);
        setTwoFactorMode(true);
        setError('');
      } else {
        // No 2FA required or not yet enforced, proceed with login
        clearFailedAttempts(email);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || t('login.error', 'An error occurred', 'Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  };

  // Slow marquee for background
  const LoginMarquee = () => {
    const [glitchActive, setGlitchActive] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }, 3000 + Math.random() * 2000);
      return () => clearInterval(interval);
    }, []);

    const loginWord = t('login.word', 'LOGIN', 'CONNEXION');
    const text = `${loginWord} • ${loginWord} • ${loginWord} • ${loginWord} • ${loginWord} • ${loginWord} • ${loginWord} • ${loginWord} • `;

    return (
      <div 
        className="whitespace-nowrap"
        style={{
          animation: 'loginMarquee 40s linear infinite',
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
          {text}{text}
        </span>
      </div>
    );
  };

  // Show loading while checking auth
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
        @keyframes loginMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="scanline" />
      <CustomCursor />
      <TiltedCard />

      {/* Slow marquee background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center">
        <div className="overflow-hidden">
          <LoginMarquee />
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Back button - positioned at top left */}
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
          <span className="text-sm tracking-widest"><T>HOME</T></span>
        </motion.button>

        {/* Login card container */}
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
          {/* LOGIN text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 text-center"
          >
            <h1 
              className="text-6xl md:text-7xl font-black tracking-tight leading-none"
              style={{ fontFamily: "'GT Pressura', sans-serif" }}
            >
              <GlitchText text={t('login.title', 'LOGIN', 'CONNEXION')} />
            </h1>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg border border-red-500/50 bg-red-500/10 text-white text-sm text-center"
              style={{ fontFamily: "'GT Pressura', sans-serif" }}
            >
              {error}
            </motion.div>
          )}

          {awaitingTwoFactor && !error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg border border-blue-500/50 bg-blue-500/10 text-blue-400 text-sm text-center flex items-center justify-center gap-2"
              style={{ fontFamily: "'GT Pressura', sans-serif" }}
            >
              <Shield size={16} />
              <span>Verification code sent to your email</span>
            </motion.div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {twoFactorMode ? (
              // 2FA Code Input
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label 
                  className="block text-xs text-white/50 mb-2 tracking-[0.2em] uppercase"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  Verification Code
                </label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-2xl text-center tracking-[0.5em] placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  placeholder="000000"
                  autoComplete="off"
                  autoFocus
                />
                <p className="text-xs text-white/40 mt-2 text-center">
                  Enter the 6-digit code sent to {email}
                </p>
              </motion.div>
            ) : (
              // Regular Login Fields
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label 
                    className="block text-xs text-white/50 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    <T>Email</T>
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label 
                    className="block text-xs text-white/50 mb-2 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'GT Pressura', sans-serif" }}
                  >
                    <T>Password</T>
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
                </motion.div>
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-4 bg-white text-black font-bold tracking-[0.2em] uppercase text-sm rounded-lg hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                style={{ fontFamily: "'GT Pressura', sans-serif" }}
              >
                {loading ? (
                  twoFactorMode ? 'Verifying...' : <T>Signing in...</T>
                ) : (
                  twoFactorMode ? 'Verify Code' : <T>Sign In</T>
                )}
              </button>
              
              {twoFactorMode && (
                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorMode(false);
                    setAwaitingTwoFactor(false);
                    setTwoFactorCode('');
                    clearTwoFactorCode();
                    setError('');
                  }}
                  className="w-full mt-4 text-white/50 hover:text-white text-xs tracking-[0.15em] uppercase transition-colors"
                  style={{ fontFamily: "'GT Pressura', sans-serif" }}
                >
                  Back to Login
                </button>
              )}
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

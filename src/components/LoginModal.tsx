import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { supabase } from '../services/authService';
import { T } from './Translate';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      onOpenChange(false);
    } catch (error: any) {
      alert(error.message || (language === 'fr' ? 'Échec de la connexion' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
      });
      if (error) throw error;
      alert(language === 'fr' ? 'Compte créé ! Veuillez vérifier votre courriel pour confirmer votre compte, puis connectez-vous.' : 'Account created! Please check your email to verify your account, then sign in.');
      setSignupEmail('');
      setSignupPassword('');
    } catch (error: any) {
      alert(error.message || (language === 'fr' ? 'Échec de l\'inscription' : 'Signup failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="bg-black border-2 border-white/20 text-white sm:max-w-[500px] pointer-events-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold"><T>Account</T></DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="login"><T>Sign In</T></TabsTrigger>
            <TabsTrigger value="signup"><T>Sign Up</T></TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <Input
                type="email"
                placeholder={language === 'fr' ? 'Courriel' : 'Email'}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                required
              />
              <Input
                type="password"
                placeholder={language === 'fr' ? 'Mot de passe' : 'Password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-white/90"
              >
                {loading ? <T>Signing in...</T> : <T>Sign In</T>}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <Input
                type="email"
                placeholder={language === 'fr' ? 'Courriel' : 'Email'}
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                required
              />
              <Input
                type="password"
                placeholder={language === 'fr' ? 'Mot de passe (min. 6 caractères)' : 'Password (min. 6 characters)'}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                required
                minLength={6}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-white/90"
              >
                {loading ? <T>Creating account...</T> : <T>Sign Up</T>}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { getProfile, logout, isAuthenticated, AdminProfile } from '../../services/authService';
import { Button } from '../ui/button';
import { LogOut, Home, Users, Briefcase, GraduationCap, Code, MessageSquare, Star, FileText, Heart } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProfile = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          if (isMounted) {
            navigate('/admin/login');
          }
          return;
        }

        const data = await getProfile();
        if (isMounted) {
          setProfile(data);
        }
      } catch (error) {
        await logout();
        if (isMounted) {
          navigate('/admin/login');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();
    
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900">
      {/* Admin Navigation */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-full px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'GT Pressura, sans-serif' }}>Admin Dashboard</h1>
              {profile && (
                <span className="text-sm text-gray-400 hidden sm:block">
                  {profile.email}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white/5 backdrop-blur-xl border-r border-white/10 p-4 hidden md:block">
          <nav className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-xl"
              onClick={() => navigate('/admin/dashboard')}
            >
              <Home className="w-4 h-4 mr-3" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-xl"
              onClick={() => navigate('/admin/skills')}
            >
              <Code className="w-4 h-4 mr-3" />
              Skills
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-xl"
              onClick={() => navigate('/admin/projects')}
            >
              <FileText className="w-4 h-4 mr-3" />
              Projects
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-xl"
              onClick={() => navigate('/admin/work-experience')}
            >
              <Briefcase className="w-4 h-4 mr-3" />
              Work Experience
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-xl"
              onClick={() => navigate('/admin/education')}
            >
              <GraduationCap className="w-4 h-4 mr-3" />
              Education
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-xl"
              onClick={() => navigate('/admin/hobbies')}
            >
              <Heart className="w-4 h-4 mr-3" />
              Hobbies
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-xl"
              onClick={() => navigate('/admin/resumes')}
            >
              <FileText className="w-4 h-4 mr-3" />
              Resumes
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-xl"
              onClick={() => navigate('/admin/testimonials')}
            >
              <Star className="w-4 h-4 mr-3" />
              Testimonials
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-xl"
              onClick={() => navigate('/admin/messages')}
            >
              <MessageSquare className="w-4 h-4 mr-3" />
              Messages
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

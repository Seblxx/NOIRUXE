import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getSkills } from '../../services/skillsService';
import { getProjects } from '../../services/projectsService';
import { getWorkExperience } from '../../services/workExperienceService';
import { getEducation } from '../../services/educationService';
import { Code, FileText, Briefcase, GraduationCap, Heart, MessageSquare, Star } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    experience: 0,
    education: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async () => {
      try {
        const [skills, projects, experience, education] = await Promise.all([
          getSkills().catch(() => []),
          getProjects().catch(() => []),
          getWorkExperience().catch(() => []),
          getEducation().catch(() => []),
        ]);

        if (isMounted) {
          setStats({
            skills: skills.length,
            projects: projects.length,
            experience: experience.length,
            education: education.length,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    { title: 'Skills', value: stats.skills, icon: Code, color: 'text-blue-500' },
    { title: 'Projects', value: stats.projects, icon: FileText, color: 'text-green-500' },
    { title: 'Work Experience', value: stats.experience, icon: Briefcase, color: 'text-purple-500' },
    { title: 'Education', value: stats.education, icon: GraduationCap, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'GT Pressura, sans-serif' }}>Dashboard</h2>
        <p className="text-gray-400">Overview of your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
              <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {loading ? '...' : stat.value}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white" style={{ fontFamily: 'GT Pressura, sans-serif' }}>Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">
            Manage your portfolio content
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:border-red-500/50 transition-all cursor-pointer group">
            <Heart className="w-8 h-8 text-red-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold text-lg mb-1">Hobbies</h3>
            <p className="text-sm text-gray-400">Manage your hobbies and interests</p>
          </div>
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:border-yellow-500/50 transition-all cursor-pointer group">
            <Star className="w-8 h-8 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold text-lg mb-1">Testimonials</h3>
            <p className="text-sm text-gray-400">Review and approve testimonials</p>
          </div>
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:border-green-500/50 transition-all cursor-pointer group">
            <MessageSquare className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold text-lg mb-1">Messages</h3>
            <p className="text-sm text-gray-400">View contact form messages</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

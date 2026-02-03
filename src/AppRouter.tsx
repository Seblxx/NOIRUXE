import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';
import { Login } from './pages/Login';
import { Contact } from './pages/Contact';
import { Projects } from './pages/Projects';
import { About } from './pages/About';
import { Skills } from './pages/Skills';
import { Experience } from './pages/Experience';
import { Education } from './pages/Education';
import { Hobbies } from './pages/Hobbies';
import { Testimonials } from './pages/Testimonials';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminSkills } from './components/admin/AdminSkills';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminWorkExperience } from './components/admin/AdminWorkExperience';
import { AdminEducation } from './components/admin/AdminEducation';
import { AdminHobbies } from './components/admin/AdminHobbies';
import { AdminResumes } from './components/admin/AdminResumes';
import { AdminTestimonials } from './components/admin/AdminTestimonials';
import { AdminMessages } from './components/admin/AdminMessages';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/hobbies" element={<Hobbies />} />
          <Route path="/testimonials" element={<Testimonials />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="work-experience" element={<AdminWorkExperience />} />
            <Route path="education" element={<AdminEducation />} />
            <Route path="hobbies" element={<AdminHobbies />} />
            <Route path="resumes" element={<AdminResumes />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default AppRouter;

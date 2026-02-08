import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';
import { Login } from './pages/Login';
import { Contact } from './pages/Contact';
import { Projects } from './pages/Projects';
import { About } from './pages/About';
import { Overview } from './pages/Overview';
import { Testimonials } from './pages/Testimonials';
import { AdminDashboard } from './pages/AdminDashboard';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Navigate to="/login" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/skills" element={<Overview />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/experience" element={<Navigate to="/overview" replace />} />
          <Route path="/education" element={<Navigate to="/overview" replace />} />
          <Route path="/hobbies" element={<Navigate to="/overview" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default AppRouter;

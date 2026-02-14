import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { T } from './Translate';
import { useLanguage } from '../contexts/LanguageContext';
import * as resumesService from '../services/resumesService';

interface DownloadCVButtonProps {
  className?: string;
}

export function DownloadCVButton({ className }: DownloadCVButtonProps) {
  const { language } = useLanguage();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>('CV.pdf');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const resume = await resumesService.getActiveResume(language as 'en' | 'fr');
        setResumeUrl(resume.file_url);
        setResumeFileName(resume.file_name || 'CV.pdf');
      } catch {
        // Fallback: try the other language
        try {
          const fallbackLang = language === 'en' ? 'fr' : 'en';
          const resume = await resumesService.getActiveResume(fallbackLang as 'en' | 'fr');
          setResumeUrl(resume.file_url);
          setResumeFileName(resume.file_name || 'CV.pdf');
        } catch {
          // Final fallback to static file
          setResumeUrl('/Media/FINAL CV III.pdf');
          setResumeFileName('Sebastien_Legagneur_CV.pdf');
        }
      }
    };
    fetchResume();
  }, [language]);

  const handleDownload = () => {
    if (!resumeUrl) return;
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={handleDownload}
      className={`group relative flex items-center gap-3 overflow-hidden border-2 transition-all duration-300 ${className || ''}`}
      variant="outline"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
      <span className="relative z-10 font-semibold"><T>Download CV</T></span>
    </Button>
  );
}

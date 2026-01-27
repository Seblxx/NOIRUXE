import { Download } from 'lucide-react';
import { Button } from './ui/button';

interface DownloadCVButtonProps {
  className?: string;
}

export function DownloadCVButton({ className }: DownloadCVButtonProps) {
  const handleDownload = () => {
    // Path to the CV in Media folder
    const cvPath = '/Media/FINAL CV III.pdf';
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = cvPath;
    link.download = 'Sebastien_Legagneur_CV.pdf';
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
      <span className="relative z-10 font-semibold">Download CV</span>
    </Button>
  );
}

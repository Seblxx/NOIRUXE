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
    link.download = 'CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={handleDownload}
      className={`group flex items-center gap-3 ${className || ''}`}
      variant="outline"
    >
      <Download className="w-5 h-5 group-hover:animate-bounce" />
      <span>Download CV</span>
    </Button>
  );
}

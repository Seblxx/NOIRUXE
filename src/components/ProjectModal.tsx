import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ExternalLink, Github } from 'lucide-react';
import { Project } from '@/services/projectsService';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when project changes or modal closes
  useEffect(() => {
    if (!isOpen || !project) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, project]);

  if (!project) return null;

  const allMedia = [
    ...(project.image_url ? [project.image_url] : []),
    ...(project.gallery_urls || [])
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allMedia.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  const isVideo = (url: string) => {
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-black/95 border-2 border-cyan-500/50 text-white pointer-events-auto">
        <DialogHeader>
          <DialogTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-pink-500" style={{ fontFamily: 'GT Pressura, sans-serif' }}>
            {project.title_en}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Media Gallery */}
          {allMedia.length > 0 && (
            <div className="relative">
              <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden border-2 border-cyan-500/30">
                {isVideo(allMedia[currentImageIndex]) ? (
                  <video
                    key={allMedia[currentImageIndex]}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  >
                    <source src={allMedia[currentImageIndex]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={allMedia[currentImageIndex]}
                    alt={`${project.title_en} - ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {allMedia.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-cyan-500/50 border-2 border-cyan-500 text-white rounded-full p-3"
                    size="icon"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-cyan-500/50 border-2 border-cyan-500 text-white rounded-full p-3"
                    size="icon"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-sm">
                    {currentImageIndex + 1} / {allMedia.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-4">
            <p className="text-lg text-white/90 leading-relaxed">
              {project.description_en}
            </p>
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-3" style={{ fontFamily: 'GT Pressura, sans-serif' }}>
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 rounded-full text-sm font-semibold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-4 pt-4">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                View Live Project
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-black/50 border-2 border-white/30 hover:border-white/60 text-white font-bold rounded-lg transition-all"
              >
                <Github className="w-5 h-5" />
                View Code
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

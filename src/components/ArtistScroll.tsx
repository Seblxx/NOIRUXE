import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Music } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Artist {
  name: string;
  color: string;
  description: string;
  instagram?: string;
  soundcloud?: string;
  spotify?: string;
  comingSoon?: boolean;
}

interface ArtistScrollProps {
  artists: Artist[];
  onSelectArtist: (name: string) => void;
}

export function ArtistScroll({ artists, onSelectArtist }: ArtistScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>('.artist-card');

    const scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 0.5,
        snap: {
          snapTo: 1 / (sections.length - 1),
          duration: 0.3,
          ease: 'power1.inOut'
        },
        end: () => '+=' + (scrollRef.current!.offsetWidth - window.innerWidth),
        invalidateOnRefresh: true,
      },
    });

    return () => {
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, [artists]);

  return (
    <div ref={containerRef} className="h-screen overflow-hidden relative">
      <div ref={scrollRef} className="flex h-full" style={{ width: `${artists.length * 100}vw` }}>
        {artists.map((artist, idx) => (
          <div
            key={idx}
            className="artist-card w-screen h-full flex items-center justify-center p-12 relative cursor-pointer group"
            style={{ 
              background: `linear-gradient(135deg, ${artist.color}15 0%, black 100%)`
            }}
            onClick={() => onSelectArtist(artist.name)}
          >
            <div className="max-w-4xl w-full">
              <div className="mb-12">
                <h3 
                  className="text-9xl mb-8 group-hover:scale-105 transition-transform"
                  style={{ 
                    fontFamily: 'GT Pressura, sans-serif',
                    fontWeight: 700,
                    color: artist.color,
                    textShadow: `0 0 80px ${artist.color}50`
                  }}
                >
                  {artist.name}
                </h3>
                <p 
                  className="text-3xl text-white/80"
                  style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 300 }}
                >
                  {artist.description}
                </p>
              </div>

              {artist.comingSoon ? (
                <div 
                  className="text-4xl italic"
                  style={{ 
                    color: artist.color,
                    fontFamily: 'GT Pressura, sans-serif'
                  }}
                >
                  Coming Soon
                </div>
              ) : (
                <div className="flex gap-6" onClick={(e) => e.stopPropagation()}>
                  {artist.instagram && (
                    <a 
                      href={artist.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-8 py-4 border-2 hover:bg-white/10 transition-all duration-300"
                      style={{ 
                        borderColor: artist.color,
                        color: artist.color
                      }}
                    >
                      <Instagram className="w-8 h-8" />
                      <span className="text-2xl" style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700 }}>
                        INSTAGRAM
                      </span>
                    </a>
                  )}
                  {(artist.soundcloud || artist.spotify) && (
                    <a 
                      href={artist.soundcloud || artist.spotify} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-8 py-4 border-2 hover:bg-white/10 transition-all duration-300"
                      style={{ 
                        borderColor: artist.color,
                        color: artist.color
                      }}
                    >
                      <Music className="w-8 h-8" />
                      <span className="text-2xl" style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700 }}>
                        {artist.soundcloud ? 'SOUNDCLOUD' : 'SPOTIFY'}
                      </span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Artist indicator */}
            <div className="absolute bottom-12 right-12 flex items-center gap-2">
              <span 
                className="text-6xl"
                style={{ 
                  fontFamily: 'GT Pressura, sans-serif',
                  fontWeight: 700,
                  color: artist.color
                }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="text-2xl text-white/30">/ {String(artists.length).padStart(2, '0')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
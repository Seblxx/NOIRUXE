import { Music, Instagram } from 'lucide-react';

interface Social {
  type: 'tiktok' | 'instagram' | 'soundcloud' | 'spotify';
  url: string;
}

interface ArtistPageProps {
  name: string;
  colors: {
    bg: string;
    accent: string;
    secondary?: string;
  };
  description: string;
  musicUrl?: string;
  musicPlatform?: 'soundcloud' | 'spotify';
  socials: Social[];
  videoUrl?: string;
  hasLeopardPrint?: boolean;
  hasSpinningBall?: boolean;
  comingSoon?: boolean;
}

export function ArtistPage({
  name,
  colors,
  description,
  musicUrl,
  musicPlatform,
  socials,
  videoUrl,
  hasLeopardPrint,
  hasSpinningBall,
  comingSoon,
}: ArtistPageProps) {
  const leopardPrintStyle = hasLeopardPrint
    ? {
        backgroundImage: `radial-gradient(circle, ${colors.accent} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }
    : {};

  const getSocialIcon = (type: string) => {
    switch (type) {
      case 'tiktok':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
          </svg>
        );
      case 'instagram':
        return <Instagram className="w-6 h-6" />;
      case 'soundcloud':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm-2 0h1v-8.848c-.508-.079-.623-.05-1-.01v8.858zm-4 0h1v-7.02c-.312.458-.555.971-.692 1.535l-.308-.182v5.667zm-3-5.25c-.606.547-1 1.354-1 2.268 0 .914.394 1.721 1 2.268v-4.536zm18.879-.671c-.204-2.837-2.404-5.079-5.117-5.079-1.022 0-1.964.328-2.762.877v10.123h9.089c1.607 0 2.911-1.393 2.911-3.106 0-2.233-2.168-3.772-4.121-2.815zm-16.879-.027c-.302-.024-.526-.03-1 .122v5.689c.446.143.636.138 1 .138v-5.949z" />
          </svg>
        );
      case 'spotify':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        );
      default:
        return <Music className="w-6 h-6" />;
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.secondary || colors.bg} 100%)`,
        ...leopardPrintStyle,
      }}
    >
      {/* Background Video/Image */}
      {videoUrl && (
        <div className="absolute inset-0 w-full h-full">
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
        </div>
      )}

      {hasSpinningBall && (
        <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-gradient-radial from-white to-gray-300 animate-spin shadow-lg flex items-center justify-center z-20">
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
            <span className="text-white text-xl">8</span>
          </div>
        </div>
      )}

      {/* Content Container - Brazen-inspired layout */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-12">
        {/* Top Section - Artist Name */}
        <div className="flex-1 flex items-center justify-center">
          <h1 
            className="text-[12rem] font-bold tracking-tighter leading-none"
            style={{ 
              color: colors.accent,
              textShadow: `0 0 80px ${colors.accent}40, 0 0 40px ${colors.accent}60`,
              WebkitTextStroke: `2px ${colors.accent}`,
              WebkitTextFillColor: 'transparent'
            }}
          >
            {name}
          </h1>
        </div>

        {/* Bottom Section - Music Player & Info */}
        <div className="space-y-8">
          {/* Music Player Embed */}
          {musicUrl && musicPlatform === 'soundcloud' && (
            <div className="w-full max-w-4xl mx-auto">
              <iframe
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={`${musicUrl}&color=${colors.accent.replace('#', '')}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                className="rounded-lg"
              ></iframe>
            </div>
          )}

          {musicUrl && musicPlatform === 'spotify' && (
            <div className="w-full max-w-4xl mx-auto">
              <iframe
                style={{ borderRadius: '12px' }}
                src={musicUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          )}

          {/* Description & Socials */}
          <div className="flex items-end justify-between max-w-4xl mx-auto text-white">
            <div className="flex-1">
              {comingSoon ? (
                <p className="text-5xl font-light tracking-wide" style={{ color: colors.accent }}>
                  Coming Soon...
                </p>
              ) : (
                <p className="text-xl leading-relaxed max-w-2xl opacity-90">
                  {description}
                </p>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              {socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full hover:scale-125 transition-all duration-300"
                  style={{ 
                    backgroundColor: `${colors.accent}20`,
                    border: `2px solid ${colors.accent}`,
                    color: colors.accent
                  }}
                >
                  {getSocialIcon(social.type)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

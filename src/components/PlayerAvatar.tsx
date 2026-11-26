import React from 'react';
import { TeamMeta } from '../types/ipl';

interface PlayerAvatarProps {
  name: string;
  image: string | null;
  team: string;
  teamsMeta: Record<string, TeamMeta>;
  size?: 'sm' | 'md' | 'lg';
  accentColor?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  name,
  image,
  team,
  teamsMeta,
  size = 'lg',
  accentColor,
}) => {
  const [failed, setFailed] = React.useState(false);
  const meta = teamsMeta[team];
  const color = accentColor || meta?.primary || '#F59E0B';

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  const sizeCls =
    size === 'lg'
      ? 'w-20 h-20 rounded-2xl'
      : size === 'md'
      ? 'w-12 h-12 rounded-xl'
      : 'w-9 h-9 rounded-lg';

  const imgSrc = image
    ? `${import.meta.env.BASE_URL}${image.replace(/^\//, '')}`
    : null;

  return (
    <div
      className={`${sizeCls} relative overflow-hidden shrink-0 border border-white/15 shadow-lg flex items-center justify-center`}
      style={{
        background: `radial-gradient(circle at 30% 20%, ${color}40, #0F172A 85%)`,
      }}
    >
      {imgSrc && !failed ? (
        <img
          src={imgSrc}
          alt={name}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover object-top"
        />
      ) : (
        <div className="flex flex-col items-center justify-center select-none">
          <span
            className={`font-display font-bold tracking-tight text-white/90 ${
              size === 'lg' ? 'text-xl' : size === 'md' ? 'text-sm' : 'text-xs'
            }`}
          >
            {initials}
          </span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { TeamMeta } from '../types/ipl';

interface TeamLogoProps {
  team: string;
  teamsMeta: Record<string, TeamMeta>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-5 h-5',
  sm: 'w-7 h-7',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

export const TeamLogo: React.FC<TeamLogoProps> = ({
  team,
  teamsMeta,
  size = 'md',
  className = '',
}) => {
  const meta = teamsMeta[team];
  const short = meta?.short || team.slice(0, 3).toUpperCase();
  const primary = meta?.primary || '#3B82F6';
  const [failed, setFailed] = React.useState(false);

  const logoSrc = meta?.logo
    ? `${import.meta.env.BASE_URL}${meta.logo.replace(/^\//, '')}`
    : '';

  if (!logoSrc || failed) {
    return (
      <div
        className={`${SIZE_MAP[size]} rounded-full flex items-center justify-center font-display font-bold text-white shrink-0 border border-white/20 shadow-inner ${className}`}
        style={{ background: `linear-gradient(135deg, ${primary}, #0F172A)` }}
        title={team}
      >
        <span className={size === 'xl' ? 'text-lg' : size === 'lg' ? 'text-sm' : 'text-[10px]'}>
          {short}
        </span>
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt={team}
      title={team}
      onError={() => setFailed(true)}
      className={`${SIZE_MAP[size]} object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] ${className}`}
    />
  );
};

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Trophy,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react';

export type TabKey = 'overview' | 'leaderboards' | 'trends' | 'venues';

interface HeaderBarProps {
  seasonsOrder: string[];
  selectedSeason: string;
  onSelectSeason: (season: string) => void;
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  accentColor: string;
}

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Season Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { key: 'leaderboards', label: 'Leaderboards', icon: <Trophy className="w-4 h-4" /> },
  { key: 'trends', label: '2008–2026 Trends', icon: <TrendingUp className="w-4 h-4" /> },
  { key: 'venues', label: 'Venues & Matches', icon: <MapPin className="w-4 h-4" /> },
];

export const HeaderBar: React.FC<HeaderBarProps> = ({
  seasonsOrder,
  selectedSeason,
  onSelectSeason,
  activeTab,
  onSelectTab,
  accentColor,
}) => {
  const reversed = [...seasonsOrder].reverse();
  const idx = reversed.indexOf(selectedSeason);

  const handlePrev = () => {
    if (selectedSeason === 'ALL') {
      onSelectSeason(reversed[0]);
    } else if (idx < reversed.length - 1) {
      onSelectSeason(reversed[idx + 1]);
    }
  };

  const handleNext = () => {
    if (selectedSeason === 'ALL') return;
    if (idx > 0) {
      onSelectSeason(reversed[idx - 1]);
    } else {
      onSelectSeason('ALL');
    }
  };

  const editionNumber =
    selectedSeason === 'ALL'
      ? '19 Seasons (2008–2026)'
      : `Edition #${seasonsOrder.indexOf(selectedSeason) + 1}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070B14]/85 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3">
        {/* Top row: Brand + Tabs + Quick Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-amber-500/25 border border-white/15 shadow-lg">
              <img
                src={`${import.meta.env.BASE_URL}assets/icons/ipl_logo.png`}
                alt="IPL"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
                  IPL Season Analytics
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3" />
                  2008–2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {editionNumber} · Ball-by-Ball &amp; Match Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 overflow-x-auto">
            {TABS.map((t) => {
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => onSelectTab(t.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-white/12 text-white shadow-sm border border-white/15'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Prev/Next + Mobile Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-white/[0.04] border border-white/10 p-0.5">
              <button
                onClick={handlePrev}
                disabled={selectedSeason === reversed[reversed.length - 1]}
                title="Previous Season"
                className="p-1.5 rounded-lg text-slate-300 hover:bg-white/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <select
                value={selectedSeason}
                onChange={(e) => onSelectSeason(e.target.value)}
                className="bg-transparent text-sm font-display font-bold text-white px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">
                  ALL (08–26)
                </option>
                {reversed.map((yr) => (
                  <option key={yr} value={yr} className="bg-slate-900">
                    IPL {yr}
                  </option>
                ))}
              </select>
              <button
                onClick={handleNext}
                disabled={selectedSeason === 'ALL'}
                title="Next Season"
                className="p-1.5 rounded-lg text-slate-300 hover:bg-white/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: Single-click Season Slicer Pills (Power BI signature slicer) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mr-1 shrink-0">
            Season Slicer:
          </span>
          <button
            onClick={() => onSelectSeason('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedSeason === 'ALL'
                ? 'text-slate-950 bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.4)]'
                : 'bg-white/[0.04] text-slate-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            All-Time
          </button>
          {reversed.map((yr) => {
            const active = selectedSeason === yr;
            return (
              <button
                key={yr}
                onClick={() => onSelectSeason(yr)}
                style={
                  active
                    ? {
                        backgroundColor: accentColor,
                        boxShadow: `0 0 16px ${accentColor}66`,
                      }
                    : undefined
                }
                className={`px-2.5 py-1 rounded-lg text-xs font-mono-num font-semibold transition-all shrink-0 cursor-pointer ${
                  active
                    ? 'text-white ring-1 ring-white/40'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/10 border border-white/5'
                }`}
              >
                {yr}
                {yr === '2026' && !active && (
                  <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 align-middle" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

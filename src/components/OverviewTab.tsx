import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Flame,
  Zap,
  Calendar,
  MapPin,
  Award,
  Users,
  Layers,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { IPLDashboardData, PointsRow, SeasonBundle } from '../types/ipl';
import { TeamLogo } from './TeamLogo';
import { PlayerAvatar } from './PlayerAvatar';
import { TeamModal } from './TeamModal';

interface OverviewTabProps {
  data: IPLDashboardData;
  bundle: SeasonBundle;
  prevBundle: SeasonBundle | null;
  onGoToLeaderboards: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  bundle,
  prevBundle,
  onGoToLeaderboards,
}) => {
  const [selectedTeamRow, setSelectedTeamRow] = useState<PointsRow | null>(null);
  const { teamsMeta } = data;
  const isAll = bundle.season === 'ALL';

  const champMeta = teamsMeta[bundle.champion];
  const runMeta = teamsMeta[bundle.runnerUp];

  const delta = (curr: number, prev: number | undefined) => {
    if (!prev || prev === 0) return null;
    const pct = ((curr - prev) / prev) * 100;
    return {
      pct: Math.abs(pct).toFixed(1),
      up: pct >= 0,
    };
  };

  const kpiCards = [
    {
      label: 'Total Sixes',
      value: bundle.kpis.totalSixes.toLocaleString(),
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      delta: delta(bundle.kpis.totalSixes, prevBundle?.kpis.totalSixes),
      accent: 'from-rose-500/15 to-transparent border-rose-500/20',
    },
    {
      label: 'Total Fours',
      value: bundle.kpis.totalFours.toLocaleString(),
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      delta: delta(bundle.kpis.totalFours, prevBundle?.kpis.totalFours),
      accent: 'from-cyan-500/15 to-transparent border-cyan-500/20',
    },
    {
      label: 'Total Matches',
      value: bundle.kpis.totalMatches.toLocaleString(),
      icon: <Calendar className="w-4 h-4 text-indigo-400" />,
      delta: null,
      accent: 'from-indigo-500/15 to-transparent border-indigo-500/20',
    },
    {
      label: 'Total Teams',
      value: bundle.kpis.totalTeams.toLocaleString(),
      icon: <Users className="w-4 h-4 text-emerald-400" />,
      delta: null,
      accent: 'from-emerald-500/15 to-transparent border-emerald-500/20',
    },
    {
      label: 'Centuries (100s)',
      value: bundle.kpis.centuries.toLocaleString(),
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      delta: delta(bundle.kpis.centuries, prevBundle?.kpis.centuries),
      accent: 'from-amber-500/15 to-transparent border-amber-500/20',
    },
    {
      label: 'Half-Centuries (50s)',
      value: bundle.kpis.halfCenturies.toLocaleString(),
      icon: <Target className="w-4 h-4 text-purple-400" />,
      delta: delta(bundle.kpis.halfCenturies, prevBundle?.kpis.halfCenturies),
      accent: 'from-purple-500/15 to-transparent border-purple-500/20',
    },
    {
      label: 'Total Venues',
      value: bundle.kpis.totalVenues.toLocaleString(),
      icon: <MapPin className="w-4 h-4 text-teal-400" />,
      delta: null,
      accent: 'from-teal-500/15 to-transparent border-teal-500/20',
    },
  ];

  const playoffs = bundle.matches
    .filter((m) => m.stage !== 'League')
    .sort((a, b) => a.date.localeCompare(b.date));

  const PHASE_COLORS = ['#38BDF8', '#A855F7', '#F43F5E'];

  return (
    <div className="space-y-6">
      {/* 1. HERO CHAMPION & RUNNER-UP BANNER */}
      {!isAll && bundle.finalInfo ? (
        <section
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0C1322] p-5 sm:p-7 shadow-2xl"
          style={{
            backgroundImage: `radial-gradient(circle at 12% 50%, ${
              champMeta?.primary || '#DA1818'
            }2E, transparent 48%), radial-gradient(circle at 88% 50%, ${
              runMeta?.primary || '#38BDF8'
            }24, transparent 48%)`,
          }}
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Champion */}
            <div className="lg:col-span-4 flex items-center gap-4">
              <div className="relative">
                <div
                  className="absolute -inset-2 rounded-full blur-xl opacity-60 animate-pulse-glow"
                  style={{ backgroundColor: champMeta?.primary || '#F59E0B' }}
                />
                <TeamLogo
                  team={bundle.champion}
                  teamsMeta={teamsMeta}
                  size="xl"
                  className="relative z-10"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  <Trophy className="w-3.5 h-3.5" /> IPL {bundle.season} Champion
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-1.5 leading-tight">
                  {bundle.champion}
                </h2>
                <p className="font-mono-num text-xs text-slate-300 mt-1">
                  {bundle.finalInfo.score1.startsWith(bundle.championShort)
                    ? bundle.finalInfo.score1
                    : bundle.finalInfo.score2}
                </p>
              </div>
            </div>

            {/* Final Match Centerpiece */}
            <div className="lg:col-span-4 flex flex-col items-center text-center px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300">
                Grand Finale · {bundle.finalInfo.date}
              </div>
              <div className="font-display text-base sm:text-lg font-bold text-white mt-1">
                {bundle.finalInfo.resultText}
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate max-w-[260px]">{bundle.finalInfo.venue}</span>
              </div>
              {bundle.finalInfo.pom && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-medium text-emerald-300">
                  <Award className="w-3.5 h-3.5" />
                  Player of the Final: <strong className="text-white">{bundle.finalInfo.pom}</strong>
                </div>
              )}
            </div>

            {/* Runner-Up */}
            <div className="lg:col-span-4 flex items-center lg:justify-end gap-4">
              <div className="lg:text-right order-2 lg:order-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-400/15 text-slate-300 border border-slate-400/30">
                  <Medal className="w-3.5 h-3.5" /> Runner-Up
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100 mt-1.5 leading-tight">
                  {bundle.runnerUp}
                </h2>
                <p className="font-mono-num text-xs text-slate-400 mt-1">
                  {bundle.finalInfo.score1.startsWith(bundle.runnerUpShort)
                    ? bundle.finalInfo.score1
                    : bundle.finalInfo.score2}
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <TeamLogo team={bundle.runnerUp} teamsMeta={teamsMeta} size="xl" />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-r from-[#0E172B] via-[#131D35] to-[#0E172B] p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                <Layers className="w-3.5 h-3.5" /> All-Time IPL Era (2008–2026)
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2">
                19 Seasons · {bundle.kpis.totalMatches.toLocaleString()} Matches · {bundle.kpis.totalRuns.toLocaleString()} Runs
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Complete historical aggregation across every IPL tournament from 2008 through Royal Challengers Bengaluru&apos;s 2026 title defense.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                <div className="text-[11px] uppercase text-slate-400">Most Titles</div>
                <div className="font-display text-lg font-bold text-amber-300">MI &amp; CSK (5)</div>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                <div className="text-[11px] uppercase text-slate-400">Defending Champs</div>
                <div className="font-display text-lg font-bold text-rose-400">RCB (2025, 2026)</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. SECONDARY KPI STRIP (7 CARDS) */}
      <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpiCards.map((k) => (
          <div
            key={k.label}
            className={`rounded-2xl bg-gradient-to-b ${k.accent} bg-[#0C1322] border p-4 flex flex-col justify-between transition-transform hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                {k.label}
              </span>
              <div className="p-1.5 rounded-lg bg-white/[0.05]">{k.icon}</div>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-1">
              <span className="font-mono-num text-2xl font-bold text-white">
                {k.value}
              </span>
              {k.delta && (
                <span
                  className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                    k.delta.up
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-rose-500/15 text-rose-300'
                  }`}
                >
                  {k.delta.up ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {k.delta.pct}%
                </span>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* 3. FOUR PLAYER SPOTLIGHT CARDS (ORANGE CAP, PURPLE CAP, MOST 4s, MOST 6s) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Orange Cap */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/15 via-[#0D1424] to-[#0D1424] border border-orange-500/35 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40">
              <img src={`${import.meta.env.BASE_URL}assets/icons/orange_cap.png`} alt="Orange Cap" className="w-4 h-4 object-contain" />
              Orange Cap
            </span>
            <TeamLogo team={bundle.spotlights.orangeCap.team} teamsMeta={teamsMeta} size="sm" />
          </div>
          <div className="flex items-center gap-3.5">
            <PlayerAvatar
              name={bundle.spotlights.orangeCap.fullName}
              image={bundle.spotlights.orangeCap.image}
              team={bundle.spotlights.orangeCap.team}
              teamsMeta={teamsMeta}
              accentColor="#F97316"
            />
            <div className="min-w-0">
              <div className="font-mono-num text-3xl font-extrabold text-orange-300 leading-none">
                {bundle.spotlights.orangeCap.runs.toLocaleString()}
                <span className="text-xs font-semibold text-orange-200/70 ml-1.5">RUNS</span>
              </div>
              <h3 className="font-display text-base font-bold text-white truncate mt-1.5">
                {bundle.spotlights.orangeCap.fullName}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {bundle.spotlights.orangeCap.team}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center text-xs">
            <div>
              <div className="text-slate-500 text-[10px]">INNS</div>
              <div className="font-mono-num font-bold text-slate-200">{bundle.spotlights.orangeCap.innings}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">SR</div>
              <div className="font-mono-num font-bold text-slate-200">{bundle.spotlights.orangeCap.sr}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">HIGH</div>
              <div className="font-mono-num font-bold text-slate-200">{bundle.spotlights.orangeCap.hs}</div>
            </div>
          </div>
        </div>

        {/* Purple Cap */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/15 via-[#0D1424] to-[#0D1424] border border-purple-500/35 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <img src={`${import.meta.env.BASE_URL}assets/icons/purple_cap.png`} alt="Purple Cap" className="w-4 h-4 object-contain" />
              Purple Cap
            </span>
            <TeamLogo team={bundle.spotlights.purpleCap.team} teamsMeta={teamsMeta} size="sm" />
          </div>
          <div className="flex items-center gap-3.5">
            <PlayerAvatar
              name={bundle.spotlights.purpleCap.fullName}
              image={bundle.spotlights.purpleCap.image}
              team={bundle.spotlights.purpleCap.team}
              teamsMeta={teamsMeta}
              accentColor="#A855F7"
            />
            <div className="min-w-0">
              <div className="font-mono-num text-3xl font-extrabold text-purple-300 leading-none">
                {bundle.spotlights.purpleCap.wickets.toLocaleString()}
                <span className="text-xs font-semibold text-purple-200/70 ml-1.5">WKTS</span>
              </div>
              <h3 className="font-display text-base font-bold text-white truncate mt-1.5">
                {bundle.spotlights.purpleCap.fullName}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {bundle.spotlights.purpleCap.team}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center text-xs">
            <div>
              <div className="text-slate-500 text-[10px]">INNS</div>
              <div className="font-mono-num font-bold text-slate-200">{bundle.spotlights.purpleCap.innings}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">ECON</div>
              <div className="font-mono-num font-bold text-slate-200">{bundle.spotlights.purpleCap.econ}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">BEST</div>
              <div className="font-mono-num font-bold text-slate-200">{bundle.spotlights.purpleCap.bestFigures}</div>
            </div>
          </div>
        </div>

        {/* Most Fours */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/15 via-[#0D1424] to-[#0D1424] border border-cyan-500/35 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Zap className="w-3.5 h-3.5" /> Most Fours
            </span>
            <TeamLogo team={bundle.spotlights.mostFours.team} teamsMeta={teamsMeta} size="sm" />
          </div>
          <div className="flex items-center gap-3.5">
            <PlayerAvatar
              name={bundle.spotlights.mostFours.fullName}
              image={bundle.spotlights.mostFours.image}
              team={bundle.spotlights.mostFours.team}
              teamsMeta={teamsMeta}
              accentColor="#06B6D4"
            />
            <div className="min-w-0">
              <div className="font-mono-num text-3xl font-extrabold text-cyan-300 leading-none">
                {bundle.spotlights.mostFours.count.toLocaleString()}
                <span className="text-xs font-semibold text-cyan-200/70 ml-1.5">4s</span>
              </div>
              <h3 className="font-display text-base font-bold text-white truncate mt-1.5">
                {bundle.spotlights.mostFours.fullName}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {bundle.spotlights.mostFours.team}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-center text-xs">
            <div>
              <div className="text-slate-500 text-[10px]">SEASON RUNS</div>
              <div className="font-mono-num font-bold text-slate-200">{bundle.spotlights.mostFours.runs.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">BOUNDARY RUNS</div>
              <div className="font-mono-num font-bold text-slate-200">{(bundle.spotlights.mostFours.count * 4).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Most Sixes */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500/15 via-[#0D1424] to-[#0D1424] border border-rose-500/35 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <Flame className="w-3.5 h-3.5" /> Most Sixes
            </span>
            <TeamLogo team={bundle.spotlights.mostSixes.team} teamsMeta={teamsMeta} size="sm" />
          </div>
          <div className="flex items-center gap-3.5">
            <PlayerAvatar
              name={bundle.spotlights.mostSixes.fullName}
              image={bundle.spotlights.mostSixes.image}
              team={bundle.spotlights.mostSixes.team}
              teamsMeta={teamsMeta}
              accentColor="#F43F5E"
            />
            <div className="min-w-0">
              <div className="font-mono-num text-3xl font-extrabold text-rose-300 leading-none">
                {bundle.spotlights.mostSixes.count.toLocaleString()}
                <span className="text-xs font-semibold text-rose-200/70 ml-1.5">6s</span>
              </div>
              <h3 className="font-display text-base font-bold text-white truncate mt-1.5">
                {bundle.spotlights.mostSixes.fullName}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {bundle.spotlights.mostSixes.team}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-center text-xs">
            <div>
              <div className="text-slate-500 text-[10px]">SEASON RUNS</div>
              <div className="font-mono-num font-bold text-slate-200">{bundle.spotlights.mostSixes.runs.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">SIXES RUNS</div>
              <div className="font-mono-num font-bold text-slate-200">{(bundle.spotlights.mostSixes.count * 6).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN GRID: POINTS TABLE + TACTICAL INSIGHTS */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Points Table (7 cols) */}
        <div className="xl:col-span-7 rounded-2xl bg-[#0C1322] border border-white/10 shadow-xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {isAll ? 'All-Time Franchise Standings (2008–2026)' : `IPL ${bundle.season} Points Table`}
              </h3>
              <p className="text-xs text-slate-400">
                {isAll
                  ? 'Cumulative matches, wins, and net run rate across all 19 seasons · Click any team for matches'
                  : 'Official league standings (2 pts Win · 1 pt NR) · Click any team to inspect campaign'}
              </p>
            </div>
            {!isAll && (
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Top 4 Playoff Qualified
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.02]">
                  <th className="py-3 pl-5 pr-2">#</th>
                  <th className="py-3 px-2">Team</th>
                  <th className="py-3 px-2 text-center">P</th>
                  <th className="py-3 px-2 text-center">W</th>
                  <th className="py-3 px-2 text-center">L</th>
                  <th className="py-3 px-2 text-center">NR</th>
                  <th className="py-3 px-2 text-right">NRR</th>
                  <th className="py-3 pl-2 pr-5 text-right">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-sm">
                {bundle.pointsTable.map((row) => {
                  const winPct =
                    row.played > 0 ? Math.round((row.won / row.played) * 100) : 0;
                  return (
                    <tr
                      key={row.team}
                      onClick={() => setSelectedTeamRow(row)}
                      className={`group cursor-pointer transition-colors hover:bg-white/[0.05] ${
                        row.qualified ? 'bg-emerald-500/[0.03]' : ''
                      }`}
                    >
                      <td className="py-3 pl-5 pr-2 font-mono-num text-xs font-bold text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-5 rounded-full ${
                              row.isChampion
                                ? 'bg-amber-400'
                                : row.qualified
                                ? 'bg-emerald-400'
                                : 'bg-transparent'
                            }`}
                          />
                          <span>{row.pos}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <TeamLogo team={row.team} teamsMeta={teamsMeta} size="sm" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                                {row.team}
                              </span>
                              {row.qualified && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  Q
                                </span>
                              )}
                              {row.isChampion && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                  C
                                </span>
                              )}
                            </div>
                            <div className="w-24 h-1 rounded-full bg-white/10 mt-1 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${winPct}%`,
                                  backgroundColor:
                                    teamsMeta[row.team]?.primary || '#3B82F6',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-mono-num text-slate-300">
                        {row.played}
                      </td>
                      <td className="py-3 px-2 text-center font-mono-num font-semibold text-emerald-400">
                        {row.won}
                      </td>
                      <td className="py-3 px-2 text-center font-mono-num text-rose-400">
                        {row.lost}
                      </td>
                      <td className="py-3 px-2 text-center font-mono-num text-slate-400">
                        {row.nr}
                      </td>
                      <td
                        className={`py-3 px-2 text-right font-mono-num text-xs font-semibold ${
                          row.nrr >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {row.nrr >= 0 ? `+${row.nrr.toFixed(3)}` : row.nrr.toFixed(3)}
                      </td>
                      <td className="py-3 pl-2 pr-5 text-right">
                        <span className="inline-flex items-center justify-center min-w-[34px] px-2 py-0.5 rounded-lg font-mono-num font-bold text-white bg-white/10">
                          {row.points}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Analytics Column (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Phase Scoring Breakdown */}
          <div className="rounded-2xl bg-[#0C1322] border border-white/10 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Innings Phase Scoring Rate
                </h3>
                <p className="text-xs text-slate-400">
                  Run rate &amp; boundary % across Powerplay, Middle &amp; Death overs
                </p>
              </div>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bundle.phaseBreakdown}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <XAxis
                    dataKey="phase"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="runRate" name="Run Rate" radius={[8, 8, 0, 0]} barSize={44}>
                    {bundle.phaseBreakdown.map((_, idx) => (
                      <Cell key={idx} fill={PHASE_COLORS[idx % PHASE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
              {bundle.phaseBreakdown.map((p, i) => (
                <div key={p.phase} className="rounded-xl bg-white/[0.03] p-2.5 text-center">
                  <div className="text-[10px] font-semibold uppercase text-slate-400">
                    {p.phase.split(' ')[0]}
                  </div>
                  <div
                    className="font-mono-num text-base font-bold mt-0.5"
                    style={{ color: PHASE_COLORS[i] }}
                  >
                    {p.runRate} RPO
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {p.wickets} wkts · {p.boundaryPct}% bnd
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Playoff Bracket or Top Scorers Quick Peek */}
          {!isAll && playoffs.length > 0 ? (
            <div className="rounded-2xl bg-[#0C1322] border border-white/10 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    IPL {bundle.season} Playoff Results
                  </h3>
                  <p className="text-xs text-slate-400">Road to the Championship</p>
                </div>
                <button
                  onClick={onGoToLeaderboards}
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                >
                  Full Stats <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2.5">
                {playoffs.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border ${
                      m.stage === 'Final'
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span
                        className={`font-bold uppercase tracking-wider ${
                          m.stage === 'Final' ? 'text-amber-300' : 'text-sky-300'
                        }`}
                      >
                        {m.stage}
                      </span>
                      <span className="text-slate-400">{m.date}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="font-semibold text-white">
                        {m.team1Bat}{' '}
                        <span className="font-mono-num text-slate-300">{m.score1}</span>
                        <span className="text-slate-500 mx-1.5">vs</span>
                        {m.team2Bat}{' '}
                        <span className="font-mono-num text-slate-300">{m.score2}</span>
                      </div>
                      <span className="font-semibold text-emerald-300 shrink-0">
                        {m.winnerShort} {m.margin}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#0C1322] border border-white/10 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base font-bold text-white">
                  All-Time Top 5 Run Scorers
                </h3>
                <button
                  onClick={onGoToLeaderboards}
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                >
                  View Top 20 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {bundle.topBatters.slice(0, 5).map((b, i) => (
                  <div
                    key={b.player}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono-num text-xs font-bold text-slate-400 w-4">
                        {i + 1}
                      </span>
                      <PlayerAvatar
                        name={b.fullName}
                        image={b.image}
                        team={b.team}
                        teamsMeta={teamsMeta}
                        size="sm"
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">{b.fullName}</div>
                        <div className="text-[11px] text-slate-400">
                          {b.teamShort} · SR {b.sr} · {b.hundreds}x100s
                        </div>
                      </div>
                    </div>
                    <div className="font-mono-num text-base font-bold text-amber-300">
                      {b.runs.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <TeamModal
        teamRow={selectedTeamRow}
        season={bundle.season}
        matches={bundle.matches}
        teamsMeta={teamsMeta}
        onClose={() => setSelectedTeamRow(null)}
      />
    </div>
  );
};

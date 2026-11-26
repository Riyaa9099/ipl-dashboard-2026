import React, { useState } from 'react';
import { Trophy, Swords, TrendingUp, Flame } from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { IPLDashboardData } from '../types/ipl';
import { TeamLogo } from './TeamLogo';

interface TrendsTabProps {
  data: IPLDashboardData;
  onSelectSeason: (season: string) => void;
}

export const TrendsTab: React.FC<TrendsTabProps> = ({ data, onSelectSeason }) => {
  const activeTeams = Object.keys(data.teamsMeta).slice(0, 10);
  const [teamA, setTeamA] = useState(activeTeams[0]); // RCB
  const [teamB, setTeamB] = useState(activeTeams[1]); // CSK

  const shortA = data.teamsMeta[teamA]?.short || teamA;
  const shortB = data.teamsMeta[teamB]?.short || teamB;
  const h2hA = data.h2h[shortA]?.[shortB] || { played: 0, wins: 0 };
  const h2hB = data.h2h[shortB]?.[shortA] || { played: 0, wins: 0 };
  const totalH2H = h2hA.played;
  const pctA = totalH2H > 0 ? Math.round((h2hA.wins / totalH2H) * 100) : 50;
  const pctB = 100 - pctA;

  return (
    <div className="space-y-6">
      {/* 1. Scoring Evolution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#0C1322] border border-white/10 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                Boundary Explosion (2008–2026)
              </h3>
              <p className="text-xs text-slate-400">
                Total Sixes &amp; Fours hit each season (1,426 sixes in 2026!)
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.seasonTrends} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSixes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gFours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="season" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="fours"
                  name="Total Fours"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  fill="url(#gFours)"
                />
                <Area
                  type="monotone"
                  dataKey="sixes"
                  name="Total Sixes"
                  stroke="#F43F5E"
                  strokeWidth={2.5}
                  fill="url(#gSixes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-[#0C1322] border border-white/10 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Scoring Tempo &amp; Sixes / Match (2008–2026)
              </h3>
              <p className="text-xs text-slate-400">
                Average tournament Run Rate (RPO) vs Sixes per Match
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.seasonTrends} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="season" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fill: '#FBBF24', fontSize: 11 }} domain={['auto', 'auto']} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#A855F7', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="runRate"
                  name="Avg Run Rate (RPO)"
                  stroke="#FBBF24"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sixesPerMatch"
                  name="Sixes / Match"
                  stroke="#A855F7"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Trophy Cabinet + Head-to-Head Explorer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Franchise Trophy Cabinet */}
        <div className="xl:col-span-7 rounded-2xl bg-[#0C1322] border border-white/10 p-5 shadow-xl">
          <div className="mb-4">
            <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Franchise Trophy Cabinet (2008–2026)
            </h3>
            <p className="text-xs text-slate-400">
              Click any championship year badge to jump directly to that season
            </p>
          </div>
          <div className="space-y-3">
            {data.trophyCabinet
              .filter((t) => t.titles.length > 0 || t.runnerUps.length > 0 || t.playoffs > 0)
              .map((t) => (
                <div
                  key={t.team}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <TeamLogo team={t.team} teamsMeta={data.teamsMeta} size="md" />
                    <div>
                      <div className="font-semibold text-white text-sm">{t.team}</div>
                      <div className="text-xs text-slate-400">
                        {t.wins}/{t.matches} wins ({Math.round((t.wins / Math.max(1, t.matches)) * 100)}%) · {t.playoffs} Playoffs
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                    {t.titles.map((yr) => (
                      <button
                        key={yr}
                        onClick={() => onSelectSeason(yr)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono-num font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30 cursor-pointer"
                        title={`View IPL ${yr}`}
                      >
                        <Trophy className="w-3 h-3" /> {yr}
                      </button>
                    ))}
                    {t.runnerUps.map((yr) => (
                      <button
                        key={`ru-${yr}`}
                        onClick={() => onSelectSeason(yr)}
                        className="px-2 py-1 rounded-lg text-[11px] font-mono-num font-semibold bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 cursor-pointer"
                        title={`Runner-up in ${yr}`}
                      >
                        RU {yr}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Interactive Rivalry Explorer */}
        <div className="xl:col-span-5 rounded-2xl bg-[#0C1322] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Swords className="w-4 h-4 text-rose-400" />
              Head-to-Head Rivalry Explorer
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Compare all-time IPL win records between any two franchises
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-[11px] uppercase text-slate-400 block mb-1">
                  Team A
                </label>
                <select
                  value={teamA}
                  onChange={(e) => setTeamA(e.target.value)}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none"
                >
                  {Object.keys(data.teamsMeta).map((t) => (
                    <option key={t} value={t} className="bg-slate-900">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase text-slate-400 block mb-1">
                  Team B
                </label>
                <select
                  value={teamB}
                  onChange={(e) => setTeamB(e.target.value)}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none"
                >
                  {Object.keys(data.teamsMeta).map((t) => (
                    <option key={t} value={t} className="bg-slate-900">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {teamA === teamB ? (
              <div className="p-8 text-center text-sm text-slate-400 rounded-2xl bg-white/[0.02] border border-white/10">
                Select two different franchises to compare their head-to-head record.
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col items-center text-center w-2/5">
                    <TeamLogo team={teamA} teamsMeta={data.teamsMeta} size="lg" />
                    <span className="font-display font-bold text-white text-sm mt-2">
                      {shortA}
                    </span>
                    <span className="font-mono-num text-3xl font-extrabold text-white mt-1">
                      {h2hA.wins}
                    </span>
                    <span className="text-[11px] text-slate-400">Wins ({pctA}%)</span>
                  </div>

                  <div className="text-center">
                    <div className="text-xs uppercase font-bold text-slate-500">VS</div>
                    <div className="font-mono-num text-xs text-slate-300 mt-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                      {totalH2H} Matches
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center w-2/5">
                    <TeamLogo team={teamB} teamsMeta={data.teamsMeta} size="lg" />
                    <span className="font-display font-bold text-white text-sm mt-2">
                      {shortB}
                    </span>
                    <span className="font-mono-num text-3xl font-extrabold text-white mt-1">
                      {h2hB.wins}
                    </span>
                    <span className="text-[11px] text-slate-400">Wins ({pctB}%)</span>
                  </div>
                </div>

                <div className="h-3 rounded-full overflow-hidden bg-white/10 flex">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${pctA}%`,
                      backgroundColor: data.teamsMeta[teamA]?.primary || '#3B82F6',
                    }}
                  />
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${pctB}%`,
                      backgroundColor: data.teamsMeta[teamB]?.primary || '#F59E0B',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-white/[0.02] border border-white/10 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Recent Champions (2022–2026)
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {data.seasonTrends.slice(-5).map((st) => (
                <button
                  key={st.season}
                  onClick={() => onSelectSeason(st.season)}
                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
                >
                  <div className="font-mono-num text-[11px] text-slate-400">{st.season}</div>
                  <div className="font-display text-sm font-bold text-amber-300 mt-0.5">
                    {st.champion}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

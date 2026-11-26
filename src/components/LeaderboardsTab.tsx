import React, { useState } from 'react';
import { Search, Flame, Award, ShieldAlert } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { IPLDashboardData, SeasonBundle } from '../types/ipl';
import { PlayerAvatar } from './PlayerAvatar';
import { TeamLogo } from './TeamLogo';

interface LeaderboardsTabProps {
  data: IPLDashboardData;
  bundle: SeasonBundle;
}

export const LeaderboardsTab: React.FC<LeaderboardsTabProps> = ({ data, bundle }) => {
  const [mode, setMode] = useState<'batting' | 'bowling'>('batting');
  const [query, setQuery] = useState('');
  const { teamsMeta } = data;
  const q = query.trim().toLowerCase();

  const batters = bundle.topBatters.filter(
    (b) =>
      b.fullName.toLowerCase().includes(q) ||
      b.player.toLowerCase().includes(q) ||
      b.teamShort.toLowerCase().includes(q)
  );
  const bowlers = bundle.topBowlers.filter(
    (b) =>
      b.fullName.toLowerCase().includes(q) ||
      b.player.toLowerCase().includes(q) ||
      b.teamShort.toLowerCase().includes(q)
  );

  const chartData =
    mode === 'batting'
      ? bundle.topBatters.slice(0, 10).map((b) => ({
          name: b.player,
          val: b.runs,
          color: teamsMeta[b.team]?.primary || '#F97316',
        }))
      : bundle.topBowlers.slice(0, 10).map((b) => ({
          name: b.player,
          val: b.wickets,
          color: teamsMeta[b.team]?.primary || '#A855F7',
        }));

  return (
    <div className="space-y-6">
      {/* Top Controls + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl bg-[#0C1322] border border-white/10 p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                {mode === 'batting' ? 'Orange Cap Race — Top 10 Run Scorers' : 'Purple Cap Race — Top 10 Wicket Takers'}
              </h2>
              <p className="text-xs text-slate-400">
                {bundle.season === 'ALL' ? 'All-Time IPL (2008–2026)' : `IPL ${bundle.season} Season`}
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10">
              <button
                onClick={() => setMode('batting')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'batting'
                    ? 'bg-orange-500/25 text-orange-300 border border-orange-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" /> Batting
              </button>
              <button
                onClick={() => setMode('bowling')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'bowling'
                    ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Bowling
              </button>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 20, bottom: 4 }}
              >
                <XAxis
                  type="number"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  tick={{ fill: '#E2E8F0', fontSize: 11 }}
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
                <Bar
                  dataKey="val"
                  name={mode === 'batting' ? 'Runs' : 'Wickets'}
                  radius={[0, 8, 8, 0]}
                  barSize={18}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Centuries Wall */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0C1322] border border-white/10 p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Season Centuries ({bundle.centuriesList.length})
              </h3>
              <p className="text-xs text-slate-400">100+ individual innings</p>
            </div>
          </div>
          <div className="overflow-y-auto max-h-72 space-y-2 pr-1">
            {bundle.centuriesList.length === 0 ? (
              <div className="text-sm text-slate-500 py-8 text-center">
                No centuries recorded in this season.
              </div>
            ) : (
              bundle.centuriesList.slice(0, 20).map((c, idx) => (
                <div
                  key={`${c.player}-${c.date}-${idx}`}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {c.fullName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {c.teamShort} vs {c.opponentShort} · {c.date}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono-num text-base font-bold text-amber-300">
                      {c.runs}
                      <span className="text-xs text-slate-400 font-normal">({c.balls})</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {c.fours}x4 · {c.sixes}x6
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-2xl bg-[#0C1322] border border-white/10 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-white">
              {mode === 'batting' ? 'Top 20 Run Scorers' : 'Top 20 Wicket Takers'}
            </h3>
            <p className="text-xs text-slate-400">
              Complete batting &amp; bowling efficiency metrics
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search player or team..."
              className="pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {mode === 'batting' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.02]">
                  <th className="py-3 pl-5 pr-2">#</th>
                  <th className="py-3 px-2">Player</th>
                  <th className="py-3 px-2">Team</th>
                  <th className="py-3 px-2 text-center">Inns</th>
                  <th className="py-3 px-2 text-right">Runs</th>
                  <th className="py-3 px-2 text-right">HS</th>
                  <th className="py-3 px-2 text-right">Avg</th>
                  <th className="py-3 px-2 text-right">SR</th>
                  <th className="py-3 px-2 text-center">4s</th>
                  <th className="py-3 px-2 text-center">6s</th>
                  <th className="py-3 pl-2 pr-5 text-center">50 / 100</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-sm">
                {batters.map((b, i) => (
                  <tr key={b.player} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 pl-5 pr-2 font-mono-num text-xs text-slate-400 font-bold">
                      {i + 1}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <PlayerAvatar
                          name={b.fullName}
                          image={b.image}
                          team={b.team}
                          teamsMeta={teamsMeta}
                          size="sm"
                        />
                        <span className="font-semibold text-white">{b.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <TeamLogo team={b.team} teamsMeta={teamsMeta} size="xs" />
                        <span className="text-xs font-semibold text-slate-300">
                          {b.teamShort}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-mono-num text-slate-300">{b.innings}</td>
                    <td className="py-3 px-2 text-right font-mono-num font-bold text-orange-300">
                      {b.runs.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right font-mono-num text-slate-200">{b.hs}</td>
                    <td className="py-3 px-2 text-right font-mono-num text-slate-300">{b.avg}</td>
                    <td className="py-3 px-2 text-right font-mono-num text-emerald-300">{b.sr}</td>
                    <td className="py-3 px-2 text-center font-mono-num text-cyan-300">{b.fours}</td>
                    <td className="py-3 px-2 text-center font-mono-num text-rose-300">{b.sixes}</td>
                    <td className="py-3 pl-2 pr-5 text-center font-mono-num text-xs text-slate-300">
                      {b.fifties} / {b.hundreds}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.02]">
                  <th className="py-3 pl-5 pr-2">#</th>
                  <th className="py-3 px-2">Player</th>
                  <th className="py-3 px-2">Team</th>
                  <th className="py-3 px-2 text-center">Inns</th>
                  <th className="py-3 px-2 text-right">Wkts</th>
                  <th className="py-3 px-2 text-right">Best</th>
                  <th className="py-3 px-2 text-right">Econ</th>
                  <th className="py-3 px-2 text-right">Avg</th>
                  <th className="py-3 px-2 text-right">SR</th>
                  <th className="py-3 pl-2 pr-5 text-right">Dots</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-sm">
                {bowlers.map((b, i) => (
                  <tr key={b.player} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 pl-5 pr-2 font-mono-num text-xs text-slate-400 font-bold">
                      {i + 1}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <PlayerAvatar
                          name={b.fullName}
                          image={b.image}
                          team={b.team}
                          teamsMeta={teamsMeta}
                          size="sm"
                        />
                        <span className="font-semibold text-white">{b.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <TeamLogo team={b.team} teamsMeta={teamsMeta} size="xs" />
                        <span className="text-xs font-semibold text-slate-300">
                          {b.teamShort}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-mono-num text-slate-300">{b.innings}</td>
                    <td className="py-3 px-2 text-right font-mono-num font-bold text-purple-300">
                      {b.wickets.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right font-mono-num text-slate-200">
                      {b.bestFigures}
                    </td>
                    <td className="py-3 px-2 text-right font-mono-num text-emerald-300">
                      {b.econ}
                    </td>
                    <td className="py-3 px-2 text-right font-mono-num text-slate-300">{b.avg}</td>
                    <td className="py-3 px-2 text-right font-mono-num text-slate-300">{b.sr}</td>
                    <td className="py-3 pl-2 pr-5 text-right font-mono-num text-sky-300">
                      {b.dots.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

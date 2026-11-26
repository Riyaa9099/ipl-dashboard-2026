import React, { useState } from 'react';
import { MapPin, Search, Calendar, Award, Filter } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { IPLDashboardData, SeasonBundle } from '../types/ipl';
import { TeamLogo } from './TeamLogo';

interface VenuesMatchesTabProps {
  data: IPLDashboardData;
  bundle: SeasonBundle;
}

export const VenuesMatchesTab: React.FC<VenuesMatchesTabProps> = ({ data, bundle }) => {
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const teamsInSeason = Array.from(
    new Set(bundle.matches.flatMap((m) => [m.team1, m.team2]))
  ).sort();

  const filteredMatches = bundle.matches.filter((m) => {
    if (teamFilter !== 'ALL' && m.team1 !== teamFilter && m.team2 !== teamFilter) {
      return false;
    }
    if (stageFilter === 'PLAYOFFS' && m.stage === 'League') return false;
    if (stageFilter === 'LEAGUE' && m.stage !== 'League') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.venue.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.team1.toLowerCase().includes(q) ||
        m.team2.toLowerCase().includes(q) ||
        m.pom.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const topVenues = bundle.venues.slice(0, 10).map((v) => ({
    name: v.city || v.venue.split(',')[0],
    batFirst: v.batFirstWins,
    chase: v.chaseWins,
    avg1st: v.avgFirstInnings,
    sixes: v.sixes,
  }));

  return (
    <div className="space-y-6">
      {/* Venue Chart & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-2xl bg-[#0C1322] border border-white/10 p-5 shadow-xl">
          <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-400" />
            Venue Toss &amp; Win Bias (Bat 1st vs Chase)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Top grounds by match count in {bundle.season === 'ALL' ? '2008–2026' : `IPL ${bundle.season}`}
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVenues} margin={{ top: 4, right: 12, left: -12, bottom: 48 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend verticalAlign="top" height={32} wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="batFirst" name="Bat 1st Wins" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                <Bar dataKey="chase" name="Chase Wins" stackId="a" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl bg-[#0C1322] border border-white/10 p-5 shadow-xl">
          <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1">
            Stadium Scoring Profiles ({bundle.venues.length} Venues)
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Average 1st-innings total &amp; sixes hit per venue
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {bundle.venues.map((v) => (
              <div
                key={v.venue}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white line-clamp-1" title={v.venue}>
                    {v.venue}
                  </div>
                  <div className="text-[11px] text-slate-400">{v.city} · {v.matches} matches</div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-xs">
                  <span className="text-slate-300">
                    Avg 1st: <strong className="font-mono-num text-amber-300">{v.avgFirstInnings}</strong>
                  </span>
                  <span className="text-slate-300">
                    Sixes: <strong className="font-mono-num text-rose-300">{v.sixes}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Match Center Explorer */}
      <div className="rounded-2xl bg-[#0C1322] border border-white/10 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-white">
              Match Center ({filteredMatches.length} matches)
            </h3>
            <p className="text-xs text-slate-400">
              {bundle.season === 'ALL'
                ? 'Showing latest 100 IPL fixtures across history'
                : `Every match played in IPL ${bundle.season}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search venue, POM, team..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white/[0.04] border border-white/10 px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">All Teams</option>
                {teamsInSeason.map((t) => (
                  <option key={t} value={t} className="bg-slate-900">{t}</option>
                ))}
              </select>
            </div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="rounded-xl bg-white/[0.04] border border-white/10 px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Stages</option>
              <option value="LEAGUE" className="bg-slate-900">League Stage</option>
              <option value="PLAYOFFS" className="bg-slate-900">Playoffs &amp; Final</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 max-h-[600px] overflow-y-auto">
          {filteredMatches.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl border transition-colors ${
                m.stage === 'Final'
                  ? 'bg-amber-500/10 border-amber-500/35'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span
                  className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    m.stage === 'Final'
                      ? 'bg-amber-400/20 text-amber-300'
                      : m.stage !== 'League'
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'bg-white/5 text-slate-300'
                  }`}
                >
                  {m.stage === 'League' && m.matchNumber ? `Match #${m.matchNumber}` : m.stage}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {m.date}
                </span>
              </div>

              <div className="space-y-1.5">
                {(() => {
                  const firstTeam = m.team1Bat === m.team1Short ? m.team1 : m.team2;
                  const secondTeam = firstTeam === m.team1 ? m.team2 : m.team1;
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TeamLogo team={firstTeam} teamsMeta={data.teamsMeta} size="xs" />
                          <span className={`text-sm font-semibold ${m.winner === firstTeam ? 'text-white' : 'text-slate-300'}`}>
                            {firstTeam}
                          </span>
                        </div>
                        <span className="font-mono-num text-sm font-bold text-white">{m.score1}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TeamLogo team={secondTeam} teamsMeta={data.teamsMeta} size="xs" />
                          <span className={`text-sm font-semibold ${m.winner === secondTeam ? 'text-white' : 'text-slate-300'}`}>
                            {secondTeam}
                          </span>
                        </div>
                        <span className="font-mono-num text-sm font-bold text-white">{m.score2}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-emerald-300">
                  {m.winnerShort ? `${m.winnerShort} won ${m.margin}` : m.margin}
                </span>
                <div className="flex items-center gap-3 text-slate-400">
                  {m.pom && (
                    <span className="flex items-center gap-1 text-amber-300/90">
                      <Award className="w-3.5 h-3.5" /> {m.pom}
                    </span>
                  )}
                  <span className="truncate max-w-[140px]">{m.city || m.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

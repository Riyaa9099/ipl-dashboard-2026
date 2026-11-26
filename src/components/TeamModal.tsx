import React from 'react';
import {
  X,
  Trophy,
  Calendar,
  MapPin,
  Award,
  TrendingUp,
} from 'lucide-react';
import { MatchRecord, PointsRow, TeamMeta } from '../types/ipl';
import { TeamLogo } from './TeamLogo';

interface TeamModalProps {
  teamRow: PointsRow | null;
  season: string;
  matches: MatchRecord[];
  teamsMeta: Record<string, TeamMeta>;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({
  teamRow,
  season,
  matches,
  teamsMeta,
  onClose,
}) => {
  React.useEffect(() => {
    if (!teamRow) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [teamRow, onClose]);

  if (!teamRow) return null;
  const meta = teamsMeta[teamRow.team];
  const primary = meta?.primary || '#3B82F6';
  const teamMatches = matches.filter(
    (m) => m.team1 === teamRow.team || m.team2 === teamRow.team
  );
  const winRate =
    teamRow.played > 0 ? Math.round((teamRow.won / teamRow.played) * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#0D1424] border border-white/15 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="p-5 border-b border-white/10 flex items-center justify-between"
          style={{
            background: `linear-gradient(120deg, ${primary}33, rgba(13,20,36,0.95))`,
          }}
        >
          <div className="flex items-center gap-3.5">
            <TeamLogo team={teamRow.team} teamsMeta={teamsMeta} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold text-white">
                  {teamRow.team}
                </h3>
                {teamRow.isChampion && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    <Trophy className="w-3 h-3" /> Champion
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {season === 'ALL' ? 'All-Time IPL Record (2008–2026)' : `IPL ${season} Campaign`} · Rank #{teamRow.pos}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 p-4 bg-white/[0.02] border-b border-white/10 text-center">
          <div>
            <div className="text-[11px] text-slate-400 uppercase">Played</div>
            <div className="font-mono-num text-lg font-bold text-white">{teamRow.played}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase">Won</div>
            <div className="font-mono-num text-lg font-bold text-emerald-400">{teamRow.won}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase">Lost</div>
            <div className="font-mono-num text-lg font-bold text-rose-400">{teamRow.lost}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase">Win %</div>
            <div className="font-mono-num text-lg font-bold text-sky-400">{winRate}%</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase">NRR</div>
            <div
              className={`font-mono-num text-lg font-bold ${
                teamRow.nrr >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {teamRow.nrr >= 0 ? `+${teamRow.nrr.toFixed(3)}` : teamRow.nrr.toFixed(3)}
            </div>
          </div>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              Matches ({teamMatches.length})
            </span>
          </div>
          {teamMatches.map((m) => {
            const won = m.winner === teamRow.team;
            const nr = !m.winner;
            return (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      nr
                        ? 'bg-slate-700 text-slate-300'
                        : won
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {nr ? 'NR' : won ? 'W' : 'L'}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <span>
                        {m.team1Bat} <span className="font-mono-num text-slate-300">{m.score1}</span>
                      </span>
                      <span className="text-slate-500 text-xs">vs</span>
                      <span>
                        {m.team2Bat} <span className="font-mono-num text-slate-300">{m.score2}</span>
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {m.date}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-white/5 text-slate-300">
                        {m.stage}
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-[200px]">
                        <MapPin className="w-3 h-3" /> {m.city || m.venue}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-amber-300">
                    {m.winnerShort ? `${m.winnerShort} won ${m.margin}` : m.margin}
                  </div>
                  {m.pom && (
                    <div className="text-[11px] text-slate-400 flex items-center sm:justify-end gap-1 mt-0.5">
                      <Award className="w-3 h-3 text-amber-400" /> {m.pom}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

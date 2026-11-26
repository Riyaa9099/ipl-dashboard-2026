export interface TeamMeta {
  name: string;
  short: string;
  primary: string;
  secondary: string;
  glow: string;
  logo: string;
}

export interface FinalInfo {
  date: string;
  venue: string;
  city: string;
  pom: string;
  resultText: string;
  score1: string;
  score2: string;
}

export interface SeasonKPIs {
  totalMatches: number;
  totalTeams: number;
  totalVenues: number;
  totalSixes: number;
  totalFours: number;
  centuries: number;
  halfCenturies: number;
  totalRuns: number;
  totalWickets: number;
}

export interface BatterStat {
  player: string;
  fullName: string;
  team: string;
  teamShort: string;
  innings: number;
  runs: number;
  balls: number;
  avg: number;
  sr: number;
  fours: number;
  sixes: number;
  fifties: number;
  hundreds: number;
  hs: number;
  image: string | null;
}

export interface BowlerStat {
  player: string;
  fullName: string;
  team: string;
  teamShort: string;
  innings: number;
  wickets: number;
  balls: number;
  runsConceded: number;
  econ: number;
  avg: number;
  sr: number;
  dots: number;
  bestFigures: string;
  image: string | null;
}

export interface BoundaryLeader {
  player: string;
  fullName: string;
  count: number;
  runs: number;
  team: string;
  teamShort: string;
  image: string | null;
}

export interface PointsRow {
  pos: number;
  team: string;
  short: string;
  played: number;
  won: number;
  lost: number;
  nr: number;
  tie: number;
  points: number;
  nrr: number;
  qualified: boolean;
  isChampion: boolean;
  isRunnerUp: boolean;
}

export interface PhaseStat {
  phase: string;
  runRate: number;
  runs: number;
  wickets: number;
  boundaries: number;
  boundaryPct: number;
}

export interface CenturyRecord {
  player: string;
  fullName: string;
  runs: number;
  balls: number;
  sr: number;
  fours: number;
  sixes: number;
  team: string;
  teamShort: string;
  opponentShort: string;
  date: string;
  venue: string;
}

export interface VenueStat {
  venue: string;
  city: string;
  matches: number;
  avgFirstInnings: number;
  batFirstWins: number;
  chaseWins: number;
  sixes: number;
}

export interface MatchRecord {
  id: number;
  season: string;
  date: string;
  stage: string;
  matchNumber: number | null;
  team1: string;
  team1Short: string;
  team2: string;
  team2Short: string;
  score1: string;
  team1Bat: string;
  score2: string;
  team2Bat: string;
  winner: string | null;
  winnerShort: string | null;
  margin: string;
  venue: string;
  city: string;
  pom: string;
  tossWinner: string;
  tossDecision: string;
}

export interface SeasonBundle {
  season: string;
  champion: string;
  championShort: string;
  runnerUp: string;
  runnerUpShort: string;
  finalInfo: FinalInfo | null;
  kpis: SeasonKPIs;
  spotlights: {
    orangeCap: BatterStat;
    purpleCap: BowlerStat;
    mostFours: BoundaryLeader;
    mostSixes: BoundaryLeader;
  };
  pointsTable: PointsRow[];
  phaseBreakdown: PhaseStat[];
  topBatters: BatterStat[];
  topBowlers: BowlerStat[];
  centuriesList: CenturyRecord[];
  venues: VenueStat[];
  matches: MatchRecord[];
}

export interface SeasonTrend {
  season: string;
  matches: number;
  sixes: number;
  fours: number;
  sixesPerMatch: number;
  foursPerMatch: number;
  centuries: number;
  halfCenturies: number;
  runRate: number;
  champion: string;
  runnerUp: string;
  orangeCapPlayer: string;
  orangeCapRuns: number;
  purpleCapPlayer: string;
  purpleCapWickets: number;
}

export interface TrophyCabinetEntry {
  team: string;
  short: string;
  titles: string[];
  runnerUps: string[];
  playoffs: number;
  matches: number;
  wins: number;
}

export interface IPLDashboardData {
  seasonsOrder: string[];
  teamsMeta: Record<string, TeamMeta>;
  seasons: Record<string, SeasonBundle>;
  seasonTrends: SeasonTrend[];
  trophyCabinet: TrophyCabinetEntry[];
  h2h: Record<string, Record<string, { played: number; wins: number }>>;
}

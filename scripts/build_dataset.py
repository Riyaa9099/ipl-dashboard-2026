import os, glob, csv, json
import pandas as pd
import numpy as np

BASE = r'C:\Users\Lakshya sharan\.gemini\antigravity\scratch\ipl-dashboard-2026'
CDIR = os.path.join(BASE, 'data', 'cricsheet')
OUT_DATA = os.path.join(BASE, 'src', 'data')
OUT_CSV = os.path.join(BASE, 'data', 'ipl_2026_dataset')
PLAYERS_DIR = os.path.join(BASE, 'public', 'assets', 'players')
TEAMS_DIR = os.path.join(BASE, 'public', 'assets', 'teams')
os.makedirs(OUT_DATA, exist_ok=True)
os.makedirs(OUT_CSV, exist_ok=True)

TEAM_MAP = {
    'Delhi Daredevils': 'Delhi Capitals',
    'Kings XI Punjab': 'Punjab Kings',
    'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
    'Rising Pune Supergiants': 'Rising Pune Supergiant',
}
SEASON_MAP = {'2007/08': '2008', '2009/10': '2010', '2020/21': '2020'}
NON_BOWLER_WICKETS = {'run out', 'retired hurt', 'obstructing the field', 'retired out'}

TEAM_META = {
    'Royal Challengers Bengaluru': {'short': 'RCB', 'primary': '#DA1818', 'secondary': '#D4AF37', 'glow': 'rgba(218, 24, 24, 0.35)'},
    'Chennai Super Kings': {'short': 'CSK', 'primary': '#F9CD05', 'secondary': '#0081E9', 'glow': 'rgba(249, 205, 5, 0.35)'},
    'Mumbai Indians': {'short': 'MI', 'primary': '#0066CC', 'secondary': '#D1AB3E', 'glow': 'rgba(0, 102, 204, 0.35)'},
    'Kolkata Knight Riders': {'short': 'KKR', 'primary': '#6D3FB8', 'secondary': '#D4AF37', 'glow': 'rgba(109, 63, 184, 0.35)'},
    'Gujarat Titans': {'short': 'GT', 'primary': '#38BDF8', 'secondary': '#B39356', 'glow': 'rgba(56, 189, 248, 0.30)'},
    'Sunrisers Hyderabad': {'short': 'SRH', 'primary': '#FF7A1A', 'secondary': '#F59E0B', 'glow': 'rgba(255, 122, 26, 0.35)'},
    'Rajasthan Royals': {'short': 'RR', 'primary': '#EA1A85', 'secondary': '#3B82F6', 'glow': 'rgba(234, 26, 133, 0.35)'},
    'Delhi Capitals': {'short': 'DC', 'primary': '#2563EB', 'secondary': '#EF4444', 'glow': 'rgba(37, 99, 235, 0.35)'},
    'Punjab Kings': {'short': 'PBKS', 'primary': '#E11D48', 'secondary': '#E2E8F0', 'glow': 'rgba(225, 29, 72, 0.35)'},
    'Lucknow Super Giants': {'short': 'LSG', 'primary': '#0EA5E9', 'secondary': '#F97316', 'glow': 'rgba(14, 165, 233, 0.35)'},
    'Deccan Chargers': {'short': 'DEC', 'primary': '#3B82F6', 'secondary': '#CBD5E1', 'glow': 'rgba(59, 130, 246, 0.30)'},
    'Gujarat Lions': {'short': 'GL', 'primary': '#F97316', 'secondary': '#1E293B', 'glow': 'rgba(249, 115, 22, 0.30)'},
    'Rising Pune Supergiant': {'short': 'RPS', 'primary': '#A855F7', 'secondary': '#F43F5E', 'glow': 'rgba(168, 85, 247, 0.30)'},
    'Pune Warriors': {'short': 'PWI', 'primary': '#06B6D4', 'secondary': '#94A3B8', 'glow': 'rgba(6, 182, 212, 0.30)'},
    'Kochi Tuskers Kerala': {'short': 'KTK', 'primary': '#FB923C', 'secondary': '#A855F7', 'glow': 'rgba(251, 146, 60, 0.30)'},
}

PLAYER_FULL_NAMES = {
    'AC Gilchrist': 'Adam Gilchrist', 'AD Russell': 'Andre Russell', 'AJ Tye': 'Andrew Tye',
    'AM Rahane': 'Ajinkya Rahane', 'Abhishek Sharma': 'Abhishek Sharma', 'B Kumar': 'Bhuvneshwar Kumar',
    'B Sai Sudharsan': 'B Sai Sudharsan', 'CH Gayle': 'Chris Gayle', 'DA Warner': 'David Warner',
    'DJ Bravo': 'Dwayne Bravo', 'F du Plessis': 'Faf du Plessis', 'G Gambhir': 'Gautam Gambhir',
    'GJ Maxwell': 'Glenn Maxwell', 'HV Patel': 'Harshal Patel', 'Imran Tahir': 'Imran Tahir',
    'Ishan Kishan': 'Ishan Kishan', 'JC Buttler': 'Jos Buttler', 'K Rabada': 'Kagiso Rabada',
    'KL Rahul': 'KL Rahul', 'KS Williamson': 'Kane Williamson', 'M Morkel': 'Morne Morkel',
    'M Prasidh Krishna': 'Prasidh Krishna', 'MEK Hussey': 'Michael Hussey', 'ML Hayden': 'Matthew Hayden',
    'MM Sharma': 'Mohit Sharma', 'Mohammed Shami': 'Mohammed Shami', 'N Pooran': 'Nicholas Pooran',
    'PP Ojha': 'Pragyan Ojha', 'RD Gaikwad': 'Ruturaj Gaikwad', 'RP Singh': 'RP Singh',
    'RR Pant': 'Rishabh Pant', 'RV Uthappa': 'Robin Uthappa', 'S Dhawan': 'Shikhar Dhawan',
    'SE Marsh': 'Shaun Marsh', 'SL Malinga': 'Lasith Malinga', 'SR Tendulkar': 'Sachin Tendulkar',
    'ST Jayasuriya': 'Sanath Jayasuriya', 'Shubman Gill': 'Shubman Gill', 'Sohail Tanvir': 'Sohail Tanvir',
    'TM Head': 'Travis Head', 'V Kohli': 'Virat Kohli', 'V Suryavanshi': 'Vaibhav Suryavanshi',
    'YS Chahal': 'Yuzvendra Chahal', 'MS Dhoni': 'MS Dhoni', 'RG Sharma': 'Rohit Sharma',
    'JJ Bumrah': 'Jasprit Bumrah', 'SA Yadav': 'Suryakumar Yadav', 'Rashid Khan': 'Rashid Khan',
    'RM Patidar': 'Rajat Patidar', 'SP Narine': 'Sunil Narine', 'YBK Jaiswal': 'Yashasvi Jaiswal',
    'JC Archer': 'Jofra Archer', 'H Klaasen': 'Heinrich Klaasen',
}

def get_team_logo(team):
    short = TEAM_META.get(team, {}).get('short', 'IPL')
    for ext in ('png', 'svg'):
        if os.path.exists(os.path.join(TEAMS_DIR, f'{short}.{ext}')):
            return f'/assets/teams/{short}.{ext}'
    return ''

def create_fallback_team_svgs():
    for team, meta in TEAM_META.items():
        short = meta['short']
        if not get_team_logo(team):
            svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="g_{short}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{meta['primary']}"/>
      <stop offset="100%" stop-color="{meta['secondary']}"/>
    </linearGradient>
  </defs>
  <polygon points="60,6 108,28 100,88 60,114 20,88 12,28" fill="url(#g_{short})" stroke="#ffffff" stroke-opacity="0.35" stroke-width="4"/>
  <text x="60" y="70" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="{28 if len(short)<=3 else 22}" fill="#ffffff" letter-spacing="1">{short}</text>
</svg>'''
            with open(os.path.join(TEAMS_DIR, f'{short}.svg'), 'w', encoding='utf-8') as f:
                f.write(svg)

def get_player_image(pname):
    safe = pname.replace(' ', '_')
    for ext in ('png', 'jpg', 'webp'):
        if os.path.exists(os.path.join(PLAYERS_DIR, f'{safe}.{ext}')):
            return f'/assets/players/{safe}.{ext}'
    return None

create_fallback_team_svgs()

# Load PBIX players full names if available
p_pbix = pd.read_csv(os.path.join(BASE, 'data', 'raw', 'players-data-updated.csv'))
pbix_full_map = {}
for _, r in p_pbix.iterrows():
    if pd.notna(r['player_full_name']):
        pbix_full_map[r['player_name']] = str(r['player_full_name'])

def full_name(pname):
    return PLAYER_FULL_NAMES.get(pname) or pbix_full_map.get(pname) or pname

# Parse all info CSVs
print('Parsing match info files...')
info_files = glob.glob(os.path.join(CDIR, '*_info.csv'))
match_rows = []
for fp in info_files:
    mid = int(os.path.basename(fp).replace('_info.csv', ''))
    d = {'match_id': mid, 'teams': []}
    with open(fp, encoding='utf-8') as f:
        for row in csv.reader(f):
            if len(row) >= 3 and row[0] == 'info':
                k, v = row[1], row[2]
                if k == 'team':
                    d['teams'].append(TEAM_MAP.get(v, v))
                elif k in ('season', 'date', 'venue', 'city', 'winner', 'winner_runs', 'winner_wickets', 'outcome', 'match_number', 'player_of_match', 'toss_winner', 'toss_decision', 'eliminator', 'method'):
                    d[k] = v
                elif k == 'target_overs' and len(row) >= 4:
                    d['target_overs'] = float(row[3])
    s = SEASON_MAP.get(d.get('season', ''), d.get('season', ''))
    t1, t2 = d['teams'][0], d['teams'][1]
    winner = TEAM_MAP.get(d['winner'], d['winner']) if d.get('winner') else None
    elim = TEAM_MAP.get(d['eliminator'], d['eliminator']) if d.get('eliminator') else None
    toss_w = TEAM_MAP.get(d['toss_winner'], d['toss_winner']) if d.get('toss_winner') else None
    outcome = d.get('outcome')
    if outcome == 'no result':
        result_type = 'no result'
    elif outcome == 'tie':
        result_type = 'tie'
    else:
        result_type = 'win'

    match_rows.append({
        'match_id': mid,
        'season': s,
        'match_date': d.get('date', '').replace('/', '-'),
        'city': d.get('city', ''),
        'venue': d.get('venue', ''),
        'match_number': int(d['match_number']) if d.get('match_number') and str(d['match_number']).isdigit() else None,
        'team1': t1,
        'team2': t2,
        'toss_winner': toss_w,
        'toss_decision': d.get('toss_decision', ''),
        'match_winner': winner,
        'eliminator': elim,
        'win_by_runs': int(d['winner_runs']) if d.get('winner_runs') else None,
        'win_by_wickets': int(d['winner_wickets']) if d.get('winner_wickets') else None,
        'player_of_match': d.get('player_of_match', ''),
        'result': result_type,
        'method': d.get('method', ''),
        'target_overs': d.get('target_overs', 20.0),
    })

df_m = pd.DataFrame(match_rows).sort_values(['season', 'match_date', 'match_id']).reset_index(drop=True)

# Tag playoff stages per season deterministically
df_m['stage'] = 'League'
for s, idxs in df_m.groupby('season').groups.items():
    sub = df_m.loc[idxs].sort_values(['match_date', 'match_id'])
    playoffs = sub[sub['match_number'].isna()]
    p_indices = playoffs.index.tolist()
    if len(p_indices) == 3:
        df_m.loc[p_indices[0], 'stage'] = 'Semi-Final 1'
        df_m.loc[p_indices[1], 'stage'] = 'Semi-Final 2'
        df_m.loc[p_indices[2], 'stage'] = 'Final'
    elif len(p_indices) == 4:
        if int(s) == 2010:
            df_m.loc[p_indices[0], 'stage'] = 'Semi-Final 1'
            df_m.loc[p_indices[1], 'stage'] = 'Semi-Final 2'
            df_m.loc[p_indices[2], 'stage'] = '3rd Place'
            df_m.loc[p_indices[3], 'stage'] = 'Final'
        else:
            df_m.loc[p_indices[0], 'stage'] = 'Qualifier 1'
            df_m.loc[p_indices[1], 'stage'] = 'Eliminator'
            df_m.loc[p_indices[2], 'stage'] = 'Qualifier 2'
            df_m.loc[p_indices[3], 'stage'] = 'Final'

# Export Power-BI-ready CSVs
df_m.to_csv(os.path.join(OUT_CSV, 'ipl_matches_data_2026.csv'), index=False)
teams_export = pd.DataFrame([
    {'team_name': t, 'team_name_short': m['short'], 'primary_color': m['primary'], 'secondary_color': m['secondary'], 'logo_path': get_team_logo(t)}
    for t, m in TEAM_META.items()
])
teams_export.to_csv(os.path.join(OUT_CSV, 'teams_data_2026.csv'), index=False)

print('Loading all_matches.csv...')
df_b = pd.read_csv(os.path.join(CDIR, 'all_matches.csv'), low_memory=False)
df_b['season_norm'] = df_b['season'].astype(str).replace(SEASON_MAP)
df_b['batting_team'] = df_b['batting_team'].replace(TEAM_MAP)
df_b['bowling_team'] = df_b['bowling_team'].replace(TEAM_MAP)
df_b['total_runs'] = df_b['runs_off_bat'].fillna(0).astype(int) + df_b['extras'].fillna(0).astype(int)
df_b['over_num'] = df_b['ball'].astype(float).astype(int) + 1
df_b['is_legal'] = df_b['wides'].isna() & df_b['noballs'].isna()
df_b['is_bowler_wicket'] = df_b['wicket_type'].notna() & (~df_b['wicket_type'].isin(NON_BOWLER_WICKETS))

# Save ball-by-ball CSV for 2026 dataset export
df_b[['match_id', 'season_norm', 'start_date', 'venue', 'innings', 'ball', 'batting_team', 'bowling_team', 'striker', 'non_striker', 'bowler', 'runs_off_bat', 'extras', 'total_runs', 'wicket_type', 'player_dismissed']].to_csv(
    os.path.join(OUT_CSV, 'ball_by_ball_data_2026.csv'), index=False
)
print('Exported Power BI ready CSVs to data/ipl_2026_dataset/')

# Precompute innings totals per match for NRR and match scorecards
inn_stats = df_b[df_b['innings'].isin([1, 2])].groupby(['match_id', 'innings', 'batting_team', 'bowling_team']).agg(
    runs=('total_runs', 'sum'),
    wickets=('wicket_type', lambda x: int(x.notna().sum())),
    legal_balls=('is_legal', 'sum'),
).reset_index()

inn_lookup = {}
for _, r in inn_stats.iterrows():
    mid = int(r['match_id'])
    inn_lookup.setdefault(mid, {})[int(r['innings'])] = {
        'team': r['batting_team'],
        'bowling_team': r['bowling_team'],
        'runs': int(r['runs']),
        'wickets': int(r['wickets']),
        'balls': int(r['legal_balls']),
        'overs_str': f"{int(r['legal_balls'])//6}.{int(r['legal_balls'])%6}"
    }

def compute_season_bundle(season_key, m_sub, b_sub):
    # Champion & Runner-Up from Final
    if season_key == 'ALL':
        champion = 'Mumbai Indians / Chennai Super Kings'
        runner_up = ''
        final_info = None
    else:
        finals = m_sub[m_sub['stage'] == 'Final']
        f_row = finals.iloc[-1] if len(finals) > 0 else m_sub.sort_values(['match_date', 'match_id']).iloc[-1]
        champ = f_row['match_winner'] or f_row['eliminator']
        run_up = f_row['team2'] if champ == f_row['team1'] else f_row['team1']
        champion = champ
        runner_up = run_up
        mid = int(f_row['match_id'])
        inns = inn_lookup.get(mid, {})
        s1 = f"{TEAM_META.get(inns[1]['team'], {}).get('short', inns[1]['team'])} {inns[1]['runs']}/{inns[1]['wickets']} ({inns[1]['overs_str']})" if 1 in inns else ''
        s2 = f"{TEAM_META.get(inns[2]['team'], {}).get('short', inns[2]['team'])} {inns[2]['runs']}/{inns[2]['wickets']} ({inns[2]['overs_str']})" if 2 in inns else ''
        margin = f"won by {int(f_row['win_by_runs'])} runs" if pd.notna(f_row['win_by_runs']) else (
            f"won by {int(f_row['win_by_wickets'])} wickets" if pd.notna(f_row['win_by_wickets']) else 'won (Super Over)'
        )
        final_info = {
            'date': f_row['match_date'],
            'venue': f_row['venue'],
            'city': f_row['city'],
            'pom': f_row['player_of_match'],
            'resultText': f"{TEAM_META.get(champ, {}).get('short', champ)} {margin}",
            'score1': s1,
            'score2': s2,
        }

    # Secondary KPIs (matching PBIX DAX logic)
    b_reg = b_sub[b_sub['innings'].isin([1, 2])]
    total_matches = int(m_sub['match_id'].nunique())
    all_teams = sorted(set(m_sub['team1'].unique()).union(set(m_sub['team2'].unique())))
    total_teams = len(all_teams)
    total_venues = int(m_sub['venue'].nunique())
    total_sixes = int((b_reg['runs_off_bat'] == 6).sum())
    total_fours = int((b_reg['runs_off_bat'] == 4).sum())
    total_runs = int(b_reg['total_runs'].sum())
    total_wickets = int(b_reg['wicket_type'].notna().sum())

    inn_batter = b_reg.groupby(['match_id', 'striker']).agg(
        runs=('runs_off_bat', 'sum'),
        balls=('is_legal', 'sum'),
        fours=('runs_off_bat', lambda x: int((x == 4).sum())),
        sixes=('runs_off_bat', lambda x: int((x == 6).sum())),
        team=('batting_team', 'first'),
        opponent=('bowling_team', 'first'),
    ).reset_index()

    centuries = int((inn_batter['runs'] >= 100).sum())
    half_centuries = int(((inn_batter['runs'] >= 50) & (inn_batter['runs'] < 100)).sum())

    # Top Batters
    bat_grp = b_reg.groupby('striker').agg(
        runs=('runs_off_bat', 'sum'),
        balls=('is_legal', 'sum'),
        fours=('runs_off_bat', lambda x: int((x == 4).sum())),
        sixes=('runs_off_bat', lambda x: int((x == 6).sum())),
        innings=('match_id', 'nunique'),
        team=('batting_team', lambda x: x.mode().iloc[0] if len(x) else ''),
    ).reset_index()
    outs_cnt = b_reg[b_reg['player_dismissed'].notna()].groupby('player_dismissed').size().to_dict()
    hs_map = inn_batter.groupby('striker')['runs'].max().to_dict()
    fifties_map = inn_batter[(inn_batter['runs'] >= 50) & (inn_batter['runs'] < 100)].groupby('striker').size().to_dict()
    hundreds_map = inn_batter[inn_batter['runs'] >= 100].groupby('striker').size().to_dict()

    bat_rows = []
    for _, r in bat_grp.sort_values(['runs', 'balls'], ascending=[False, True]).head(20).iterrows():
        p = r['striker']
        outs = outs_cnt.get(p, 0)
        avg = round(r['runs'] / outs, 2) if outs > 0 else float(r['runs'])
        sr = round((r['runs'] / r['balls']) * 100, 2) if r['balls'] > 0 else 0.0
        bat_rows.append({
            'player': p,
            'fullName': full_name(p),
            'team': r['team'],
            'teamShort': TEAM_META.get(r['team'], {}).get('short', r['team']),
            'innings': int(r['innings']),
            'runs': int(r['runs']),
            'balls': int(r['balls']),
            'avg': avg,
            'sr': sr,
            'fours': int(r['fours']),
            'sixes': int(r['sixes']),
            'fifties': int(fifties_map.get(p, 0)),
            'hundreds': int(hundreds_map.get(p, 0)),
            'hs': int(hs_map.get(p, 0)),
            'image': get_player_image(p),
        })

    # Top Bowlers (conceded runs = runs_off_bat + wides + noballs)
    b_reg = b_reg.copy()
    b_reg['bowler_runs'] = b_reg['runs_off_bat'].fillna(0) + b_reg['wides'].fillna(0) + b_reg['noballs'].fillna(0)
    b_reg['is_dot'] = (b_reg['total_runs'] == 0) & b_reg['is_legal']
    bowl_grp = b_reg.groupby('bowler').agg(
        wickets=('is_bowler_wicket', 'sum'),
        balls=('is_legal', 'sum'),
        runs_conceded=('bowler_runs', 'sum'),
        dots=('is_dot', 'sum'),
        innings=('match_id', 'nunique'),
        team=('bowling_team', lambda x: x.mode().iloc[0] if len(x) else ''),
    ).reset_index()

    # Best figures per bowler
    match_bowl = b_reg.groupby(['bowler', 'match_id']).agg(
        w=('is_bowler_wicket', 'sum'),
        rc=('bowler_runs', 'sum'),
    ).reset_index()
    best_fig_map = {}
    for bw, gbw in match_bowl.groupby('bowler'):
        top = gbw.sort_values(['w', 'rc'], ascending=[False, True]).iloc[0]
        best_fig_map[bw] = f"{int(top['w'])}/{int(top['rc'])}"

    bowl_rows = []
    for _, r in bowl_grp.sort_values(['wickets', 'runs_conceded'], ascending=[False, True]).head(20).iterrows():
        p = r['bowler']
        wkts = int(r['wickets'])
        balls = int(r['balls'])
        rc = int(r['runs_conceded'])
        econ = round((rc / (balls / 6.0)), 2) if balls > 0 else 0.0
        bavg = round(rc / wkts, 2) if wkts > 0 else 0.0
        bsr = round(balls / wkts, 1) if wkts > 0 else 0.0
        bowl_rows.append({
            'player': p,
            'fullName': full_name(p),
            'team': r['team'],
            'teamShort': TEAM_META.get(r['team'], {}).get('short', r['team']),
            'innings': int(r['innings']),
            'wickets': wkts,
            'balls': balls,
            'runsConceded': rc,
            'econ': econ,
            'avg': bavg,
            'sr': bsr,
            'dots': int(r['dots']),
            'bestFigures': best_fig_map.get(p, '0/0'),
            'image': get_player_image(p),
        })

    # Spotlights
    oc_row = bat_rows[0]
    pc_row = bowl_rows[0]
    fours_leader = bat_grp.sort_values(['fours', 'runs'], ascending=[False, False]).iloc[0]
    sixes_leader = bat_grp.sort_values(['sixes', 'runs'], ascending=[False, False]).iloc[0]

    spotlights = {
        'orangeCap': oc_row,
        'purpleCap': pc_row,
        'mostFours': {
            'player': fours_leader['striker'],
            'fullName': full_name(fours_leader['striker']),
            'count': int(fours_leader['fours']),
            'runs': int(fours_leader['runs']),
            'team': fours_leader['team'],
            'teamShort': TEAM_META.get(fours_leader['team'], {}).get('short', fours_leader['team']),
            'image': get_player_image(fours_leader['striker']),
        },
        'mostSixes': {
            'player': sixes_leader['striker'],
            'fullName': full_name(sixes_leader['striker']),
            'count': int(sixes_leader['sixes']),
            'runs': int(sixes_leader['runs']),
            'team': sixes_leader['team'],
            'teamShort': TEAM_META.get(sixes_leader['team'], {}).get('short', sixes_leader['team']),
            'image': get_player_image(sixes_leader['striker']),
        }
    }

    # Points table (League matches only for individual seasons; all matches aggregated for ALL)
    league_m = m_sub[m_sub['stage'] == 'League'] if season_key != 'ALL' else m_sub
    pt = {t: {'team': t, 'short': TEAM_META.get(t, {}).get('short', t), 'played': 0, 'won': 0, 'lost': 0, 'nr': 0, 'tie': 0, 'points': 0, 'rf': 0, 'of': 0.0, 'ra': 0, 'oa': 0.0} for t in all_teams}
    playoff_teams = set(m_sub[m_sub['stage'] != 'League']['team1']).union(set(m_sub[m_sub['stage'] != 'League']['team2']))

    for _, mr in league_m.iterrows():
        t1, t2 = mr['team1'], mr['team2']
        pt[t1]['played'] += 1
        pt[t2]['played'] += 1
        res = mr['result']
        if res == 'no result':
            pt[t1]['nr'] += 1
            pt[t2]['nr'] += 1
            pt[t1]['points'] += 1
            pt[t2]['points'] += 1
        elif res == 'tie':
            w = mr['eliminator'] or mr['match_winner']
            if w and w in pt:
                l = t2 if w == t1 else t1
                pt[w]['won'] += 1
                pt[w]['points'] += 2
                pt[l]['lost'] += 1
                pt[t1]['tie'] += 1
                pt[t2]['tie'] += 1
            else:
                pt[t1]['tie'] += 1
                pt[t2]['tie'] += 1
                pt[t1]['points'] += 1
                pt[t2]['points'] += 1
        else:
            w = mr['match_winner']
            if w and w in pt:
                l = t2 if w == t1 else t1
                pt[w]['won'] += 1
                pt[w]['points'] += 2
                pt[l]['lost'] += 1

        # NRR runs and overs
        mid = int(mr['match_id'])
        inns = inn_lookup.get(mid, {})
        if res != 'no result' and 1 in inns and 2 in inns:
            for inn_num in (1, 2):
                idict = inns[inn_num]
                bt = idict['team']
                blt = idict['bowling_team']
                if bt in pt and blt in pt:
                    overs_dec = 20.0 if idict['wickets'] >= 10 else (idict['balls'] / 6.0)
                    if inn_num == 2 and mr.get('method') == 'D/L' and pd.notna(mr.get('target_overs')):
                        if idict['wickets'] >= 10:
                            overs_dec = float(mr['target_overs'])
                    pt[bt]['rf'] += idict['runs']
                    pt[bt]['of'] += overs_dec
                    pt[blt]['ra'] += idict['runs']
                    pt[blt]['oa'] += overs_dec

    points_table = []
    for t, row in pt.items():
        nrr = round(((row['rf'] / row['of']) - (row['ra'] / row['oa'])), 3) if row['of'] > 0 and row['oa'] > 0 else 0.0
        points_table.append({
            'team': t,
            'short': row['short'],
            'played': row['played'],
            'won': row['won'],
            'lost': row['lost'],
            'nr': row['nr'],
            'tie': row['tie'],
            'points': row['points'],
            'nrr': nrr,
            'qualified': t in playoff_teams if season_key != 'ALL' else False,
            'isChampion': t == champion,
            'isRunnerUp': t == runner_up,
        })
    points_table.sort(key=lambda x: (x['points'], x['nrr'], x['won']), reverse=True)
    for idx, row in enumerate(points_table, 1):
        row['pos'] = idx

    # Phase Breakdown
    phases = []
    for label, o_min, o_max in [('Powerplay (1-6)', 1, 6), ('Middle (7-15)', 7, 15), ('Death (16-20)', 16, 20)]:
        pb = b_reg[(b_reg['over_num'] >= o_min) & (b_reg['over_num'] <= o_max)]
        legal = int(pb['is_legal'].sum())
        runs = int(pb['total_runs'].sum())
        wkts = int(pb['wicket_type'].notna().sum())
        bnds = int(((pb['runs_off_bat'] == 4) | (pb['runs_off_bat'] == 6)).sum())
        rr = round(runs / (legal / 6.0), 2) if legal > 0 else 0.0
        bnd_pct = round((bnds / legal) * 100, 1) if legal > 0 else 0.0
        phases.append({
            'phase': label,
            'runRate': rr,
            'runs': runs,
            'wickets': wkts,
            'boundaries': bnds,
            'boundaryPct': bnd_pct,
        })

    # Centuries list
    m_date_map = m_sub.set_index('match_id')[['match_date', 'venue']].to_dict('index')
    c_rows = []
    for _, cr in inn_batter[inn_batter['runs'] >= 100].sort_values('runs', ascending=False).iterrows():
        mid = int(cr['match_id'])
        sr = round((cr['runs'] / cr['balls']) * 100, 1) if cr['balls'] > 0 else 0.0
        c_rows.append({
            'player': cr['striker'],
            'fullName': full_name(cr['striker']),
            'runs': int(cr['runs']),
            'balls': int(cr['balls']),
            'sr': sr,
            'fours': int(cr['fours']),
            'sixes': int(cr['sixes']),
            'team': cr['team'],
            'teamShort': TEAM_META.get(cr['team'], {}).get('short', cr['team']),
            'opponentShort': TEAM_META.get(cr['opponent'], {}).get('short', cr['opponent']),
            'date': m_date_map.get(mid, {}).get('match_date', ''),
            'venue': m_date_map.get(mid, {}).get('venue', ''),
        })

    # Venue Stats
    venue_rows = []
    for v, gv in m_sub.groupby('venue'):
        mids = set(gv['match_id'])
        v_inns1 = [inn_lookup[int(m)][1]['runs'] for m in mids if int(m) in inn_lookup and 1 in inn_lookup[int(m)]]
        bat_first_wins = int((gv['win_by_runs'].notna()).sum())
        chase_wins = int((gv['win_by_wickets'].notna()).sum())
        v_sixes = int((b_reg[b_reg['match_id'].isin(mids)]['runs_off_bat'] == 6).sum())
        venue_rows.append({
            'venue': v,
            'city': gv['city'].mode().iloc[0] if len(gv['city'].dropna()) else '',
            'matches': len(gv),
            'avgFirstInnings': round(sum(v_inns1) / len(v_inns1), 1) if v_inns1 else 0.0,
            'batFirstWins': bat_first_wins,
            'chaseWins': chase_wins,
            'sixes': v_sixes,
        })
    venue_rows.sort(key=lambda x: x['matches'], reverse=True)

    # Matches list (for Match Center)
    match_list = []
    for _, mr in m_sub.sort_values(['match_date', 'match_id'], ascending=[False, False]).iterrows():
        mid = int(mr['match_id'])
        inns = inn_lookup.get(mid, {})
        t1s = TEAM_META.get(mr['team1'], {}).get('short', mr['team1'])
        t2s = TEAM_META.get(mr['team2'], {}).get('short', mr['team2'])
        ws = TEAM_META.get(mr['match_winner'], {}).get('short', mr['match_winner']) if pd.notna(mr['match_winner']) else None
        margin = f"by {int(mr['win_by_runs'])} runs" if pd.notna(mr['win_by_runs']) else (
            f"by {int(mr['win_by_wickets'])} wkts" if pd.notna(mr['win_by_wickets']) else (
                'Super Over' if mr['result'] == 'tie' else 'No Result'
            )
        )
        match_list.append({
            'id': mid,
            'season': mr['season'],
            'date': mr['match_date'],
            'stage': mr['stage'],
            'matchNumber': int(mr['match_number']) if pd.notna(mr['match_number']) else None,
            'team1': mr['team1'],
            'team1Short': t1s,
            'team2': mr['team2'],
            'team2Short': t2s,
            'score1': f"{inns[1]['runs']}/{inns[1]['wickets']} ({inns[1]['overs_str']})" if 1 in inns else '-',
            'team1Bat': TEAM_META.get(inns[1]['team'], {}).get('short', '') if 1 in inns else t1s,
            'score2': f"{inns[2]['runs']}/{inns[2]['wickets']} ({inns[2]['overs_str']})" if 2 in inns else '-',
            'team2Bat': TEAM_META.get(inns[2]['team'], {}).get('short', '') if 2 in inns else t2s,
            'winner': mr['match_winner'] if pd.notna(mr['match_winner']) else None,
            'winnerShort': ws,
            'margin': margin,
            'venue': mr['venue'],
            'city': mr['city'],
            'pom': mr['player_of_match'] if pd.notna(mr['player_of_match']) else '',
            'tossWinner': TEAM_META.get(mr['toss_winner'], {}).get('short', '') if pd.notna(mr['toss_winner']) else '',
            'tossDecision': mr['toss_decision'] if pd.notna(mr['toss_decision']) else '',
        })

    return {
        'season': season_key,
        'champion': champion,
        'championShort': TEAM_META.get(champion, {}).get('short', 'IPL'),
        'runnerUp': runner_up,
        'runnerUpShort': TEAM_META.get(runner_up, {}).get('short', ''),
        'finalInfo': final_info,
        'kpis': {
            'totalMatches': total_matches,
            'totalTeams': total_teams,
            'totalVenues': total_venues,
            'totalSixes': total_sixes,
            'totalFours': total_fours,
            'centuries': centuries,
            'halfCenturies': half_centuries,
            'totalRuns': total_runs,
            'totalWickets': total_wickets,
        },
        'spotlights': spotlights,
        'pointsTable': points_table,
        'phaseBreakdown': phases,
        'topBatters': bat_rows,
        'topBowlers': bowl_rows,
        'centuriesList': c_rows,
        'venues': venue_rows,
        'matches': match_list[:100] if season_key == 'ALL' else match_list,
    }

print('Computing season bundles...')
seasons_order = sorted(df_m['season'].unique().tolist())
seasons_data = {}
for s in seasons_order:
    ms = df_m[df_m['season'] == s]
    bs = df_b[df_b['season_norm'] == s]
    seasons_data[s] = compute_season_bundle(s, ms, bs)
    print(f'  Done {s}: {seasons_data[s]["kpis"]["totalMatches"]} matches, Champ={seasons_data[s]["championShort"]}')

seasons_data['ALL'] = compute_season_bundle('ALL', df_m, df_b)

# Historical Trends & Franchise Trophies & Head-to-Head
season_trends = []
for s in seasons_order:
    sd = seasons_data[s]
    k = sd['kpis']
    m_cnt = k['totalMatches']
    # Avg runs per over across season
    bs = df_b[(df_b['season_norm'] == s) & (df_b['innings'].isin([1, 2]))]
    legal = int(bs['is_legal'].sum())
    rr = round(int(bs['total_runs'].sum()) / (legal / 6.0), 2) if legal > 0 else 0.0
    season_trends.append({
        'season': s,
        'matches': m_cnt,
        'sixes': k['totalSixes'],
        'fours': k['totalFours'],
        'sixesPerMatch': round(k['totalSixes'] / m_cnt, 1),
        'foursPerMatch': round(k['totalFours'] / m_cnt, 1),
        'centuries': k['centuries'],
        'halfCenturies': k['halfCenturies'],
        'runRate': rr,
        'champion': sd['championShort'],
        'runnerUp': sd['runnerUpShort'],
        'orangeCapPlayer': sd['spotlights']['orangeCap']['player'],
        'orangeCapRuns': sd['spotlights']['orangeCap']['runs'],
        'purpleCapPlayer': sd['spotlights']['purpleCap']['player'],
        'purpleCapWickets': sd['spotlights']['purpleCap']['wickets'],
    })

trophy_cabinet = {}
for t, meta in TEAM_META.items():
    trophy_cabinet[t] = {'team': t, 'short': meta['short'], 'titles': [], 'runnerUps': [], 'playoffs': 0, 'matches': 0, 'wins': 0}

for s in seasons_order:
    sd = seasons_data[s]
    trophy_cabinet[sd['champion']]['titles'].append(s)
    if sd['runnerUp'] in trophy_cabinet:
        trophy_cabinet[sd['runnerUp']]['runnerUps'].append(s)
    for row in sd['pointsTable']:
        if row['qualified']:
            trophy_cabinet[row['team']]['playoffs'] += 1

for _, mr in df_m.iterrows():
    t1, t2, w = mr['team1'], mr['team2'], mr['match_winner']
    if t1 in trophy_cabinet:
        trophy_cabinet[t1]['matches'] += 1
    if t2 in trophy_cabinet:
        trophy_cabinet[t2]['matches'] += 1
    if pd.notna(w) and w in trophy_cabinet:
        trophy_cabinet[w]['wins'] += 1

trophies_list = sorted(trophy_cabinet.values(), key=lambda x: (len(x['titles']), len(x['runnerUps']), x['wins']), reverse=True)

# Head-to-head
h2h = {}
for _, mr in df_m[df_m['result'] == 'win'].iterrows():
    t1, t2, w = mr['team1'], mr['team2'], mr['match_winner']
    s1 = TEAM_META.get(t1, {}).get('short', t1)
    s2 = TEAM_META.get(t2, {}).get('short', t2)
    ws = TEAM_META.get(w, {}).get('short', w)
    h2h.setdefault(s1, {}).setdefault(s2, {'played': 0, 'wins': 0})
    h2h.setdefault(s2, {}).setdefault(s1, {'played': 0, 'wins': 0})
    h2h[s1][s2]['played'] += 1
    h2h[s2][s1]['played'] += 1
    if ws == s1:
        h2h[s1][s2]['wins'] += 1
    elif ws == s2:
        h2h[s2][s1]['wins'] += 1

payload = {
    'seasonsOrder': seasons_order,
    'teamsMeta': {
        t: {**m, 'name': t, 'logo': get_team_logo(t)}
        for t, m in TEAM_META.items()
    },
    'seasons': seasons_data,
    'seasonTrends': season_trends,
    'trophyCabinet': trophies_list,
    'h2h': h2h,
}

out_json = os.path.join(OUT_DATA, 'ipl_dashboard_data.json')
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(payload, f)
print(f'Successfully wrote {out_json} ({os.path.getsize(out_json)/1024/1024:.2f} MB)')

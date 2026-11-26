import os, glob, csv, json, urllib.request, urllib.parse
import pandas as pd

cdir = r'C:\Users\Lakshya sharan\.gemini\antigravity\scratch\ipl-dashboard-2026\data\cricsheet'
info_files = glob.glob(os.path.join(cdir, '*_info.csv'))

TEAM_MAP = {
    'Delhi Daredevils': 'Delhi Capitals',
    'Kings XI Punjab': 'Punjab Kings',
    'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
    'Rising Pune Supergiants': 'Rising Pune Supergiant',
}
SEASON_MAP = {'2007/08': '2008', '2009/10': '2010', '2020/21': '2020'}

# Build match metadata
matches = []
for fp in info_files:
    mid = os.path.basename(fp).replace('_info.csv', '')
    d = {'match_id': mid, 'teams': []}
    with open(fp, encoding='utf-8') as f:
        for row in csv.reader(f):
            if len(row) >= 3 and row[0] == 'info':
                k, v = row[1], row[2]
                if k == 'team':
                    d['teams'].append(TEAM_MAP.get(v, v))
                elif k in ('season', 'date', 'venue', 'city', 'winner', 'winner_runs', 'winner_wickets', 'outcome', 'match_number', 'player_of_match', 'toss_winner', 'toss_decision', 'eliminator'):
                    d[k] = v
    d['season'] = SEASON_MAP.get(d.get('season', ''), d.get('season', ''))
    if d.get('winner'):
        d['winner'] = TEAM_MAP.get(d['winner'], d['winner'])
    if d.get('eliminator'):
        d['eliminator'] = TEAM_MAP.get(d['eliminator'], d['eliminator'])
    matches.append(d)

df_m = pd.DataFrame(matches)
# Load all ball CSVs
ball_dfs = []
for mid in df_m['match_id']:
    b = pd.read_csv(os.path.join(cdir, f'{mid}.csv'), low_memory=False)
    ball_dfs.append(b)
df_b = pd.concat(ball_dfs, ignore_index=True)
df_b['season_norm'] = df_b['season'].astype(str).replace(SEASON_MAP)
df_b['batting_team'] = df_b['batting_team'].replace(TEAM_MAP)
df_b['bowling_team'] = df_b['bowling_team'].replace(TEAM_MAP)

spotlight_players = set()
non_bowler_wickets = {'run out', 'retired hurt', 'obstructing the field', 'retired out'}

for s, g in df_b.groupby('season_norm'):
    oc = g.groupby('striker')['runs_off_bat'].sum().idxmax()
    fours = g[g['runs_off_bat'] == 4].groupby('striker').size().idxmax()
    sixes = g[g['runs_off_bat'] == 6].groupby('striker').size().idxmax()
    wkts = g[g['wicket_type'].notna() & (~g['wicket_type'].isin(non_bowler_wickets))]
    pc = wkts.groupby('bowler').size().idxmax()
    spotlight_players.update([oc, pc, fours, sixes])
    print(f"{s}: OC={oc} ({g.groupby('striker')['runs_off_bat'].sum().max()}), PC={pc} ({wkts.groupby('bowler').size().max()}), 4s={fours}, 6s={sixes}")

print("\nUnique spotlight players count:", len(spotlight_players))
print(sorted(spotlight_players))

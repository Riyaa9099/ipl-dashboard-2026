import os, glob, csv, pandas as pd

cdir = r'C:\Users\Lakshya sharan\.gemini\antigravity\scratch\ipl-dashboard-2026\data\cricsheet'
info_files = glob.glob(os.path.join(cdir, '*_info.csv'))
rows = []
for fp in info_files:
    d = {'match_id': os.path.basename(fp).replace('_info.csv', ''), 'teams': []}
    with open(fp, encoding='utf-8') as f:
        for row in csv.reader(f):
            if len(row) >= 3 and row[0] == 'info':
                k, v = row[1], row[2]
                if k == 'team':
                    d['teams'].append(v)
                elif k in ('season', 'date', 'venue', 'city', 'winner', 'outcome', 'match_number', 'stage', 'player_of_match', 'eliminator'):
                    d[k] = v
    rows.append(d)

df = pd.DataFrame(rows)
season_map = {'2007/08': '2008', '2009/10': '2010', '2020/21': '2020'}
df['season_norm'] = df['season'].replace(season_map)

for s, g in df.groupby('season_norm'):
    g = g.sort_values(['date', 'match_id'])
    last = g.iloc[-1]
    t1, t2 = last['teams']
    w = last.get('winner') if pd.notna(last.get('winner')) else last.get('eliminator')
    print(f"{s}: matches={len(g)} | final={last['date']} | {t1} vs {t2} -> Winner: {w} | stage={last.get('stage')} | no_num={(g['match_number'].isna()).sum()}")

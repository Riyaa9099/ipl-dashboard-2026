import json, os

BASE = r'C:\Users\Lakshya sharan\.gemini\antigravity\scratch\ipl-dashboard-2026'
d = json.load(open(os.path.join(BASE, 'src', 'data', 'ipl_dashboard_data.json')))
for yr in ['2025', '2026']:
    s = d['seasons'][yr]
    print(f'=== {yr} ===')
    print('Champ:', s['champion'], 'RunnerUp:', s['runnerUp'])
    print('Final:', s['finalInfo'])
    print('KPIs:', s['kpis'])
    print('Spotlights:', {k: (v['player'], v.get('runs') or v.get('wickets') or v.get('count'), v['teamShort'], v.get('image')) for k, v in s['spotlights'].items()})
    print('Points Table:')
    for r in s['pointsTable']:
        print(f"  {r['pos']}. {r['short']:4s} P={r['played']} W={r['won']} L={r['lost']} NR={r['nr']} T={r['tie']} Pts={r['points']} NRR={r['nrr']:+.3f} Q={r['qualified']}")

import os, json, urllib.request, urllib.parse

BASE = r'C:\Users\Lakshya sharan\.gemini\antigravity\scratch\ipl-dashboard-2026'
ASSETS_PLAYERS = os.path.join(BASE, 'public', 'assets', 'players')

MISSING = {
    'AJ Tye': 'Andrew Tye cricketer',
    'AM Rahane': 'Ajinkya Rahane cricketer',
    'Abhishek Sharma': 'Abhishek Sharma cricketer 2000',
    'B Sai Sudharsan': 'Sai Sudharsan cricketer',
    'HV Patel': 'Harshal Patel cricketer',
    'KL Rahul': 'KL Rahul cricketer',
    'MM Sharma': 'Mohit Sharma cricketer',
    'N Pooran': 'Nicholas Pooran cricketer',
    'RP Singh': 'R. P. Singh cricketer 1985',
    'ST Jayasuriya': 'Sanath Jayasuriya',
    'Shubman Gill': 'Shubman Gill cricketer',
    'RM Patidar': 'Rajat Patidar cricketer',
    'SP Narine': 'Sunil Narine cricketer',
    'H Klaasen': 'Heinrich Klaasen cricketer',
}

def fetch_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'IPLDashboardProject/1.0'})
    with urllib.request.urlopen(req, timeout=8) as r:
        return json.loads(r.read().decode('utf-8'))

def fetch_bytes(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'IPLDashboardProject/1.0'})
    with urllib.request.urlopen(req, timeout=8) as r:
        return r.read()

for pname, q in MISSING.items():
    safe = pname.replace(' ', '_')
    url = f'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=3&prop=pageimages&piprop=thumbnail&pithumbsize=500&format=json'
    try:
        data = fetch_json(url)
        pages = data.get('query', {}).get('pages', {})
        found = False
        for pid, pinfo in sorted(pages.items(), key=lambda x: x[1].get('index', 99)):
            thumb = pinfo.get('thumbnail', {}).get('source')
            if thumb:
                b = fetch_bytes(thumb)
                ext = '.png' if '.png' in thumb.lower() else '.jpg'
                open(os.path.join(ASSETS_PLAYERS, f'{safe}{ext}'), 'wb').write(b)
                print(f'FOUND {pname}: {pinfo.get("title")} ({ext})')
                found = True
                break
        if not found:
            print(f'STILL MISS {pname}')
    except Exception as e:
        print(f'ERR {pname}: {e}')

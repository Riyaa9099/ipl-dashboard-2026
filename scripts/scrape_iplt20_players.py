import os, re, json, urllib.request, urllib.parse

BASE = r'C:\Users\Lakshya sharan\.gemini\antigravity\scratch\ipl-dashboard-2026'

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=12) as r:
        return r.read().decode('utf-8', 'ignore')

SLUGS = [
    'chennai-super-kings', 'delhi-capitals', 'gujarat-titans',
    'kolkata-knight-riders', 'lucknow-super-giants', 'mumbai-indians',
    'punjab-kings', 'rajasthan-royals', 'royal-challengers-bengaluru',
    'sunrisers-hyderabad'
]

# Look inside team pages for player JSON objects (escaped or unescaped)
all_players = {}
for slug in SLUGS:
    html = fetch(f'https://www.iplt20.com/teams/{slug}')
    # Unescape \" -> "
    clean = html.replace('\\"', '"')
    # Find all player image paths like player/8903/2879/74055.png near player names
    for m in re.finditer(r'"(player/[^"]+\.png)"', clean):
        path = m.group(1)
        start = max(0, m.start() - 400)
        end = min(len(clean), m.end() + 400)
        ctx = clean[start:end]
        # Look for name fields nearby
        nm = re.search(r'"(?:player_name|name|fullName|shortName|PlayerName)"\s*:\s*"([^"]+)"', ctx)
        if nm:
            all_players[nm.group(1)] = f'https://www.iplt20.com/api/team-assets?pathname={urllib.parse.quote(path)}&brand=ipl'
    # Also check raw player id + name patterns in squad
    for m in re.finditer(r'"playerId"\s*:\s*(\d+)[^\}]{0,250}"name"\s*:\s*"([^"]+)"', clean):
        pid, pname = m.group(1), m.group(2)
        if pname not in all_players:
            all_players[pname] = pid

print('Found in team pages:', len(all_players))
for k in ['Virat Kohli', 'Sai Sudharsan', 'Vaibhav Suryavanshi', 'Vaibhav Sooryavanshi', 'Kagiso Rabada', 'Shubman Gill', 'Bhuvneshwar Kumar', 'Prasidh Krishna', 'Nicholas Pooran', 'Abhishek Sharma', 'MS Dhoni', 'Rohit Sharma', 'Jasprit Bumrah', 'Rashid Khan', 'Rajat Patidar']:
    if k in all_players:
        print('  HIT:', k, '->', all_players[k])

# Print sample ctx around one player/8903 match from RCB page
rcb_html = fetch('https://www.iplt20.com/teams/royal-challengers-bengaluru').replace('\\"', '"')
m = re.search(r'player/8903/\d+/\d+\.png', rcb_html)
if m:
    print('\nSample RCB player JSON context:')
    print(rcb_html[max(0, m.start()-300):m.end()+300])

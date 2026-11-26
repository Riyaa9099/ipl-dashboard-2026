import os, shutil, urllib.request, urllib.parse
import pandas as pd

BASE = r'C:\Users\Lakshya sharan\.gemini\antigravity\scratch\ipl-dashboard-2026'
ASSETS_TEAMS = os.path.join(BASE, 'public', 'assets', 'teams')
ASSETS_PLAYERS = os.path.join(BASE, 'public', 'assets', 'players')
ASSETS_ICONS = os.path.join(BASE, 'public', 'assets', 'icons')
os.makedirs(ASSETS_TEAMS, exist_ok=True)
os.makedirs(ASSETS_PLAYERS, exist_ok=True)
os.makedirs(ASSETS_ICONS, exist_ok=True)

# 1. Copy static icons from PBIX
pbix_res = os.path.join(BASE, 'pbix_extracted', 'Report', 'StaticResources', 'RegisteredResources')
icon_copies = {
    'tata_ipl-logo_brandlogos.net_k7420264174527801.png': 'tata_ipl_logo.png',
    'ipl_logo5129378313367712.png': 'ipl_logo.png',
    'Orange_Cap6742541111319741.png': 'orange_cap.png',
    'Purple_Cap06995205778651681.png': 'purple_cap.png',
}
for src_name, dst_name in icon_copies.items():
    src = os.path.join(pbix_res, src_name)
    if os.path.exists(src):
        shutil.copy2(src, os.path.join(ASSETS_ICONS, dst_name))
        print(f"Copied icon {dst_name}")

# 2. Download team logos
TEAM_LOGOS = {
    'Royal Challengers Bengaluru': ('RCB', 'https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png'),
    'Sunrisers Hyderabad': ('SRH', 'https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png'),
    'Mumbai Indians': ('MI', 'https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png'),
    'Rising Pune Supergiant': ('RPS', 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/RPS.png?v=2'),
    'Gujarat Lions': ('GL', 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/GL.png?v=2'),
    'Kolkata Knight Riders': ('KKR', 'https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png'),
    'Chennai Super Kings': ('CSK', 'https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png'),
    'Rajasthan Royals': ('RR', 'https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png'),
    'Delhi Capitals': ('DC', 'https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png'),
    'Punjab Kings': ('PBKS', 'https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png'),
    'Lucknow Super Giants': ('LSG', 'https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png'),
    'Gujarat Titans': ('GT', 'https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png'),
    'Deccan Chargers': ('DEC', 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/DEC.png?v=2'),
    'Kochi Tuskers Kerala': ('KTK', 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/KTK.png?v=2'),
    'Pune Warriors': ('PWI', 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/teamlogos/PWI.png?v=2'),
}

def download_file(url, dest):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as r:
        if r.status == 200:
            data = r.read()
            if len(data) > 500:
                with open(dest, 'wb') as f:
                    f.write(data)
                return True
    return False

for team, (abbr, url) in TEAM_LOGOS.items():
    dest = os.path.join(ASSETS_TEAMS, f'{abbr}.png')
    ok = False
    try:
        ok = download_file(url, dest)
    except Exception as e:
        if abbr == 'RR':
            try:
                ok = download_file('https://1000logos.net/wp-content/uploads/2024/03/Rajasthan-Royals-Logo-768x432.png', dest)
            except Exception:
                pass
    print(f"Team {abbr}: {'OK' if ok else 'FAIL'}")

# 3. Download player portraits
p_df = pd.read_csv(os.path.join(BASE, 'data', 'raw', 'players-data-updated.csv'))
pbix_urls = {}
for _, row in p_df.iterrows():
    if pd.notna(row['player_image']) and ('s3.ap-south-1' in str(row['player_image']) or 'documents.iplt20' in str(row['player_image'])):
        pbix_urls[row['player_name']] = str(row['player_image'])

# Full names map for spotlight + star players
PLAYER_FULL_NAMES = {
    'AC Gilchrist': ['Adam Gilchrist'],
    'AD Russell': ['Andre Russell'],
    'AJ Tye': ['Andrew Tye'],
    'AM Rahane': ['Ajinkya Rahane'],
    'Abhishek Sharma': ['Abhishek Sharma'],
    'B Kumar': ['Bhuvneshwar Kumar'],
    'B Sai Sudharsan': ['Sai Sudharsan', 'B Sai Sudharsan'],
    'CH Gayle': ['Chris Gayle'],
    'DA Warner': ['David Warner'],
    'DJ Bravo': ['Dwayne Bravo'],
    'F du Plessis': ['Faf du Plessis', 'Faf Du Plessis'],
    'G Gambhir': ['Gautam Gambhir'],
    'GJ Maxwell': ['Glenn Maxwell'],
    'HV Patel': ['Harshal Patel'],
    'Imran Tahir': ['Imran Tahir'],
    'Ishan Kishan': ['Ishan Kishan'],
    'JC Buttler': ['Jos Buttler'],
    'K Rabada': ['Kagiso Rabada'],
    'KL Rahul': ['KL Rahul'],
    'KS Williamson': ['Kane Williamson'],
    'M Morkel': ['Morne Morkel'],
    'M Prasidh Krishna': ['Prasidh Krishna'],
    'MEK Hussey': ['Michael Hussey', 'Mike Hussey'],
    'ML Hayden': ['Matthew Hayden'],
    'MM Sharma': ['Mohit Sharma'],
    'Mohammed Shami': ['Mohammad Shami', 'Mohammed Shami'],
    'N Pooran': ['Nicholas Pooran'],
    'PP Ojha': ['Pragyan Ojha'],
    'RD Gaikwad': ['Ruturaj Gaikwad'],
    'RP Singh': ['RP Singh', 'Rudra Pratap Singh'],
    'RR Pant': ['Rishabh Pant'],
    'RV Uthappa': ['Robin Uthappa'],
    'S Dhawan': ['Shikhar Dhawan'],
    'SE Marsh': ['Shaun Marsh'],
    'SL Malinga': ['Lasith Malinga'],
    'SR Tendulkar': ['Sachin Tendulkar'],
    'ST Jayasuriya': ['Sanath Jayasuriya'],
    'Shubman Gill': ['Shubman Gill'],
    'Sohail Tanvir': ['Sohail Tanvir'],
    'TM Head': ['Travis Head'],
    'V Kohli': ['Virat Kohli'],
    'V Suryavanshi': ['Vaibhav Suryavanshi', 'Vaibhav Sooryavanshi'],
    'YS Chahal': ['Yuzvendra Chahal'],
    # Extra stars
    'MS Dhoni': ['MS Dhoni'],
    'RG Sharma': ['Rohit Sharma'],
    'JJ Bumrah': ['Jasprit Bumrah'],
    'SA Yadav': ['Suryakumar Yadav'],
    'Rashid Khan': ['Rashid Khan'],
    'RM Patidar': ['Rajat Patidar'],
    'SP Narine': ['Sunil Narine'],
    'YBK Jaiswal': ['Yashasvi Jaiswal'],
    'JC Archer': ['Jofra Archer'],
    'H Klaasen': ['Heinrich Klaasen'],
    'Noor Ahmad': ['Noor Ahmad'],
    'JR Hazlewood': ['Josh Hazlewood'],
}

found = {}
missing = []
for pname, candidates in PLAYER_FULL_NAMES.items():
    safe_name = pname.replace(' ', '_') + '.png'
    dest = os.path.join(ASSETS_PLAYERS, safe_name)
    urls_to_try = []
    if pname in pbix_urls:
        urls_to_try.append(pbix_urls[pname])
    for cand in candidates:
        enc = urllib.parse.quote(cand)
        urls_to_try.append(f'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/playerimages/{enc}.png')
    ok = False
    for u in urls_to_try:
        try:
            if download_file(u, dest):
                ok = True
                found[pname] = safe_name
                break
        except Exception:
            pass
    if not ok:
        missing.append(pname)

print(f"\nDownloaded player portraits: {len(found)}/{len(PLAYER_FULL_NAMES)}")
print("Missing portraits:", missing)

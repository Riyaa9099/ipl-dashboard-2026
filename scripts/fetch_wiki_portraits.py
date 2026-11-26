import os, json, urllib.request, urllib.parse

BASE = r'C:\Users\Lakshya sharan\.gemini\antigravity\scratch\ipl-dashboard-2026'
ASSETS_PLAYERS = os.path.join(BASE, 'public', 'assets', 'players')
os.makedirs(ASSETS_PLAYERS, exist_ok=True)

# Map Cricsheet player names -> Wikipedia article titles
WIKI_NAMES = {
    'AC Gilchrist': 'Adam_Gilchrist',
    'AD Russell': 'Andre_Russell',
    'AJ Tye': 'Andrew_Tye',
    'AM Rahane': 'Ajinkya_Rahane',
    'Abhishek Sharma': 'Abhishek_Sharma_(cricketer,_born_2000)',
    'B Kumar': 'Bhuvneshwar_Kumar',
    'B Sai Sudharsan': 'Sai_Sudharsan',
    'CH Gayle': 'Chris_Gayle',
    'DA Warner': 'David_Warner_(cricketer)',
    'DJ Bravo': 'Dwayne_Bravo',
    'F du Plessis': 'Faf_du_Plessis',
    'G Gambhir': 'Gautam_Gambhir',
    'GJ Maxwell': 'Glenn_Maxwell',
    'HV Patel': 'Harshal_Patel',
    'Imran Tahir': 'Imran_Tahir',
    'Ishan Kishan': 'Ishan_Kishan',
    'JC Buttler': 'Jos_Buttler',
    'K Rabada': 'Kagiso_Rabada',
    'KL Rahul': 'KL_Rahul',
    'KS Williamson': 'Kane_Williamson',
    'M Morkel': 'Morne_Morkel',
    'M Prasidh Krishna': 'Prasidh_Krishna',
    'MEK Hussey': 'Michael_Hussey',
    'ML Hayden': 'Matthew_Hayden',
    'MM Sharma': 'Mohit_Sharma',
    'Mohammed Shami': 'Mohammed_Shami',
    'N Pooran': 'Nicholas_Pooran',
    'PP Ojha': 'Pragyan_Ojha',
    'RD Gaikwad': 'Ruturaj_Gaikwad',
    'RP Singh': 'R._P._Singh',
    'RR Pant': 'Rishabh_Pant',
    'RV Uthappa': 'Robin_Uthappa',
    'S Dhawan': 'Shikhar_Dhawan',
    'SE Marsh': 'Shaun_Marsh',
    'SL Malinga': 'Lasith_Malinga',
    'SR Tendulkar': 'Sachin_Tendulkar',
    'ST Jayasuriya': 'Sanath_Jayasuriya',
    'Shubman Gill': 'Shubman_Gill',
    'Sohail Tanvir': 'Sohail_Tanvir',
    'TM Head': 'Travis_Head',
    'V Kohli': 'Virat_Kohli',
    'V Suryavanshi': 'Vaibhav_Suryavanshi',
    'YS Chahal': 'Yuzvendra_Chahal',
    'MS Dhoni': 'MS_Dhoni',
    'RG Sharma': 'Rohit_Sharma',
    'JJ Bumrah': 'Jasprit_Bumrah',
    'SA Yadav': 'Suryakumar_Yadav',
    'Rashid Khan': 'Rashid_Khan_(cricketer)',
    'RM Patidar': 'Rajat_Patidar',
    'SP Narine': 'Sunil_Narine',
    'YBK Jaiswal': 'Yashasvi_Jaiswal',
    'JC Archer': 'Jofra_Archer',
    'H Klaasen': 'Heinrich_Klaasen',
}

# Also load any iplt20.com URLs we already scraped (e.g. Jos Buttler, Jofra Archer)
iplt20_path = os.path.join(BASE, 'data', 'iplt20_player_urls.json')
iplt20_map = json.load(open(iplt20_path)) if os.path.exists(iplt20_path) else {}

def fetch_bytes(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'IPLDashboardProject/1.0 (contact@example.com)'})
    with urllib.request.urlopen(req, timeout=8) as r:
        return r.read()

saved = 0
missing = []
for pname, wiki_title in WIKI_NAMES.items():
    safe = pname.replace(' ', '_')
    dest_png = os.path.join(ASSETS_PLAYERS, f'{safe}.png')
    dest_jpg = os.path.join(ASSETS_PLAYERS, f'{safe}.jpg')
    if os.path.exists(dest_png) and os.path.getsize(dest_png) > 1000:
        saved += 1
        continue
    if os.path.exists(dest_jpg) and os.path.getsize(dest_jpg) > 1000:
        saved += 1
        continue

    # Try IPLT20 official transparent PNG first if exact full name match exists
    full_guess = wiki_title.split('_(')[0].replace('_', ' ')
    ok = False
    if full_guess in iplt20_map:
        try:
            data = fetch_bytes(iplt20_map[full_guess])
            if len(data) > 1000:
                open(dest_png, 'wb').write(data)
                ok = True
                saved += 1
                print(f'IPLT20: {pname}')
        except Exception:
            pass
    if ok:
        continue

    # Try Wikipedia REST summary thumbnail
    for title_try in [wiki_title, wiki_title.replace('Suryavanshi', 'Sooryavanshi')]:
        try:
            api_url = f'https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(title_try)}'
            meta = json.loads(fetch_bytes(api_url).decode('utf-8'))
            thumb = meta.get('thumbnail', {}).get('source') or meta.get('originalimage', {}).get('source')
            if thumb:
                img_data = fetch_bytes(thumb)
                ext = '.png' if '.png' in thumb.lower() else '.jpg'
                open(os.path.join(ASSETS_PLAYERS, f'{safe}{ext}'), 'wb').write(img_data)
                ok = True
                saved += 1
                print(f'WIKI: {pname} ({ext})')
                break
        except Exception:
            pass
    if not ok:
        missing.append(pname)
        print(f'MISS: {pname}')

print(f'\nTotal player portraits ready: {saved}/{len(WIKI_NAMES)}')
print('Missing:', missing)

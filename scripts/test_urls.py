import urllib.request, re, urllib.parse

for url in ['https://www.iplt20.com/teams/royal-challengers-bengaluru', 'https://www.iplt20.com/stats/2026']:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', 'ignore')
    unq = urllib.parse.unquote(html).replace('\\"', '"')
    idx = unq.find('Virat Kohli')
    print(url, 'Virat Kohli idx:', idx)
    if idx != -1:
        print(unq[max(0, idx-250):idx+350])
        print('---')

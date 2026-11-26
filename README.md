# 🏏 TATA IPL Analytics Dashboard (2008–2026)

An interactive, broadcast-grade cricket analytics dashboard covering **19 seasons of the Indian Premier League (2008–2026)** — 1,243 matches and 295,000+ ball-by-ball deliveries — upgraded from the original Power BI project (`2008–2025`) to include the complete **IPL 2026** season and an interactive React + Tailwind + Recharts web experience.

## ✨ Features

- **Single-Click Season Slicer (`2008`–`2026` + `All-Time`)**: Dynamically updates every KPI, player spotlight, points table, phase breakdown, leaderboard, venue chart, and match fixture list.
- **Season Overview**:
  - **Champion & Runner-Up Duel Banner** with team logos, grand finale scores, margin, venue, and Player of the Final.
  - **7 Secondary KPIs**: Total Sixes, Total Fours, Total Matches, Total Teams, Centuries (100s), Half-Centuries (50s), Total Venues — with season-over-season delta badges.
  - **4 Player Spotlight Cards**: Orange Cap, Purple Cap, Most Fours, and Most Sixes with player portraits and efficiency stats.
  - **Official IPL Points Table**: Played, Won, Lost, NR, Net Run Rate (NRR), Points, Playoff qualification (`Q`) & Champion (`C`) indicators, plus click-through Team Campaign Modal (`Esc` to close).
  - **Phase Scoring Breakdown**: Powerplay (1–6), Middle (7–15), and Death (16–20) run rates, wickets, and boundary %.
- **Leaderboards**: Top 20 Batters & Top 20 Bowlers with interactive charts, search, and Season Centuries wall.
- **2008–2026 Historical Trends**: 19-season boundary explosion, scoring tempo (RPO & sixes/match), Franchise Trophy Cabinet, and interactive Head-to-Head Rivalry Explorer.
- **Venues & Match Center**: Bat-first vs Chase win bias, stadium scoring profiles, and full match-by-match explorer.

## 🚀 Run Locally

```bash
npm install
npm run dev
```

## 🌐 Push to GitHub & Get Your Live Link (GitHub Pages)

This repository includes a pre-configured **GitHub Actions workflow** (`.github/workflows/deploy.yml`) and relative asset base (`base: './'`) so it deploys automatically to GitHub Pages when pushed to `main`:

1. Create a new empty repository on GitHub (e.g., `ipl-dashboard-2026`).
2. Push this project:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/ipl-dashboard-2026.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
4. Your live dashboard will be published at:
   `https://<YOUR_USERNAME>.github.io/ipl-dashboard-2026/`

*(Alternatively, import the GitHub repo directly on [Vercel](https://vercel.com) or [Netlify](https://app.netlify.com) with build command `npm run build` and output directory `dist`.)*

## 📊 Updated Power BI Datasets (`data/ipl_2026_dataset/`)

Clean 2008–2026 match & team CSVs are included in `data/ipl_2026_dataset/`. To regenerate the full `ball_by_ball_data_2026.csv` and `src/data/ipl_dashboard_data.json` from Cricsheet sources:

```bash
python scripts/build_dataset.py
```

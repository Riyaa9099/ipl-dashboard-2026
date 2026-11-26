# 🏏 TATA IPL Analytics Dashboard (2008–2026)

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Data_Viz-22B5BF?style=for-the-badge)

An interactive cricket analytics dashboard covering **19 seasons of the Indian Premier League (2008–2026)** across **1,243 matches** and **295,000+ ball-by-ball deliveries**. Built with a single-click Season Slicer that dynamically updates every KPI, player spotlight, points table, phase breakdown, and match record.

🔗 **Live Dashboard:** https://riyaa9099.github.io/ipl-dashboard-2026/

---

## 📊 Key Highlights (IPL 2026 Snapshot)

### 🏆 Championship Finale
| Result | Team | Score | Venue |
| :--- | :--- | :--- | :--- |
| **Champion** | Royal Challengers Bengaluru (RCB) | 161/5 (18.0) | Narendra Modi Stadium, Ahmedabad |
| **Runner-Up** | Gujarat Titans (GT) | 155/8 (20.0) | *RCB won by 5 wickets · POM: V Kohli* |

### 📈 Season KPIs (2026)
| Total Matches | Total Teams | Total Venues | Total Sixes | Total Fours | Centuries | Half-Centuries |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **74** | **10** | **13** | **1,426** | **2,333** | **15** | **154** |

### 🌟 Player Spotlights (2026)
- 🟠 **Orange Cap:** Vaibhav Suryavanshi — **776 runs** *(Rajasthan Royals)*
- 🟣 **Purple Cap:** Kagiso Rabada — **29 wickets** *(Gujarat Titans)*
- ⚡ **Most Fours:** B Sai Sudharsan — **75 fours** *(Gujarat Titans)*
- 🔥 **Most Sixes:** Vaibhav Suryavanshi — **72 sixes** *(Rajasthan Royals)*

---

## 🎯 Dashboard Views

- **Season Overview:** Champion & Runner-Up hero banner, 7 season KPIs with YoY deltas, 4 Player Spotlight cards, Official Points Table (with NRR & click-through team campaign modal), Playoff results, and Powerplay / Middle / Death scoring rates.
- **Leaderboards:** Top 20 Run Scorers & Top 20 Wicket Takers with interactive bar charts, player search, and a Season Centuries wall.
- **2008–2026 Trends:** 19-season boundary growth, Run Rate vs Sixes/Match evolution, Franchise Trophy Cabinet, and an interactive Head-to-Head Rivalry Explorer.
- **Venues & Matches:** Bat-first vs Chase win bias, stadium scoring profiles, and a searchable Match Center filtered by team and stage.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Data Pipeline:** Python, Pandas, `pbixray`, Cricsheet IPL ball-by-ball & match archives (2008–2026)

---

## 🚀 Run Locally

```bash
git clone https://github.com/Riyaa9099/ipl-dashboard-2026.git
cd ipl-dashboard-2026
npm install
npm run dev
```

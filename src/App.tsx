import React, { useState } from 'react';
import rawData from './data/ipl_dashboard_data.json';
import { IPLDashboardData } from './types/ipl';
import { HeaderBar, TabKey } from './components/HeaderBar';
import { OverviewTab } from './components/OverviewTab';
import { LeaderboardsTab } from './components/LeaderboardsTab';
import { TrendsTab } from './components/TrendsTab';
import { VenuesMatchesTab } from './components/VenuesMatchesTab';

const data = rawData as unknown as IPLDashboardData;

export function App() {
  const [selectedSeason, setSelectedSeason] = useState<string>('2026');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const bundle = data.seasons[selectedSeason] || data.seasons['2026'];
  const seasonIdx = data.seasonsOrder.indexOf(selectedSeason);
  const prevSeason = seasonIdx > 0 ? data.seasonsOrder[seasonIdx - 1] : null;
  const prevBundle = prevSeason ? data.seasons[prevSeason] : null;

  const accentColor =
    selectedSeason === 'ALL'
      ? '#F59E0B'
      : data.teamsMeta[bundle.champion]?.primary || '#3B82F6';

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-slate-100">
      <HeaderBar
        seasonsOrder={data.seasonsOrder}
        selectedSeason={selectedSeason}
        onSelectSeason={setSelectedSeason}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        accentColor={accentColor}
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <OverviewTab
            data={data}
            bundle={bundle}
            prevBundle={prevBundle}
            onGoToLeaderboards={() => setActiveTab('leaderboards')}
          />
        )}
        {activeTab === 'leaderboards' && (
          <LeaderboardsTab data={data} bundle={bundle} />
        )}
        {activeTab === 'trends' && (
          <TrendsTab
            data={data}
            onSelectSeason={(s) => {
              setSelectedSeason(s);
              setActiveTab('overview');
            }}
          />
        )}
        {activeTab === 'venues' && (
          <VenuesMatchesTab data={data} bundle={bundle} />
        )}
      </main>

      <footer className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        TATA IPL Analytics Dashboard (2008–2026) · Built with Cricsheet &amp; Official IPL Match Data (1,243 Matches · 19 Seasons)
      </footer>
    </div>
  );
}

export default App;

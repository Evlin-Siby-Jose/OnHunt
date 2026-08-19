import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { Header } from './components/common/Header';
import { LandingPage } from './pages/LandingPage';
import { RoleSelectPage } from './pages/RoleSelectPage';
import { OrganizerWorkspace } from './pages/OrganizerWorkspace';
import { PlayerGameArea } from './pages/PlayerGameArea';

type ViewMode = 'landing' | 'roleselect' | 'organizer' | 'player';

const MainAppContent: React.FC = () => {
  const { setUserMode } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('landing');

  const handleRoleSelection = (mode: 'organizer' | 'player') => {
    setUserMode(mode);
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-pixel">
      {/* HEADER */}
      <Header
        currentView={viewMode}
        onNavigateHome={() => setViewMode('landing')}
        onSwitchRole={() => setViewMode('roleselect')}
      />

      {/* ACTIVE VIEW ROUTER */}
      <div className="flex-1">
        {viewMode === 'landing' && (
          <LandingPage
            onSelectRole={(mode) => handleRoleSelection(mode)}
            onExploreHunts={() => setViewMode('roleselect')}
          />
        )}

        {viewMode === 'roleselect' && (
          <RoleSelectPage
            onConfirmRole={(mode) => handleRoleSelection(mode)}
            onBackToLanding={() => setViewMode('landing')}
          />
        )}

        {viewMode === 'organizer' && (
          <OrganizerWorkspace
            onBackToRoleSelect={() => setViewMode('roleselect')}
          />
        )}

        {viewMode === 'player' && (
          <PlayerGameArea
            onBackToRoleSelect={() => setViewMode('roleselect')}
          />
        )}
      </div>

      {/* FOOTER */}
      <footer className="border-t-4 border-slate-900 bg-slate-900/80 py-4 px-6 text-center text-xs font-arcade text-slate-400">
        ONHUNT • THE 8-BIT "CANVA FOR TREASURE HUNTS" • GUMBALL POP EDITION
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <MainAppContent />
      </GameProvider>
    </AuthProvider>
  );
}

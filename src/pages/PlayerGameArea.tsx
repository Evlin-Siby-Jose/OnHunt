import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { PlayArena } from '../components/player/PlayArena';
import { InventoryModal } from '../components/player/InventoryModal';
import { PostGameResultsModal } from '../components/player/PostGameResultsModal';
import { QRScannerModal } from '../components/player/QRScannerModal';
import { Key, Gamepad2, Trophy, ArrowLeft, Camera } from 'lucide-react';

interface PlayerGameAreaProps {
  onBackToRoleSelect: () => void;
}

export const PlayerGameArea: React.FC<PlayerGameAreaProps> = ({ onBackToRoleSelect }) => {
  const { user } = useAuth();
  const { teams, activeTeamId, joinTeamByCode, setActiveHuntId, setActiveTeamId } = useGame();

  const [currentTab, setCurrentTab] = useState<'home' | 'join' | 'game' | 'achievements'>('home');
  const [huntCodeInput, setHuntCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [showInventory, setShowInventory] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!huntCodeInput.trim()) {
      setJoinError('ENTER A VALID HUNT CODE!');
      return;
    }
    setJoinError('');

    const team = joinTeamByCode(huntCodeInput.trim(), user.id, user.name, user.avatar);
    if (!team) {
      setJoinError('INVALID HUNT CODE! TRY "ONHUNT-7X42" OR "GUMBALL"');
    } else {
      setActiveHuntId(team.huntId);
      setActiveTeamId(team.id);
      setCurrentTab('game');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 px-4">
      {/* TOP PLAYER NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border-4 border-cyan-400">
        <div className="flex items-center gap-3">
          <button onClick={onBackToRoleSelect} className="btn-darwin-orange text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Role Select
          </button>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-cyan-400 animate-bounce" />
            <span className="text-xs font-arcade text-white uppercase">PLAYER ADVENTURE GAME</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-arcade ${
              currentTab === 'home' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentTab('join')}
            className={`px-3 py-1.5 rounded-lg text-xs font-arcade ${
              currentTab === 'join' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Join Hunt
          </button>
          <button
            onClick={() => setCurrentTab('game')}
            className={`px-3 py-1.5 rounded-lg text-xs font-arcade ${
              currentTab === 'game' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Play Game
          </button>
          <button
            onClick={() => setShowInventory(true)}
            className="btn-penny-yellow text-[10px] py-1.5 px-2.5 rounded-lg flex items-center gap-1"
          >
            🎒 Backpack ({activeTeam?.inventory?.length || 0})
          </button>
        </div>
      </div>

      {/* 1. PLAYER HOME VIEW */}
      {currentTab === 'home' && (
        <div className="space-y-8 text-center py-6">
          <div className="gumball-card p-8 rounded-3xl bg-slate-900 border-4 border-cyan-400 space-y-4">
            <span className="text-xs font-arcade text-cyan-300 uppercase tracking-widest block">
              ADVENTURER HUB
            </span>
            <h2 className="text-3xl font-arcade text-white gumball-text-cyan">
              Ready for your next adventure?
            </h2>
            <p className="text-xs font-pixel text-slate-300 max-w-lg mx-auto">
              Join live quest matches, decode cipher messages with your squad, collect ancient inventory relics, and reach the top of the tournament ranks!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
              <button
                onClick={() => setCurrentTab('join')}
                className="w-full sm:w-auto flex-1 btn-gumball-cyan py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" /> Join Hunt
              </button>

              <button
                onClick={() => setCurrentTab('game')}
                className="w-full sm:w-auto flex-1 btn-darwin-orange py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-4 h-4" /> My Hunts
              </button>

              <button
                onClick={() => setShowResults(true)}
                className="w-full sm:w-auto flex-1 btn-penny-yellow py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" /> Achievements
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. JOIN HUNT VIEW */}
      {currentTab === 'join' && (
        <div className="gumball-card p-8 rounded-3xl bg-slate-900 border-4 border-cyan-400 max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2 border-b-2 border-slate-800 pb-4">
            <span className="text-[10px] font-arcade text-cyan-300 uppercase tracking-widest block">
              ENTER GAME ROOM
            </span>
            <h3 className="text-2xl font-arcade text-white gumball-text-cyan">ENTER HUNT CODE</h3>
            <p className="text-xs font-pixel text-slate-300">
              Type your 6-digit room code or scan the Hunt Join QR code.
            </p>
          </div>

          <form onSubmit={handleJoinByCode} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="ENTER CODE (e.g. ONHUNT-7X42 or GUMBALL)"
                value={huntCodeInput}
                onChange={(e) => setHuntCodeInput(e.target.value)}
                className="w-full gumball-input rounded-2xl px-4 py-4 text-center text-sm font-arcade tracking-widest text-cyan-300 uppercase"
              />
            </div>

            {joinError && (
              <p className="text-xs font-arcade text-rose-400 text-center">{joinError}</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 btn-gumball-cyan py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs"
              >
                <Key className="w-4 h-4" /> Join Hunt
              </button>

              <button
                type="button"
                onClick={() => setShowQRScanner(true)}
                className="btn-penny-yellow py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs"
              >
                <Camera className="w-4 h-4" /> 📷 Scan QR to Join
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. PLAY GAME ARENA */}
      {currentTab === 'game' && (
        <PlayArena
          onComplete={() => setShowResults(true)}
          onOpenInventory={() => setShowInventory(true)}
        />
      )}

      {/* MODALS */}
      <InventoryModal
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        items={activeTeam?.inventory || []}
      />

      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        mode="join"
        targetQRText="ONHUNT-JOIN-ONHUNT-7X42"
        onScanSuccess={(data) => {
          const codeVal = typeof data === 'string' ? data : data.joinCode || '';
          setHuntCodeInput(codeVal);
          setShowQRScanner(false);
        }}
      />

      <PostGameResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        teamName={activeTeam?.name || 'Squad'}
        score={activeTeam?.score || 720}
        timeElapsedSeconds={1240}
        rank={1}
      />
    </div>
  );
};

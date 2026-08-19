import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Gamepad2, Home, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigateHome: () => void;
  onSwitchRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome, onSwitchRole }) => {
  const { user } = useAuth();

  return (
    <header className="bg-slate-900 border-b-4 border-slate-900 px-4 py-3 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-400 border-2 border-black flex items-center justify-center text-slate-950 font-arcade font-bold text-sm shadow-[3px_3px_0px_#000]">
            <Gamepad2 className="w-5 h-5 text-slate-950" />
          </div>

          <div className="text-left">
            <h1 className="text-base md:text-lg font-arcade text-white tracking-tight gumball-text-cyan">
              ONHUNT
            </h1>
            <span className="text-[9px] font-pixel text-yellow-300 block -mt-1">
              Dual-Sided Quests
            </span>
          </div>
        </button>

        {/* ROLE SIMULATOR & ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onNavigateHome}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border-2 border-slate-700 text-xs font-arcade text-slate-300 hover:text-white"
          >
            <Home className="w-3.5 h-3.5" /> Home
          </button>

          {/* ACTIVE MODE PILL */}
          <button
            onClick={onSwitchRole}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border-2 border-purple-500 hover:border-cyan-400 transition-colors shadow-[2px_2px_0px_#000]"
          >
            <span className="text-[10px] font-arcade text-slate-400 uppercase">MODE:</span>
            <span className={`text-xs font-arcade uppercase font-bold ${user.activeMode === 'organizer' ? 'text-purple-300' : 'text-cyan-300'}`}>
              {user.activeMode === 'organizer' ? '✨ CREATOR' : '🎮 PLAYER'}
            </span>
            <RefreshCw className="w-3 h-3 text-slate-400" />
          </button>

          {/* USER XP BADGE */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border-2 border-slate-800 text-xs font-arcade">
            <span className="text-amber-400 font-bold">LVL {user.level}</span>
            <span className="text-cyan-400 font-bold">{user.xp} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
};

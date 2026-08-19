import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, Sparkles, Key, Plus, Radio, Play, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardPageProps {
  onEditHunt: (huntId: string) => void;
  onCreateNew: () => void;
  onOpenAiModal: () => void;
  onSelectHuntToPlay: (huntId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onEditHunt,
  onCreateNew,
  onOpenAiModal,
  onSelectHuntToPlay,
}) => {
  const { user } = useAuth();
  const { hunts, joinTeamByCode, setActiveHuntId } = useGame();
  const [quickCodeInput, setQuickCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCodeInput.trim()) {
      setJoinError('ENTER A 6-DIGIT CODE!');
      return;
    }
    setJoinError('');
    const team = joinTeamByCode(quickCodeInput.trim(), user.id, user.name, user.avatar);
    if (!team) {
      setJoinError('INVALID ROOM CODE! TRY "HUB982"');
    } else {
      setActiveHuntId(team.huntId);
      onSelectHuntToPlay(team.huntId);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="pixel-card p-6 md:p-8 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-4 border-purple-600 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 text-xs font-arcade uppercase tracking-wider rounded-md">
          <Gamepad2 className="w-4 h-4 animate-bounce" /> Pixel Arcade Mode
        </div>

        <h1 className="text-2xl md:text-4xl font-arcade text-white tracking-tight pixel-text-glow leading-relaxed">
          ONHUNT <span className="text-emerald-400">AI QUESTS</span>
        </h1>

        <p className="text-xs md:text-sm font-pixel text-slate-300 max-w-xl mx-auto">
          The 8-Bit "Canva for Treasure Hunts". Choose your path below: Create a new custom quest or enter a 6-digit room code to play!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="pixel-card p-6 rounded-2xl border-4 border-purple-500 bg-slate-900 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center text-purple-300">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-arcade text-purple-400 uppercase tracking-widest block">
              OPTION 1: ORGANIZER
            </span>
            <h3 className="text-xl font-arcade text-white">CREATE A QUEST</h3>
            <p className="text-xs font-pixel text-slate-300 leading-relaxed">
              Design a custom treasure hunt with QR code passes, cipher passwords, and MCQ puzzles, or generate a 5-checkpoint quest instantly using AI!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={onOpenAiModal}
              className="flex-1 pixel-btn-purple py-3 px-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-300" /> AI Generator
            </button>
            <button
              onClick={onCreateNew}
              className="flex-1 pixel-btn-yellow py-3 px-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Manual Build
            </button>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="pixel-card p-6 rounded-2xl border-4 border-emerald-500 bg-slate-900 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border-2 border-emerald-400 flex items-center justify-center text-emerald-300">
              <Key className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-arcade text-emerald-400 uppercase tracking-widest block">
              OPTION 2: PLAYER
            </span>
            <h3 className="text-xl font-arcade text-white">JOIN WITH CODE</h3>
            <p className="text-xs font-pixel text-slate-300 leading-relaxed">
              Have a 6-digit room code from an organizer? Type it below to join your squad and start deciphering checkpoint clues!
            </p>
          </div>

          <form onSubmit={handleQuickJoin} className="space-y-3 pt-2">
            <div className="relative">
              <input
                type="text"
                placeholder="ENTER CODE (e.g. HUB982)"
                value={quickCodeInput}
                onChange={(e) => setQuickCodeInput(e.target.value)}
                className="w-full pixel-input rounded-xl px-4 py-3 text-center text-sm font-arcade tracking-widest text-emerald-300 uppercase"
              />
            </div>

            {joinError && (
              <p className="text-[11px] font-arcade text-rose-400 text-center">{joinError}</p>
            )}

            <button
              type="submit"
              className="w-full pixel-btn-green py-3 px-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> START PLAYING NOW
            </button>
          </form>
        </motion.div>
      </div>

      <div className="pixel-card p-6 rounded-2xl border-4 border-slate-700 bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-ping" />
            <h4 className="text-sm font-arcade text-white">ACTIVE RETRO QUESTS ({hunts.length})</h4>
          </div>
          <span className="text-xs font-pixel text-slate-400">Click any hunt to preview or edit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hunts.map((hunt) => (
            <div
              key={hunt.id}
              className="p-4 rounded-xl bg-slate-950 border-2 border-purple-900 hover:border-emerald-400 flex items-center justify-between gap-3 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-arcade bg-purple-900 text-purple-200 uppercase">
                    {hunt.theme}
                  </span>
                  <span className="text-[10px] font-pixel text-amber-400">
                    {hunt.checkpoints.length} Nodes
                  </span>
                </div>
                <h5 className="text-sm font-bold text-white font-pixel line-clamp-1">{hunt.title}</h5>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setActiveHuntId(hunt.id);
                    onSelectHuntToPlay(hunt.id);
                  }}
                  className="p-2 rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-arcade hover:bg-emerald-800 transition-colors"
                  title="Play Hunt"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>

                {user.role === 'organizer' && (
                  <button
                    onClick={() => onEditHunt(hunt.id)}
                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-arcade hover:bg-slate-700 transition-colors"
                    title="Edit Hunt"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

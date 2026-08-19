import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { Plus, Sparkles, Layers, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrganizerDashboardProps {
  onStartCreate: () => void;
  onOpenAiModal: () => void;
  onSelectTemplate: () => void;
  onStartLiveGame: () => void;
  onEditHunt: (huntId: string) => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  onStartCreate,
  onOpenAiModal,
  onSelectTemplate,
  onStartLiveGame,
  onEditHunt,
}) => {
  const { user } = useAuth();
  const { hunts } = useGame();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* WELCOME BANNER */}
      <div className="gumball-card p-6 md:p-8 rounded-3xl bg-slate-900 border-4 border-purple-500 space-y-2">
        <div className="flex items-center gap-2 text-xs font-arcade text-purple-300">
          <span>CREATOR STUDIO</span> • <span>CANVA FOR TREASURE HUNTS</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-arcade text-white gumball-text-cyan">
          Good morning, {user.name.split(' ')[0]} 👋
        </h2>
        <p className="text-xs font-pixel text-slate-300">
          Build interactive quests, launch live games, or generate complete adventures with AI.
        </p>
      </div>

      {/* QUICK ACTIONS LARGE CARDS */}
      <div className="space-y-3">
        <h3 className="text-sm font-arcade text-white uppercase tracking-wider">Quick Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* CARD 1: + CREATE HUNT */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={onStartCreate}
            className="gumball-card p-5 rounded-2xl border-4 border-emerald-500 bg-slate-900 text-left space-y-3 flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border-2 border-emerald-400 flex items-center justify-center text-emerald-300">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-arcade text-white">+ Create Hunt</h4>
              <p className="text-[11px] font-pixel text-slate-300 mt-1">Manual visual builder</p>
            </div>
          </motion.button>

          {/* CARD 2: ✨ GENERATE WITH AI */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={onOpenAiModal}
            className="gumball-card p-5 rounded-2xl border-4 border-purple-500 bg-slate-900 text-left space-y-3 flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center text-purple-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-arcade text-white">✨ Generate with AI</h4>
              <p className="text-[11px] font-pixel text-slate-300 mt-1">Conversational AI creator</p>
            </div>
          </motion.button>

          {/* CARD 3: 📋 USE TEMPLATE */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={onSelectTemplate}
            className="gumball-card p-5 rounded-2xl border-4 border-cyan-400 bg-slate-900 text-left space-y-3 flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border-2 border-cyan-400 flex items-center justify-center text-cyan-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-arcade text-white">📋 Use Template</h4>
              <p className="text-[11px] font-pixel text-slate-300 mt-1">Ready-made quest presets</p>
            </div>
          </motion.button>

          {/* CARD 4: 🎮 START LIVE GAME */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={onStartLiveGame}
            className="gumball-card p-5 rounded-2xl border-4 border-amber-400 bg-slate-900 text-left space-y-3 flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border-2 border-amber-400 flex items-center justify-center text-amber-300">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-arcade text-white">🎮 Start Live Game</h4>
              <p className="text-[11px] font-pixel text-slate-300 mt-1">Launch active tournament</p>
            </div>
          </motion.button>

        </div>
      </div>

      {/* RECENT HUNTS LIST */}
      <div className="gumball-card p-6 rounded-2xl border-4 border-slate-700 bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
          <h4 className="text-xs font-arcade text-white uppercase">RECENT CREATOR HUNTS</h4>
          <span className="text-[11px] font-pixel text-slate-400">Total: {hunts.length} Hunts</span>
        </div>

        <div className="space-y-3">
          {hunts.slice(0, 3).map((hunt) => (
            <div
              key={hunt.id}
              className="p-4 rounded-xl bg-slate-950 border-2 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={hunt.coverImage}
                  alt={hunt.title}
                  className="w-12 h-12 rounded-lg object-cover border-2 border-purple-500"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-arcade uppercase bg-purple-900 text-purple-200">
                      {hunt.status}
                    </span>
                    <span className="text-[10px] font-pixel text-emerald-400 font-bold">
                      CODE: {hunt.joinCode}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold font-pixel text-white">{hunt.title}</h5>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => onEditHunt(hunt.id)}
                  className="btn-gumball-cyan text-[10px] py-1.5 px-3 rounded-lg"
                >
                  Edit Hunt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

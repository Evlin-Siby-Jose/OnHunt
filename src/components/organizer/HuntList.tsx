import React, { useState } from 'react';
import type { Hunt } from '../../types/hunt';
import { useGame } from '../../context/GameContext';
import { Plus, Edit3, Trash2, Play, Pause, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HuntListProps {
  onEditHunt: (huntId: string) => void;
  onCreateNew: () => void;
  onOpenAiModal: () => void;
  onSelectHuntToPlay: (huntId: string) => void;
}

export const HuntList: React.FC<HuntListProps> = ({
  onEditHunt,
  onCreateNew,
  onOpenAiModal,
  onSelectHuntToPlay,
}) => {
  const { hunts, deleteHunt, setHuntStatus, setActiveHuntId } = useGame() as any;
  const [filter, setFilter] = useState<string>('all');

  const filteredHunts = hunts.filter((h: Hunt) => {
    if (filter === 'all') return true;
    return h.status === filter;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-arcade text-white">ORGANIZER HUB</h2>
          <p className="text-xs font-pixel text-slate-300">Create, customize, and manage real-time treasure hunt sessions.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiModal}
            className="pixel-btn-purple py-2 px-3 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Quest Gen
          </button>
          <button
            onClick={onCreateNew}
            className="pixel-btn-green py-2 px-3 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> New Quest
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {['all', 'draft', 'scheduled', 'live', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-arcade capitalize transition-colors whitespace-nowrap ${
              filter === status
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Hunts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHunts.map((hunt: Hunt) => (
          <motion.div
            key={hunt.id}
            layout
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-arcade bg-purple-950 text-purple-300 border border-purple-800 uppercase">
                  {hunt.theme}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-arcade uppercase ${
                    hunt.status === 'live'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : hunt.status === 'draft'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {hunt.status}
                </span>
              </div>

              <h3 className="text-base font-bold font-arcade text-white">{hunt.title}</h3>
              <p className="text-xs font-pixel text-slate-300 line-clamp-2">{hunt.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-pixel text-slate-400">
              <div className="flex items-center gap-3">
                <span>{hunt.checkpoints.length} Checkpoints</span>
                <span>{hunt.timeLimitMinutes} mins</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setActiveHuntId(hunt.id);
                    onSelectHuntToPlay(hunt.id);
                  }}
                  className="p-2 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 transition-colors"
                  title="Play Quest"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onEditHunt(hunt.id)}
                  className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-colors"
                  title="Edit Quest"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {hunt.status === 'live' ? (
                  <button
                    onClick={() => setHuntStatus(hunt.id, 'draft')}
                    className="p-2 rounded-lg bg-amber-950 border border-amber-800 text-amber-300 hover:bg-amber-900 transition-colors"
                    title="Pause Quest"
                  >
                    <Pause className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setHuntStatus(hunt.id, 'live')}
                    className="p-2 rounded-lg bg-purple-950 border border-purple-800 text-purple-300 hover:bg-purple-900 transition-colors"
                    title="Launch Live Session"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => deleteHunt(hunt.id)}
                  className="p-2 rounded-lg bg-rose-950 border border-rose-900 text-rose-300 hover:bg-rose-900 transition-colors"
                  title="Delete Quest"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

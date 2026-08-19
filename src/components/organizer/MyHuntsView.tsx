import React, { useState } from 'react';
import type { Hunt } from '../../types/hunt';
import { useGame } from '../../context/GameContext';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Edit3, Eye, Copy, Trash2, Radio, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface MyHuntsViewProps {
  onEditHunt: (huntId: string) => void;
  onPreviewHunt: (huntId: string) => void;
  onCreateNew: () => void;
  onOpenAiModal: () => void;
}

export const MyHuntsView: React.FC<MyHuntsViewProps> = ({
  onEditHunt,
  onPreviewHunt,
  onCreateNew,
  onOpenAiModal,
}) => {
  const { hunts, duplicateHunt, deleteHunt } = useGame();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deletingHunt, setDeletingHunt] = useState<Hunt | null>(null);

  const filteredHunts = hunts.filter((h) => filterStatus === 'all' || h.status === filterStatus);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-arcade text-white gumball-text-cyan">MY HUNTS WORKSPACE</h2>
          <p className="text-xs font-pixel text-slate-300">Manage drafts, scheduled quests, live games, and completed events.</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onOpenAiModal} className="btn-anais-pink text-[10px] py-2 px-3 rounded-xl">
            <Sparkles className="w-3.5 h-3.5" /> AI Create
          </button>
          <button onClick={onCreateNew} className="btn-darwin-orange text-[10px] py-2 px-3 rounded-xl">
            <Plus className="w-3.5 h-3.5" /> New Hunt
          </button>
        </div>
      </div>

      {/* STATUS TABS */}
      <div className="flex bg-slate-900 p-1.5 rounded-xl border-2 border-purple-900 overflow-x-auto">
        {['all', 'draft', 'scheduled', 'live', 'completed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-arcade capitalize transition-all whitespace-nowrap ${
              filterStatus === st
                ? 'bg-purple-700 text-white border border-purple-400 shadow-[2px_2px_0px_#000]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* HUNTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHunts.map((hunt) => (
          <motion.div
            key={hunt.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="gumball-card rounded-2xl overflow-hidden flex flex-col justify-between"
          >
            {/* Cover & Badges */}
            <div className="relative h-44 overflow-hidden border-b-4 border-slate-900">
              <img src={hunt.coverImage} alt={hunt.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              {/* Status Pill */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-arcade uppercase ${
                    hunt.status === 'live'
                      ? 'bg-emerald-500 text-slate-950 font-bold border border-emerald-300'
                      : hunt.status === 'scheduled'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : hunt.status === 'draft'
                      ? 'bg-purple-900 text-purple-200'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {hunt.status === 'live' && <Radio className="w-3 h-3 animate-ping inline mr-1" />}
                  {hunt.status}
                </span>

                <span className="px-2 py-0.5 rounded text-[10px] font-arcade bg-slate-950/80 text-cyan-300 border border-cyan-500">
                  CODE: {hunt.joinCode}
                </span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-base font-arcade text-white line-clamp-1">{hunt.title}</h3>
                <p className="text-xs font-pixel text-slate-300 line-clamp-1">{hunt.description}</p>
              </div>
            </div>

            {/* Card Content & Details */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-2 py-2 border-y-2 border-slate-800 text-center text-xs font-pixel">
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase font-arcade">Checkpoints</span>
                  <span className="font-bold text-cyan-300">{hunt.checkpoints.length} Nodes</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase font-arcade">Duration</span>
                  <span className="font-bold text-amber-300">{hunt.timeLimitMinutes}m</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase font-arcade">Edited</span>
                  <span className="font-bold text-slate-300">{hunt.lastEdited || 'Today'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditHunt(hunt.id)}
                    className="btn-gumball-cyan text-[10px] py-1.5 px-3 rounded-lg"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>

                  <button
                    onClick={() => onPreviewHunt(hunt.id)}
                    className="btn-penny-yellow text-[10px] py-1.5 px-3 rounded-lg"
                  >
                    <Eye className="w-3 h-3" /> 👁 Preview
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateHunt(hunt.id)}
                    title="Duplicate Hunt"
                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingHunt(hunt)}
                    title="Delete Hunt"
                    className="p-2 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal
        isOpen={!!deletingHunt}
        onClose={() => setDeletingHunt(null)}
        hunt={deletingHunt}
        onConfirmDelete={(id) => deleteHunt(id)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import type { Hunt, HuntTheme, HuntDifficulty } from '../../types/hunt';
import { useGame } from '../../context/GameContext';
import { CheckpointBuilder } from './CheckpointBuilder';
import { PrintableQRSheet } from './PrintableQRSheet';
import { ArrowLeft, Save, Printer } from 'lucide-react';
import { AIService } from '../../services/aiService';

interface HuntEditorProps {
  huntId: string | null;
  onBack: () => void;
}

export const HuntEditor: React.FC<HuntEditorProps> = ({ huntId, onBack }) => {
  const { hunts, createHunt, updateHunt } = useGame() as any;

  const existingHunt = hunts.find((h: Hunt) => h.id === huntId);

  const [title, setTitle] = useState(existingHunt?.title || 'New AI Treasure Quest');
  const [description, setDescription] = useState(existingHunt?.description || 'Build an exciting adventure puzzle for your players.');
  const [coverImage, setCoverImage] = useState(existingHunt?.coverImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80');
  const [theme, setTheme] = useState<HuntTheme>(existingHunt?.theme || 'gumball');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(existingHunt?.timeLimitMinutes || 45);
  const [maxTeamSize, setMaxTeamSize] = useState(existingHunt?.maxTeamSize || 4);
  const [difficulty, setDifficulty] = useState<HuntDifficulty>(existingHunt?.difficulty || 'medium');
  const [visibility] = useState<'public' | 'private'>(existingHunt?.visibility || 'public');
  const [checkpoints, setCheckpoints] = useState(existingHunt?.checkpoints || []);

  const [isQrSheetOpen, setIsQrSheetOpen] = useState(false);

  const handleSave = () => {
    const timestamp = Date.now();
    const updated: Hunt = {
      id: existingHunt?.id || `hunt_${timestamp}`,
      joinCode: existingHunt?.joinCode || AIService.generateRandomJoinCode(),
      organizerId: existingHunt?.organizerId || 'usr_organizer_01',
      organizerName: existingHunt?.organizerName || 'Gumball Watterson',
      title,
      description,
      coverImage,
      theme,
      timeLimitMinutes,
      maxTeamSize,
      difficulty,
      visibility,
      status: existingHunt?.status || 'draft',
      playCount: existingHunt?.playCount || 0,
      rating: existingHunt?.rating || 5.0,
      createdAt: existingHunt?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastEdited: 'Just now',
      checkpoints,
      publishChecklist: {
        detailsComplete: true,
        checkpointsComplete: checkpoints.length > 0,
        answersConfigured: true,
        teamsConfigured: true,
        timerConfigured: true,
      }
    };

    if (existingHunt) {
      updateHunt(updated);
    } else {
      createHunt(updated);
    }

    onBack();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border-2 border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-arcade text-white">
              {existingHunt ? `EDIT: ${existingHunt.title}` : 'CREATE NEW QUEST'}
            </h2>
            <p className="text-xs font-pixel text-slate-400">Design checkpoints, ciphers, and QR tokens</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsQrSheetOpen(true)}
            className="btn-penny-yellow text-xs py-2 px-3 rounded-xl flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> QR Sheet Pass
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-gumball-cyan text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Quest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 gumball-card p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-arcade text-purple-300 uppercase border-b border-purple-900 pb-2">
            Basic Settings
          </h3>

          <div>
            <label className="block text-[10px] font-arcade text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full gumball-input rounded-xl px-3 py-2 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-arcade text-slate-400 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full gumball-input rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-arcade text-slate-400 uppercase mb-1">Cover Image URL</label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full gumball-input rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-arcade text-slate-400 uppercase mb-1">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as HuntTheme)}
                className="w-full gumball-input rounded-xl px-2 py-1.5 text-xs bg-slate-950 capitalize"
              >
                <option value="gumball">Gumball</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="fantasy">Fantasy</option>
                <option value="mystery">Mystery</option>
                <option value="pirate">Pirate</option>
                <option value="space">Space</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-arcade text-slate-400 uppercase mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as HuntDifficulty)}
                className="w-full gumball-input rounded-xl px-2 py-1.5 text-xs bg-slate-950 capitalize"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-arcade text-slate-400 uppercase mb-1">Time (Mins)</label>
              <input
                type="number"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="w-full gumball-input rounded-xl px-2 py-1.5 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-arcade text-slate-400 uppercase mb-1">Squad Max</label>
              <input
                type="number"
                value={maxTeamSize}
                onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                className="w-full gumball-input rounded-xl px-2 py-1.5 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="gumball-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900 pb-2">
              <h3 className="text-xs font-arcade text-emerald-400 uppercase">
                Checkpoint Node Manager ({checkpoints.length})
              </h3>
              <span className="text-[10px] font-pixel text-slate-400">Drag/reorder quest nodes</span>
            </div>

            <CheckpointBuilder
              checkpoints={checkpoints}
              onChange={(updatedCps) => setCheckpoints(updatedCps)}
            />
          </div>
        </div>
      </div>

      <PrintableQRSheet
        isOpen={isQrSheetOpen}
        onClose={() => setIsQrSheetOpen(false)}
        checkpoints={checkpoints}
        huntTitle={title}
      />
    </div>
  );
};

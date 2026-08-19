import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { AIService } from '../../services/aiService';
import type { HuntTheme, HuntDifficulty } from '../../types/hunt';
import { Sparkles, Wand2, Loader2 } from 'lucide-react';

interface AIHuntGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHuntGenerated: (huntId: string) => void;
}

export const AIHuntGeneratorModal: React.FC<AIHuntGeneratorModalProps> = ({
  isOpen,
  onClose,
  onHuntGenerated,
}) => {
  const { user } = useAuth();
  const { createHunt } = useGame();

  const [topic, setTopic] = useState('');
  const [theme, setTheme] = useState<HuntTheme>('cyberpunk');
  const [difficulty, setDifficulty] = useState<HuntDifficulty>('medium');
  const [checkpointCount, setCheckpointCount] = useState(3);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(45);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const generatedHunt = await AIService.generateHunt(
        {
          topic: topic.trim(),
          theme,
          difficulty,
          checkpointCount,
          timeLimitMinutes,
        },
        user.id,
        user.name
      );

      createHunt(generatedHunt);
      setIsGenerating(false);
      onClose();
      onHuntGenerated(generatedHunt.id);
    } catch (err) {
      console.error('Failed to generate AI hunt:', err);
      setIsGenerating(false);
    }
  };

  const sampleTopics = [
    'AI & Robotics Tech Conference',
    'College Festival Mystery Hunt',
    'Museum Artifact Heist',
    'Corporate Team Building Quest',
    'Historical Landmark Cipher',
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Treasure Hunt Generator (M2 Ready)">
      <form onSubmit={handleGenerate} className="space-y-5">
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-3">
          <Wand2 className="w-5 h-5 text-purple-400 mt-0.5 animate-pulse" />
          <p className="text-xs text-purple-200 leading-relaxed">
            Enter any event topic or story premise. The AI story engine will generate themed checkpoints, immersive narrative lore, password ciphers, optical QR pass tokens, and MCQ challenges automatically.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Quest Topic or Event Premise
          </label>
          <input
            type="text"
            placeholder="e.g. AI & Robotics Conference / Museum Heist..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full glass-input rounded-xl px-4 py-2.5 text-xs font-semibold"
            required
          />

          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[10px] text-slate-400">Presets:</span>
            {sampleTopics.map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => setTopic(tp)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                {tp}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Visual & Story Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as HuntTheme)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs bg-slate-900 capitalize"
            >
              <option value="cyberpunk">Cyberpunk Neon</option>
              <option value="mystery">Noir Mystery</option>
              <option value="pirate">Pirate Treasure</option>
              <option value="fantasy">Ancient Fantasy</option>
              <option value="space">Sci-Fi Space</option>
              <option value="modern">Modern Tech</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as HuntDifficulty)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs bg-slate-900 capitalize"
            >
              <option value="easy">Easy (Casual)</option>
              <option value="medium">Medium (Standard)</option>
              <option value="hard">Hard (Challenging)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Checkpoint Nodes</label>
            <input
              type="number"
              min={2}
              max={10}
              value={checkpointCount}
              onChange={(e) => setCheckpointCount(parseInt(e.target.value) || 3)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Time Limit (Mins)</label>
            <input
              type="number"
              min={10}
              max={180}
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value) || 45)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-bold"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating || !topic.trim()}
          className="w-full btn-primary py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 shadow-purple-500/25"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing AI Hunt & Story Clues...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate AI Treasure Hunt
            </>
          )}
        </button>
      </form>
    </Modal>
  );
};

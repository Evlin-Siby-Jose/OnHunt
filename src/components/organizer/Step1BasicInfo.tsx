import React, { useState } from 'react';
import type { HuntTheme, HuntDifficulty } from '../../types/hunt';
import { ArrowRight } from 'lucide-react';

interface Step1BasicInfoProps {
  initialData?: any;
  onNext: (data: {
    title: string;
    description: string;
    coverImage: string;
    theme: HuntTheme;
    difficulty: HuntDifficulty;
    timeLimitMinutes: number;
    targetAudience: 'Kids' | 'Students' | 'Adults' | 'Corporate';
  }) => void;
}

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({ initialData, onNext }) => {
  const [title, setTitle] = useState(initialData?.title || 'The Mystery of Elmore High');
  const [description, setDescription] = useState(initialData?.description || 'Decipher hidden clues, solve cipher puzzles, and locate the lost artifact before time runs out!');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80');
  const [theme, setTheme] = useState<HuntTheme>(initialData?.theme || 'gumball');
  const [difficulty, setDifficulty] = useState<HuntDifficulty>(initialData?.difficulty || 'medium');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(initialData?.timeLimitMinutes || 45);
  const [targetAudience, setTargetAudience] = useState<'Kids' | 'Students' | 'Adults' | 'Corporate'>(initialData?.targetAudience || 'Students');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onNext({
      title: title.trim(),
      description: description.trim(),
      coverImage: coverImage.trim(),
      theme,
      difficulty,
      timeLimitMinutes,
      targetAudience,
    });
  };

  const sampleCovers = [
    { label: 'Gumball', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80' },
    { label: 'Pirate', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80' },
    { label: 'Campus', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80' },
    { label: 'Mystery', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80' },
  ];

  return (
    <form onSubmit={handleSubmit} className="gumball-card p-6 md:p-8 rounded-3xl bg-slate-900 border-4 border-purple-500 space-y-6 max-w-2xl mx-auto">
      <div className="border-b-2 border-slate-800 pb-4">
        <span className="text-[10px] font-arcade text-purple-300 uppercase tracking-widest block mb-1">
          STEP 1 OF 2 — BASIC INFO
        </span>
        <h3 className="text-xl font-arcade text-white">QUEST SPECIFICATIONS</h3>
        <p className="text-xs font-pixel text-slate-300 mt-1">Configure general quest details and target audience.</p>
      </div>

      {/* Hunt Name */}
      <div>
        <label className="block text-xs font-arcade text-purple-300 uppercase mb-1">HUNT NAME</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full gumball-input rounded-xl px-4 py-3 text-sm font-bold"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-arcade text-purple-300 uppercase mb-1">DESCRIPTION</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full gumball-input rounded-xl px-4 py-3 text-xs"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-xs font-arcade text-purple-300 uppercase mb-1">COVER IMAGE URL</label>
        <input
          type="text"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full gumball-input rounded-xl px-4 py-2.5 text-xs mb-2"
        />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-pixel text-slate-400">Presets:</span>
          {sampleCovers.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => setCoverImage(c.url)}
              className="text-[10px] font-pixel px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme & Difficulty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-arcade text-purple-300 uppercase mb-1">VISUAL THEME</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as HuntTheme)}
            className="w-full gumball-input rounded-xl px-3 py-2.5 text-xs bg-slate-950 capitalize"
          >
            <option value="gumball">Amazing World of Gumball</option>
            <option value="pirate">Pirate Treasure</option>
            <option value="mystery">Noir Mystery</option>
            <option value="fantasy">Ancient Fantasy</option>
            <option value="cyberpunk">Cyberpunk Neon</option>
            <option value="space">Sci-Fi Space</option>
            <option value="detective">Detective Quest</option>
            <option value="modern">Modern SaaS</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-arcade text-purple-300 uppercase mb-1">DIFFICULTY</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as HuntDifficulty)}
            className="w-full gumball-input rounded-xl px-3 py-2.5 text-xs bg-slate-950 capitalize"
          >
            <option value="easy">Easy (Casual)</option>
            <option value="medium">Medium (Standard)</option>
            <option value="hard">Hard (Challenging)</option>
          </select>
        </div>
      </div>

      {/* Time Limit & Target Audience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-arcade text-purple-300 uppercase mb-1">ESTIMATED DURATION (MINS)</label>
          <input
            type="number"
            min={10}
            max={180}
            value={timeLimitMinutes}
            onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value) || 45)}
            className="w-full gumball-input rounded-xl px-3 py-2.5 text-xs font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-arcade text-purple-300 uppercase mb-1">TARGET AUDIENCE</label>
          <select
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value as any)}
            className="w-full gumball-input rounded-xl px-3 py-2.5 text-xs bg-slate-950"
          >
            <option value="Kids">Kids & Families</option>
            <option value="Students">Students & Youth</option>
            <option value="Adults">Adults & Friends</option>
            <option value="Corporate">Corporate & Team Building</option>
          </select>
        </div>
      </div>

      {/* Continue Button */}
      <button type="submit" className="w-full btn-gumball-cyan py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs">
        Continue to Step 2 <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};

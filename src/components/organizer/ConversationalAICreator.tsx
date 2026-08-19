import React, { useState } from 'react';
import type { Hunt, HuntTheme, HuntDifficulty } from '../../types/hunt';
import { AIService } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Wand2, RefreshCw, Check, ArrowLeft, Loader2 } from 'lucide-react';

interface ConversationalAICreatorProps {
  initialBasicInfo?: any;
  onBack: () => void;
  onAcceptHunt: (hunt: Hunt) => void;
}

export const ConversationalAICreator: React.FC<ConversationalAICreatorProps> = ({
  initialBasicInfo,
  onBack,
  onAcceptHunt,
}) => {
  const { user } = useAuth();
  const [promptText, setPromptText] = useState(
    initialBasicInfo
      ? `Create a ${initialBasicInfo.timeLimitMinutes}-minute ${initialBasicInfo.theme} treasure hunt titled "${initialBasicInfo.title}" for ${initialBasicInfo.targetAudience}`
      : 'Create a 90-minute pirate treasure hunt for 30 college students with 8 checkpoints.'
  );

  const [theme, setTheme] = useState<HuntTheme>(initialBasicInfo?.theme || 'pirate');
  const [targetAudience, setTargetAudience] = useState<'Kids' | 'Students' | 'Adults' | 'Corporate'>(initialBasicInfo?.targetAudience || 'Students');
  const [difficulty, setDifficulty] = useState<HuntDifficulty>(initialBasicInfo?.difficulty || 'medium');
  const [durationMins, setDurationMins] = useState<number>(initialBasicInfo?.timeLimitMinutes || 60);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHunt, setGeneratedHunt] = useState<Hunt | null>(null);
  const [activeTab, setActiveTab] = useState<'story' | 'checkpoints' | 'puzzles' | 'characters' | 'ending'>('checkpoints');

  const handleGenerate = async () => {
    if (!promptText.trim()) return;

    setIsGenerating(true);
    try {
      const hunt = await AIService.generateHunt(
        {
          topic: promptText,
          theme,
          difficulty,
          checkpointCount: 4,
          timeLimitMinutes: durationMins,
          targetAudience,
        },
        user.id,
        user.name
      );
      setGeneratedHunt(hunt);
      setIsGenerating(false);
    } catch (err) {
      console.error('Failed to generate AI hunt:', err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button onClick={onBack} className="btn-darwin-orange text-xs py-2 px-3 rounded-xl flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Creation Method
      </button>

      {/* CONVERSATIONAL AI PROMPT SECTION */}
      {!generatedHunt ? (
        <div className="gumball-card p-6 md:p-8 rounded-3xl bg-slate-900 border-4 border-purple-500 space-y-6">
          <div className="text-center space-y-2 border-b-2 border-slate-800 pb-4">
            <span className="text-[10px] font-arcade text-purple-300 uppercase tracking-widest block">
              CONVERSATIONAL AI ADVENTURE ENGINE
            </span>
            <h2 className="text-2xl font-arcade text-white gumball-text-pink flex items-center justify-center gap-2">
              <Wand2 className="w-6 h-6 animate-pulse text-purple-400" /> What adventure do you want to create?
            </h2>
            <p className="text-xs font-pixel text-slate-300">
              Describe your idea in plain text or refine the quick options below.
            </p>
          </div>

          {/* LARGE PROMPT BOX */}
          <div>
            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. Create a 90-minute pirate treasure hunt for 30 college students with 8 checkpoints."
              className="w-full gumball-input rounded-2xl p-4 text-xs font-pixel leading-relaxed"
            />
          </div>

          {/* QUICK OPTIONS */}
          <div className="space-y-4 pt-2 border-t-2 border-slate-800">
            <h4 className="text-xs font-arcade text-white uppercase">QUICK OPTIONS</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Theme */}
              <div>
                <label className="block text-[10px] font-arcade text-purple-300 uppercase mb-1">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as HuntTheme)}
                  className="w-full gumball-input rounded-xl px-2.5 py-2 text-xs bg-slate-950 capitalize"
                >
                  <option value="pirate">Pirate</option>
                  <option value="mystery">Mystery</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="detective">Detective</option>
                  <option value="horror">Horror</option>
                  <option value="space">Space</option>
                  <option value="gumball">Gumball</option>
                  <option value="adventure">Adventure</option>
                </select>
              </div>

              {/* Audience */}
              <div>
                <label className="block text-[10px] font-arcade text-purple-300 uppercase mb-1">Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full gumball-input rounded-xl px-2.5 py-2 text-xs bg-slate-950"
                >
                  <option value="Kids">Kids</option>
                  <option value="Students">Students</option>
                  <option value="Adults">Adults</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-[10px] font-arcade text-purple-300 uppercase mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as HuntDifficulty)}
                  className="w-full gumball-input rounded-xl px-2.5 py-2 text-xs bg-slate-950 capitalize"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-[10px] font-arcade text-purple-300 uppercase mb-1">Duration</label>
                <select
                  value={durationMins}
                  onChange={(e) => setDurationMins(parseInt(e.target.value) || 60)}
                  className="w-full gumball-input rounded-xl px-2.5 py-2 text-xs bg-slate-950"
                >
                  <option value={30}>30 min</option>
                  <option value={60}>60 min</option>
                  <option value={90}>90 min</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !promptText.trim()}
            className="w-full btn-anais-pink py-4 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" /> Synthesizing Storyline & Clues...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" /> ✨ Generate Hunt
              </>
            )}
          </button>
        </div>
      ) : (
        /* AI GENERATION RESULT REVIEW VIEW */
        <div className="gumball-card p-6 md:p-8 rounded-3xl bg-slate-900 border-4 border-cyan-400 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-arcade text-emerald-400 uppercase tracking-widest block">
                AI GENERATION RESULT
              </span>
              <h3 className="text-xl font-arcade text-white">{generatedHunt.title}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleGenerate} className="btn-darwin-orange text-[10px] py-2 px-3 rounded-xl">
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>

              <button onClick={() => onAcceptHunt(generatedHunt)} className="btn-gumball-cyan text-[10px] py-2 px-4 rounded-xl">
                <Check className="w-3.5 h-3.5" /> Accept & Edit
              </button>
            </div>
          </div>

          {/* RESULT SECTIONS TABS */}
          <div className="flex bg-slate-950 p-1 rounded-xl border-2 border-purple-900 overflow-x-auto">
            {(['checkpoints', 'story', 'puzzles', 'characters', 'ending'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-arcade capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-cyan-500 text-slate-950 font-bold border border-cyan-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-slate-800 min-h-[200px]">
            {activeTab === 'checkpoints' && (
              <div className="space-y-3">
                <h4 className="text-xs font-arcade text-cyan-300 uppercase">Generated Checkpoints ({generatedHunt.checkpoints.length})</h4>
                {generatedHunt.checkpoints.map((cp) => (
                  <div key={cp.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-xs font-bold font-pixel text-white">#{cp.order} — {cp.title}</span>
                    <p className="text-[11px] font-pixel text-slate-300 italic">"{cp.storyText}"</p>
                    <p className="text-[11px] font-pixel text-emerald-400 font-bold">Answer Target: {cp.correctAnswer}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'story' && (
              <div className="space-y-2">
                <h4 className="text-xs font-arcade text-purple-300 uppercase">Story Premise & Lore</h4>
                <p className="text-xs font-pixel text-slate-300 leading-relaxed">
                  {generatedHunt.description} Players begin their journey in an ancient environment where every checkpoint reveals another piece of the puzzle.
                </p>
              </div>
            )}

            {activeTab === 'puzzles' && (
              <div className="space-y-2">
                <h4 className="text-xs font-arcade text-amber-300 uppercase">Configured Puzzles & Hints</h4>
                <p className="text-xs font-pixel text-slate-300">
                  Password Ciphers, Optical QR Tokens, and Multiple Choice questions configured with strategic 3-tier hints.
                </p>
              </div>
            )}

            {activeTab === 'characters' && (
              <div className="space-y-2">
                <h4 className="text-xs font-arcade text-pink-300 uppercase">Interactive Dialogue Characters</h4>
                <p className="text-xs font-pixel text-slate-300">
                  Featured Speaker: <strong className="text-white">Gumball Watterson & Captain Blackbeard</strong>.
                </p>
              </div>
            )}

            {activeTab === 'ending' && (
              <div className="space-y-2">
                <h4 className="text-xs font-arcade text-emerald-300 uppercase">Dramatic Quest Ending</h4>
                <p className="text-xs font-pixel text-slate-300">
                  Upon clearing the final checkpoint, players trigger the animated "TREASURE FOUND! 🏆" victory screen.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

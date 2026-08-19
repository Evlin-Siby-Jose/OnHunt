import React, { useState } from 'react';
import type { Hunt } from '../../types/hunt';
import { Modal } from '../common/Modal';
import { Eye, X, Clock, HelpCircle, Send, ArrowRight } from 'lucide-react';

interface PlayerPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  hunt: Hunt;
}

export const PlayerPreviewModal: React.FC<PlayerPreviewModalProps> = ({ isOpen, onClose, hunt }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const checkpoints = hunt.checkpoints;
  const currentCp = checkpoints[currentIdx] || checkpoints[0];

  const handleSubmit = (ans?: string) => {
    const val = ans || answerInput;
    if (!val || !currentCp) return;

    if (val.trim().toUpperCase() === currentCp.correctAnswer.trim().toUpperCase()) {
      setFeedback(`Correct! "${currentCp.correctAnswer}" matches target.`);
      setAnswerInput('');
    } else {
      setFeedback(`Incorrect answer. Try again!`);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentIdx < checkpoints.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`👁 PLAYER PREVIEW MODE – ${hunt.title}`} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* TOP SIMULATOR BANNER */}
        <div className="p-3 rounded-xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-between">
          <span className="text-xs font-arcade text-amber-300 flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> Live Player View Preview (Simulated Data)
          </span>

          <button onClick={onClose} className="btn-darwin-orange text-[10px] py-1.5 px-3 rounded-lg">
            <X className="w-3.5 h-3.5" /> Exit Preview
          </button>
        </div>

        {/* SIMULATED GAME SCREEN */}
        {currentCp && (
          <div className="gumball-card p-6 rounded-3xl bg-slate-900 border-4 border-cyan-400 space-y-6">
            
            {/* Header: Timer & Progress */}
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <span className="text-xs font-arcade text-cyan-300">
                Checkpoint {currentCp.order} / {checkpoints.length}
              </span>
              <span className="text-xs font-arcade text-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {hunt.timeLimitMinutes}:00 Remaining
              </span>
            </div>

            {/* Story */}
            <div className="p-3.5 rounded-xl bg-slate-950 border-2 border-purple-900 space-y-1">
              <span className="text-[10px] font-arcade text-purple-300 uppercase">Dialogue Story</span>
              <p className="text-xs font-pixel text-slate-200 italic">"{currentCp.storyText}"</p>
            </div>

            {/* Clue Card */}
            <div className="p-4 rounded-xl bg-slate-950 border-2 border-cyan-500 space-y-2">
              <h4 className="text-xs font-arcade text-cyan-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> YOUR CLUE
              </h4>
              <p className="text-xs font-pixel text-white leading-relaxed">
                "{currentCp.clueText}"
              </p>
            </div>

            {/* Answer Solver */}
            <div className="space-y-2">
              <label className="block text-[10px] font-arcade text-slate-400 uppercase">Submit Answer:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type answer..."
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="flex-1 gumball-input rounded-xl px-3 py-2 text-xs"
                />
                <button onClick={() => handleSubmit()} className="btn-gumball-cyan text-xs py-2 px-4 rounded-xl">
                  <Send className="w-4 h-4" /> Submit
                </button>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="p-3 rounded-xl bg-emerald-950 border-2 border-emerald-500 text-emerald-200 text-xs font-pixel">
                {feedback}
              </div>
            )}

            {/* Hints Section */}
            <div className="border-t-2 border-slate-800 pt-3 space-y-2">
              <span className="text-xs font-arcade text-yellow-300 block">Available Hints</span>
              {currentCp.hints.map((h) => (
                <div key={h.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-pixel text-slate-300 flex items-center justify-between">
                  <span>Hint #{h.order}: {h.text}</span>
                  <span className="text-[10px] text-amber-400 font-arcade">-{h.penaltyPoints} pts</span>
                </div>
              ))}
            </div>

            {/* Next Checkpoint Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                disabled={currentIdx >= checkpoints.length - 1}
                className="btn-penny-yellow text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 disabled:opacity-40"
              >
                Next Checkpoint <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}
      </div>
    </Modal>
  );
};

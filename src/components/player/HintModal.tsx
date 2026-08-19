import React from 'react';
import { Modal } from '../common/Modal';
import type { Hint } from '../../types/hunt';
import { HelpCircle, Sparkles } from 'lucide-react';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hints: Hint[];
  unlockedHintIds: string[];
  onUnlockHint: (hintId: string) => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  hints,
  unlockedHintIds,
  onUnlockHint,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Strategic Hint System">
      <div className="space-y-4">
        <p className="text-xs text-slate-300">
          Unlocking hints reveals critical clues to solve the checkpoint, but deducts penalty points from your final score.
        </p>

        <div className="space-y-3">
          {hints.map((hint, idx) => {
            const isUnlocked = unlockedHintIds.includes(hint.id);

            return (
              <div
                key={hint.id || idx}
                className={`p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-indigo-950/40 border-indigo-500/40'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> Hint #{hint.order}
                  </span>

                  <span className={`text-[11px] font-bold ${isUnlocked ? 'text-indigo-300' : 'text-rose-400'}`}>
                    -{hint.penaltyPoints} pts penalty
                  </span>
                </div>

                {isUnlocked ? (
                  <p className="text-xs text-indigo-200 font-medium leading-relaxed bg-indigo-900/30 p-2.5 rounded-lg border border-indigo-500/20">
                    "{hint.text}"
                  </p>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 italic">Locked hint content</span>
                    <button
                      onClick={() => onUnlockHint(hint.id)}
                      className="btn-primary text-[11px] py-1.5 px-3 bg-gradient-to-r from-amber-600 to-amber-700"
                    >
                      <Sparkles className="w-3 h-3" /> Reveal (-{hint.penaltyPoints} pts)
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

import React from 'react';
import { Modal } from '../common/Modal';
import { Trophy, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostGameResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  score: number;
  timeElapsedSeconds: number;
  rank: number;
}

export const PostGameResultsModal: React.FC<PostGameResultsModalProps> = ({
  isOpen,
  onClose,
  teamName,
  score,
  timeElapsedSeconds,
  rank,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      confetti({ particleCount: 180, spread: 90, origin: { y: 0.5 } });
    }
  }, [isOpen]);

  const awards = [
    { title: '🏆 Treasure Master', desc: 'Cleared all quest checkpoint ciphers' },
    { title: '⚡ Speed Runner', desc: 'Completed under time limit' },
    { title: '🧠 Puzzle Genius', desc: 'Solved clues with high accuracy' },
    { title: '🔎 Secret Finder', desc: 'Unlocked hidden inventory relics' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🏆 TREASURE FOUND!">
      <div className="space-y-6 text-center">
        {/* TROPHY ICON */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 p-1 mx-auto shadow-2xl border-4 border-amber-300">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-amber-400 animate-pulse" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-arcade gumball-text-yellow">VICTORY ACHIEVED!</h3>
          <p className="text-xs font-pixel text-slate-300 mt-1">
            Squad <strong className="text-white">{teamName}</strong> has found the final treasure!
          </p>
        </div>

        {/* TEAM STATISTICS */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border-4 border-purple-900">
          <div>
            <span className="text-[10px] font-arcade text-slate-400 uppercase">Final Rank</span>
            <p className="text-xl font-arcade text-amber-400 mt-1">#{rank}</p>
          </div>
          <div>
            <span className="text-[10px] font-arcade text-slate-400 uppercase">Total Score</span>
            <p className="text-xl font-arcade text-cyan-300 mt-1">{score} Pts</p>
          </div>
          <div>
            <span className="text-[10px] font-arcade text-slate-400 uppercase">Completion Time</span>
            <p className="text-xl font-arcade text-emerald-400 mt-1">
              {Math.floor(timeElapsedSeconds / 60)}m {timeElapsedSeconds % 60}s
            </p>
          </div>
        </div>

        {/* SPECIAL AWARDS & BADGES */}
        <div className="space-y-3 border-t-2 border-slate-800 pt-4 text-left">
          <h4 className="text-xs font-arcade text-white uppercase text-center">SPECIAL UNLOCKED AWARDS</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {awards.map((a) => (
              <div key={a.title} className="p-3 rounded-xl bg-slate-900 border-2 border-amber-400 flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-300 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold font-arcade text-white">{a.title}</h5>
                  <p className="text-[10px] font-pixel text-slate-300">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onClose} className="w-full btn-penny-yellow py-3 rounded-xl text-xs">
          View Tournament Leaderboard
        </button>
      </div>
    </Modal>
  );
};

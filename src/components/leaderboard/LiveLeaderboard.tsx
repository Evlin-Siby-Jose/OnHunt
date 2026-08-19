import React from 'react';
import { useGame } from '../../context/GameContext';
import { Trophy, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export const LiveLeaderboard: React.FC = () => {
  const { hunts, activeHuntId, setActiveHuntId, getLeaderboard } = useGame();

  const activeHunt = hunts.find((h) => h.id === activeHuntId) || hunts[0];

  if (!activeHunt) return null;

  const leaderboard = getLeaderboard(activeHunt.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-card p-6 rounded-2xl border-indigo-500/30 bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 animate-ping" /> Real-Time Multi-Tab Sync Active
          </div>
          <h2 className="text-2xl font-black font-heading text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" /> Tournament Leaderboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">Live ranks, cleared checkpoints, and scores updated in real time.</p>
        </div>

        <select
          value={activeHunt.id}
          onChange={(e) => setActiveHuntId(e.target.value)}
          className="glass-input rounded-xl px-3.5 py-2 text-xs bg-slate-900 font-semibold font-heading self-start sm:self-auto"
        >
          {hunts.map((h) => (
            <option key={h.id} value={h.id}>
              {h.title} ({h.checkpoints.length} Nodes)
            </option>
          ))}
        </select>
      </div>

      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="glass-card p-4 rounded-2xl border-slate-700/60 text-center flex flex-col items-center justify-center mt-4 bg-slate-900/60">
            <div className="w-10 h-10 rounded-full bg-slate-300/20 text-slate-200 border border-slate-400/40 flex items-center justify-center font-black text-sm mb-1">
              #2
            </div>
            <h4 className="text-xs font-bold text-white font-heading truncate w-full">{leaderboard[1].teamName}</h4>
            <span className="text-xs font-bold text-amber-400 mt-0.5">{leaderboard[1].score} pts</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border-amber-500/50 text-center flex flex-col items-center justify-center bg-gradient-to-b from-amber-950/30 to-slate-950 shadow-xl shadow-amber-500/10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-base mb-1 shadow-lg">
              #1
            </div>
            <h4 className="text-sm font-black text-white font-heading truncate w-full">{leaderboard[0].teamName}</h4>
            <span className="text-sm font-extrabold text-amber-400 mt-0.5">{leaderboard[0].score} pts</span>
            <span className="text-[10px] text-emerald-400 font-semibold mt-1">
              {leaderboard[0].completedCheckpointsCount}/{leaderboard[0].totalCheckpoints} Cleared
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl border-amber-800/40 text-center flex flex-col items-center justify-center mt-6 bg-slate-900/60">
            <div className="w-10 h-10 rounded-full bg-amber-800/20 text-amber-500 border border-amber-800/40 flex items-center justify-center font-black text-sm mb-1">
              #3
            </div>
            <h4 className="text-xs font-bold text-white font-heading truncate w-full">{leaderboard[2].teamName}</h4>
            <span className="text-xs font-bold text-amber-400 mt-0.5">{leaderboard[2].score} pts</span>
          </div>
        </div>
      )}

      <div className="glass-card p-5 rounded-2xl border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Rank & Team Name</span>
          <div className="flex items-center gap-8">
            <span>Nodes Cleared</span>
            <span>Elapsed Time</span>
            <span>Total Points</span>
          </div>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No teams registered for this hunt yet. Join a squad in the Gameplay Arena!
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <motion.div
                key={entry.teamId}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                      entry.rank === 1
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : entry.rank === 2
                        ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40'
                        : entry.rank === 3
                        ? 'bg-amber-800/20 text-amber-500 border border-amber-800/40'
                        : 'bg-indigo-500/10 text-slate-400'
                    }`}
                  >
                    #{entry.rank}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-white font-heading">{entry.teamName}</h5>
                    <span className={`text-[10px] uppercase font-bold ${entry.status === 'completed' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                      {entry.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-xs">
                  <span className="font-semibold text-slate-300 w-16 text-center">
                    {entry.completedCheckpointsCount} / {entry.totalCheckpoints}
                  </span>
                  <span className="font-mono text-slate-400 w-16 text-center">
                    {Math.floor(entry.timeElapsedSeconds / 60)}m {entry.timeElapsedSeconds % 60}s
                  </span>
                  <span className="font-extrabold text-amber-400 font-heading w-16 text-right">
                    {entry.score} pts
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

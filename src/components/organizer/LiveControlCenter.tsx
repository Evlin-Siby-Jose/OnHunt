import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Radio, Play, Pause, Square, Megaphone, Send, Users, SkipForward, Clock } from 'lucide-react';

export const LiveControlCenter: React.FC = () => {
  const { hunts, activeHuntId, setHuntStatus, broadcastAnnouncement, getLeaderboard, teams } = useGame();
  
  const activeHunt = hunts.find((h) => h.id === activeHuntId) || hunts[0];

  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  if (!activeHunt) return null;

  const leaderboard = getLeaderboard(activeHunt.id);

  const totalPlayersCount = leaderboard.reduce((acc, entry) => {
    const teamObj = teams.find((t) => t.id === entry.teamId);
    return acc + (teamObj ? teamObj.members.length : 1);
  }, 0);

  const completedTeamsCount = leaderboard.filter((entry) => entry.status === 'completed').length;
  const completionPercentage = leaderboard.length > 0 ? Math.round((completedTeamsCount / leaderboard.length) * 100) : 0;

  const avgProgress = leaderboard.length > 0 
    ? Math.round(leaderboard.reduce((acc, e) => acc + e.completedCheckpointsCount, 0) / leaderboard.length)
    : 0;

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementMsg.trim()) return;

    broadcastAnnouncement(
      activeHunt.id,
      announcementTitle.trim() || 'Organizer Notice',
      announcementMsg.trim(),
      isUrgent
    );

    setAnnouncementTitle('');
    setAnnouncementMsg('');
    setIsUrgent(false);
  };

  const handleGiveTeamHint = (teamName: string) => {
    broadcastAnnouncement(
      activeHunt.id,
      `Hint for ${teamName}`,
      `Organizer hint unlocked: Focus on the target keyword!`,
      false
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 🔴 DEDICATED LIVE STATUS BANNER */}
      <div className="gumball-card p-6 rounded-3xl bg-slate-900 border-4 border-rose-500 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded bg-rose-500 text-slate-950 font-arcade text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
                <Radio className="w-3.5 h-3.5 animate-ping" /> 🔴 LIVE
              </span>
              <span className="text-xs font-arcade text-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 01:24:36 remaining
              </span>
            </div>
            <h2 className="text-2xl font-arcade text-white">{activeHunt.title}</h2>
          </div>

          {/* LARGE ORGANIZER ACTION CONTROLS */}
          <div className="flex flex-wrap items-center gap-2">
            {activeHunt.status === 'live' ? (
              <button
                onClick={() => setHuntStatus(activeHunt.id, 'paused' as any)}
                className="btn-penny-yellow text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5"
              >
                <Pause className="w-4 h-4" /> Pause Game
              </button>
            ) : (
              <button
                onClick={() => setHuntStatus(activeHunt.id, 'live')}
                className="btn-gumball-cyan text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5"
              >
                <Play className="w-4 h-4" /> Resume Game
              </button>
            )}

            <button
              onClick={() => broadcastAnnouncement(activeHunt.id, 'Checkpoint Skipped', 'Organizer skipped current checkpoint for active squads!', false)}
              className="btn-darwin-orange text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5"
            >
              <SkipForward className="w-4 h-4" /> Skip Checkpoint
            </button>

            <button
              onClick={() => setHuntStatus(activeHunt.id, 'completed')}
              className="btn-anais-pink text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5"
            >
              <Square className="w-4 h-4" /> End Game
            </button>
          </div>
        </div>

        {/* LIVE OVERVIEW METRICS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950 border-2 border-purple-900 text-center">
            <span className="text-[10px] font-arcade text-slate-400 uppercase">Teams Active</span>
            <p className="text-2xl font-arcade text-cyan-300 mt-1">{leaderboard.length}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border-2 border-purple-900 text-center">
            <span className="text-[10px] font-arcade text-slate-400 uppercase">Players</span>
            <p className="text-2xl font-arcade text-purple-300 mt-1">{totalPlayersCount}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border-2 border-purple-900 text-center">
            <span className="text-[10px] font-arcade text-slate-400 uppercase">Completed</span>
            <p className="text-2xl font-arcade text-emerald-400 mt-1">{completionPercentage}%</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border-2 border-purple-900 text-center">
            <span className="text-[10px] font-arcade text-slate-400 uppercase">Average Progress</span>
            <p className="text-2xl font-arcade text-amber-300 mt-1">{avgProgress}/{activeHunt.checkpoints.length}</p>
          </div>
        </div>
      </div>

      {/* TEAM MONITOR GRID & ANNOUNCEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BROADCASTER FORM */}
        <div className="gumball-card p-5 rounded-2xl border-4 border-slate-700 bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-slate-800 pb-3">
            <Megaphone className="w-5 h-5 text-amber-400 animate-bounce" />
            <h4 className="text-xs font-arcade text-white">SEND ANNOUNCEMENT</h4>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <div>
              <label className="block text-[10px] font-arcade text-slate-400 uppercase mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Hint Unlocked!"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full gumball-input rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-arcade text-slate-400 uppercase mb-1">Message</label>
              <textarea
                rows={3}
                placeholder="e.g. Checkpoint 2 is now accessible in the main hall."
                value={announcementMsg}
                onChange={(e) => setAnnouncementMsg(e.target.value)}
                className="w-full gumball-input rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <button type="submit" className="w-full btn-gumball-cyan py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs">
              <Send className="w-4 h-4" /> Broadcast Live
            </button>
          </form>
        </div>

        {/* TEAM MONITOR GRID */}
        <div className="lg:col-span-2 gumball-card p-5 rounded-2xl border-4 border-slate-700 bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <h4 className="text-xs font-arcade text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> TEAM MONITOR ({leaderboard.length})
            </h4>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {leaderboard.map((team) => (
              <div
                key={team.teamId}
                className="p-3.5 rounded-xl bg-slate-950 border-2 border-purple-900 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-arcade font-bold text-xs flex items-center justify-center border border-black">
                    #{team.rank}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold font-pixel text-white">{team.teamName}</h5>
                    <span className="text-[11px] font-pixel text-slate-400">
                      Checkpoint {team.completedCheckpointsCount}/{team.totalCheckpoints} • {team.score} points
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGiveTeamHint(team.teamName)}
                    className="btn-penny-yellow text-[9px] py-1 px-2 rounded"
                    title="Give Team Hint"
                  >
                    💡 Hint
                  </button>

                  <span className={`text-[10px] font-arcade uppercase ${team.status === 'completed' ? 'text-emerald-400' : 'text-cyan-300'}`}>
                    {team.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

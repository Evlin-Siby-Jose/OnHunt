import React, { useState } from 'react';
import type { Team } from '../../types/team';
import { useGame } from '../../context/GameContext';
import { Modal } from '../common/Modal';
import { Crown, Edit3, UserMinus, Trash2, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrganizerTeamsView: React.FC = () => {
  const { teams, hunts, updateTeam, transferCaptain, removeTeamMember, disbandTeam, moveTeamMember } = useGame() as any;

  const [renamingTeam, setRenamingTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState('');

  const [disbandingTeam, setDisbandingTeam] = useState<Team | null>(null);

  const [movingMember, setMovingMember] = useState<{ memberUserId: string; memberName: string; fromTeamId: string } | null>(null);
  const [targetTeamId, setTargetTeamId] = useState<string>('');

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingTeam || !newTeamName.trim()) return;

    updateTeam(renamingTeam.id, { name: newTeamName.trim() });
    setRenamingTeam(null);
  };

  const handleConfirmDisband = () => {
    if (!disbandingTeam) return;
    disbandTeam(disbandingTeam.id);
    setDisbandingTeam(null);
  };

  const handleConfirmMove = () => {
    if (!movingMember || !targetTeamId) return;
    moveTeamMember(movingMember.memberUserId, movingMember.fromTeamId, targetTeamId);
    setMovingMember(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-arcade text-white gumball-text-cyan">ORGANIZER TEAM MANAGEMENT</h2>
          <p className="text-xs font-pixel text-slate-300">View, rename, reassign captains, move members, or disband squads across active games.</p>
        </div>

        <span className="text-xs font-arcade text-purple-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-purple-800">
          Total Squads: {teams.length}
        </span>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 rounded-2xl border-4 border-slate-800 text-slate-400 text-xs font-pixel">
          No active teams created yet. Players will appear here when they join hunts!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team: Team) => {
            const huntObj = hunts.find((h: any) => h.id === team.huntId);

            return (
              <motion.div
                key={team.id}
                layout
                className="gumball-card p-5 rounded-2xl bg-slate-900 border-4 border-purple-500 space-y-4"
              >
                {/* Team Card Header */}
                <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-arcade text-cyan-300 uppercase block">
                      {huntObj?.title || 'Quest Session'}
                    </span>
                    <h3 className="text-base font-bold font-arcade text-white flex items-center gap-2">
                      {team.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setRenamingTeam(team);
                        setNewTeamName(team.name);
                      }}
                      className="p-1.5 rounded bg-slate-800 text-cyan-300 border border-slate-700"
                      title="Rename Team"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDisbandingTeam(team)}
                      className="p-1.5 rounded bg-rose-950 text-rose-300 border border-rose-800"
                      title="Disband Team"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metrics overview */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-pixel py-2 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="block text-[10px] font-arcade text-slate-400">Score</span>
                    <span className="font-bold text-amber-300">{team.score} Pts</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-arcade text-slate-400">Checkpoint</span>
                    <span className="font-bold text-cyan-300">#{team.currentCheckpointIndex + 1}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-arcade text-slate-400">Members</span>
                    <span className="font-bold text-purple-300">{team.members.length} Players</span>
                  </div>
                </div>

                {/* Member Roster List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-arcade text-slate-400 uppercase block">
                    Squad Members & Roles
                  </span>
                  <div className="space-y-1.5">
                    {team.members.map((m: any) => (
                      <div
                        key={m.userId}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-pixel"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover border border-purple-500" />
                          <span className="text-white font-bold">{m.name}</span>
                          {m.isCaptain && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-arcade bg-amber-500 text-slate-950 font-bold flex items-center gap-1">
                              <Crown className="w-2.5 h-2.5" /> CAPTAIN
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {!m.isCaptain && (
                            <button
                              onClick={() => transferCaptain(team.id, m.userId)}
                              className="text-[9px] font-arcade px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500"
                              title="Assign Captain"
                            >
                              👑 Make Captain
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setMovingMember({ memberUserId: m.userId, memberName: m.name, fromTeamId: team.id });
                              const other = teams.find((t: any) => t.id !== team.id);
                              if (other) setTargetTeamId(other.id);
                            }}
                            className="text-[9px] font-arcade px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800"
                            title="Move Member"
                          >
                            <ArrowRightLeft className="w-3 h-3 inline" /> Move
                          </button>

                          <button
                            onClick={() => removeTeamMember(team.id, m.userId)}
                            className="p-1 rounded bg-rose-950 text-rose-300 border border-rose-800"
                            title="Remove Member"
                          >
                            <UserMinus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* RENAME TEAM MODAL */}
      {renamingTeam && (
        <Modal isOpen={!!renamingTeam} onClose={() => setRenamingTeam(null)} title="✏️ RENAME SQUAD">
          <form onSubmit={handleSaveRename} className="space-y-4">
            <div>
              <label className="block text-xs font-arcade text-slate-400 uppercase mb-1">Squad Name</label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full gumball-input rounded-xl px-4 py-3 text-sm font-bold"
                required
              />
            </div>
            <button type="submit" className="w-full btn-gumball-cyan py-3 rounded-xl text-xs">
              Save Squad Name
            </button>
          </form>
        </Modal>
      )}

      {/* DISBAND TEAM MODAL */}
      {disbandingTeam && (
        <Modal isOpen={!!disbandingTeam} onClose={() => setDisbandingTeam(null)} title="⚠️ DISBAND SQUAD">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-950 border-4 border-rose-500 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 mx-auto text-rose-400 animate-bounce" />
              <h4 className="text-xs font-arcade text-white">DISBAND TEAM CONFIRMATION</h4>
              <p className="text-xs font-pixel text-rose-200">
                Are you sure you want to disband <strong>"{disbandingTeam.name}"</strong>? All members will be removed from this squad.
              </p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setDisbandingTeam(null)} className="flex-1 btn-darwin-orange py-2.5 rounded-xl text-xs">
                Cancel
              </button>
              <button onClick={handleConfirmDisband} className="flex-1 btn-anais-pink py-2.5 rounded-xl text-xs">
                Disband Team
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MOVE MEMBER MODAL */}
      {movingMember && (
        <Modal isOpen={!!movingMember} onClose={() => setMovingMember(null)} title="↔️ MOVE TEAM MEMBER">
          <div className="space-y-4">
            <p className="text-xs font-pixel text-slate-300">
              Select destination squad for player <strong>{movingMember.memberName}</strong>:
            </p>

            <select
              value={targetTeamId}
              onChange={(e) => setTargetTeamId(e.target.value)}
              className="w-full gumball-input rounded-xl px-3 py-2.5 text-xs bg-slate-950"
            >
              {teams
                .filter((t: any) => t.id !== movingMember.fromTeamId)
                .map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.members.length}/5 Members)
                  </option>
                ))}
            </select>

            <button onClick={handleConfirmMove} className="w-full btn-gumball-cyan py-3 rounded-xl text-xs">
              Move Player Now
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

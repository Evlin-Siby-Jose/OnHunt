import React, { useState } from 'react';
import type { Team } from '../../types/team';
import { Modal } from '../common/Modal';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { EditTeamModal } from './EditTeamModal';
import { Plus, Copy, Key, Crown, Edit3 } from 'lucide-react';

interface TeamLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  huntId?: string;
  team?: Team | null;
}

export const TeamLobbyModal: React.FC<TeamLobbyModalProps> = ({ isOpen, onClose, huntId: rawHuntId, team: passedTeam }) => {
  const { user } = useAuth();
  const { createTeam, joinTeamByCode, teams, activeTeamId } = useGame();

  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [teamName, setTeamName] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const activeTeam = passedTeam || teams.find((t) => t.id === activeTeamId) || teams[0];
  const targetHuntId = passedTeam ? passedTeam.huntId : rawHuntId || activeTeam?.huntId || 'hunt_pirate_01';

  const isCaptain = activeTeam?.captainId === user.id;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setErrorMsg('Enter a squad name!');
      return;
    }
    setErrorMsg('');
    createTeam(targetHuntId, teamName.trim(), user.id, user.name, user.avatar);
    setTeamName('');
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) {
      setErrorMsg('Enter invite code!');
      return;
    }
    setErrorMsg('');
    const t = joinTeamByCode(inviteCodeInput.trim(), user.id, user.name, user.avatar);
    if (!t) {
      setErrorMsg('Invalid squad code!');
    } else {
      setInviteCodeInput('');
      onClose();
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SQUAD LOBBY & TEAM ROOM">
      <div className="space-y-6">
        {activeTeam ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border-2 border-purple-500 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-arcade text-purple-300 uppercase">ACTIVE SQUAD</span>
                <h3 className="text-base font-bold font-arcade text-white">{activeTeam.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn-gumball-cyan text-xs py-1.5 px-3 rounded-lg flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> ✏️ Edit Team
                </button>

                <button
                  onClick={() => handleCopy(activeTeam.inviteCode)}
                  className="btn-penny-yellow text-xs py-1.5 px-3 rounded-lg flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedCode ? 'Copied!' : `Code: ${activeTeam.inviteCode}`}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-arcade text-slate-400 uppercase">
                  Squad Members ({activeTeam.members.length} / 5)
                </h4>
                {isCaptain && (
                  <span className="text-[10px] font-pixel text-amber-400 font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" /> You are Captain
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {activeTeam.members.map((member) => (
                  <div
                    key={member.userId}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border border-purple-500 object-cover"
                      />
                      <span className="text-xs font-pixel text-slate-200 font-bold">{member.name}</span>
                    </div>
                    {member.isCaptain && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-arcade bg-amber-500 text-slate-950 font-bold flex items-center gap-1">
                        <Crown className="w-3 h-3" /> CAPTAIN
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setMode('create')}
                className={`flex-1 py-2 text-xs font-arcade rounded-lg capitalize ${
                  mode === 'create' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Create Squad
              </button>
              <button
                onClick={() => setMode('join')}
                className={`flex-1 py-2 text-xs font-arcade rounded-lg capitalize ${
                  mode === 'join' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Join Squad Code
              </button>
            </div>

            {mode === 'create' ? (
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="block text-xs font-arcade text-slate-400 uppercase mb-1">Squad Name</label>
                  <input
                    type="text"
                    placeholder="e.g. The Watterson Squad"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full pixel-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                {errorMsg && <p className="text-[11px] font-arcade text-rose-400">{errorMsg}</p>}
                <button type="submit" className="w-full pixel-btn-green py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5">
                  <Plus className="w-4 h-4" /> Create Squad
                </button>
              </form>
            ) : (
              <form onSubmit={handleJoin} className="space-y-3">
                <div>
                  <label className="block text-xs font-arcade text-slate-400 uppercase mb-1">Invite Code</label>
                  <input
                    type="text"
                    placeholder="e.g. GUMBALL"
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value)}
                    className="w-full pixel-input rounded-xl px-3 py-2 text-xs uppercase"
                  />
                </div>
                {errorMsg && <p className="text-[11px] font-arcade text-rose-400">{errorMsg}</p>}
                <button type="submit" className="w-full pixel-btn-purple py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5">
                  <Key className="w-4 h-4" /> Join Squad
                </button>
              </form>
            )}
          </div>
        )}

        {/* EDIT TEAM MODAL */}
        {activeTeam && (
          <EditTeamModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            team={activeTeam}
          />
        )}
      </div>
    </Modal>
  );
};

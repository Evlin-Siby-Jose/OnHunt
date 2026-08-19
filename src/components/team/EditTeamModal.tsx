import React, { useState } from 'react';
import type { Team } from '../../types/team';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { Crown, UserMinus, Copy, Share2, Check } from 'lucide-react';

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
}

export const EditTeamModal: React.FC<EditTeamModalProps> = ({ isOpen, onClose, team }) => {
  const { user } = useAuth();
  const { updateTeam, transferCaptain, removeTeamMember } = useGame() as any;

  const isCaptain = team.captainId === user.id;

  const [teamName, setTeamName] = useState(team.name);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'members' | 'invite'>('details');

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptain || !teamName.trim()) return;

    updateTeam(team.id, { name: teamName.trim() });
    onClose();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(team.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/join?code=${team.inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`✏️ EDIT TEAM – ${team.name}`}>
      <div className="space-y-6">
        
        {/* ROLE PERMISSION INDICATOR */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border-2 border-purple-900">
          <div className="flex items-center gap-2">
            {isCaptain ? (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-arcade bg-amber-500 text-slate-950 font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" /> TEAM CAPTAIN
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-arcade bg-slate-800 text-slate-300">
                TEAM MEMBER
              </span>
            )}
          </div>

          <span className="text-xs font-pixel text-slate-400">
            {team.members.length} / 5 Members
          </span>
        </div>

        {/* TABS */}
        <div className="flex bg-slate-950 p-1 rounded-xl border-2 border-slate-800">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-1.5 text-xs font-arcade rounded-lg ${
              activeTab === 'details' ? 'bg-purple-700 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-1.5 text-xs font-arcade rounded-lg ${
              activeTab === 'members' ? 'bg-purple-700 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Members ({team.members.length})
          </button>
          <button
            onClick={() => setActiveTab('invite')}
            className={`flex-1 py-1.5 text-xs font-arcade rounded-lg ${
              activeTab === 'invite' ? 'bg-purple-700 text-white font-bold' : 'text-slate-400'
            }`}
          >
            + Add Member
          </button>
        </div>

        {/* TAB 1: DETAILS & SETTINGS */}
        {activeTab === 'details' && (
          <form onSubmit={handleSaveDetails} className="space-y-4">
            <div>
              <label className="block text-xs font-arcade text-purple-300 uppercase mb-1">TEAM NAME</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={!isCaptain}
                className="w-full gumball-input rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-50"
              />
              {!isCaptain && (
                <p className="text-[10px] font-pixel text-slate-400 mt-1">
                  Only team captains can change squad settings.
                </p>
              )}
            </div>

            {isCaptain && (
              <button type="submit" className="w-full btn-gumball-cyan py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Save Team Settings
              </button>
            )}
          </form>
        )}

        {/* TAB 2: MEMBERS ROSTER */}
        {activeTab === 'members' && (
          <div className="space-y-3">
            {team.members.map((member) => (
              <div
                key={member.userId}
                className="p-3 rounded-xl bg-slate-900 border-2 border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover border-2 border-purple-500" />
                  <div>
                    <h5 className="text-xs font-bold font-pixel text-white flex items-center gap-1">
                      {member.name} {member.isCaptain && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                    </h5>
                    <span className="text-[10px] font-pixel text-slate-400">
                      {member.isCaptain ? 'Captain' : 'Member'}
                    </span>
                  </div>
                </div>

                {isCaptain && member.userId !== user.id && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => transferCaptain(team.id, member.userId)}
                      className="btn-penny-yellow text-[9px] py-1 px-2 rounded"
                      title="Make Captain"
                    >
                      👑 Make Captain
                    </button>
                    <button
                      onClick={() => removeTeamMember(team.id, member.userId)}
                      className="p-1.5 rounded bg-rose-950 border border-rose-800 text-rose-300"
                      title="Remove Member"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: ADD MEMBERS & INVITE */}
        {activeTab === 'invite' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border-2 border-purple-800 space-y-3">
              <span className="text-[10px] font-arcade text-purple-300 uppercase block">TEAM INVITE CODE</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-arcade text-yellow-300 tracking-widest">{team.inviteCode}</span>
                <button onClick={handleCopyCode} className="btn-penny-yellow text-xs py-1.5 px-3 rounded-lg flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border-2 border-cyan-800 space-y-3">
              <span className="text-[10px] font-arcade text-cyan-300 uppercase block">SHAREABLE INVITE LINK</span>
              <button onClick={handleCopyLink} className="w-full btn-gumball-cyan py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> {copiedLink ? 'Link Copied!' : 'Copy Invite Link'}
              </button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};

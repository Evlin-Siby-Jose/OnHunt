import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { User, Shield, Trophy, LogOut, Check } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser, loginAsDemoUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);

  const handleSave = () => {
    updateUser({ name, role });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="USER PROFILE & ROLE SIMULATOR">
      <div className="space-y-6">
        {/* User Stats Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-full border-2 border-purple-500 object-cover"
          />
          <div>
            <h3 className="text-base font-bold font-arcade text-white">{user.name}</h3>
            <p className="text-xs font-pixel text-slate-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-1 text-[11px] font-pixel text-purple-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Level {user.level} ({user.xp} XP)
            </div>
          </div>
        </div>

        {/* Profile Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-arcade text-slate-400 uppercase mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pixel-input rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-arcade text-slate-400 uppercase mb-1">Role Simulator Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('organizer')}
                className={`p-3 rounded-xl border text-xs font-arcade flex flex-col items-center gap-1 transition-all ${
                  role === 'organizer'
                    ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Shield className="w-4 h-4" /> Organizer / Host
              </button>

              <button
                type="button"
                onClick={() => setRole('player')}
                className={`p-3 rounded-xl border text-xs font-arcade flex flex-col items-center gap-1 transition-all ${
                  role === 'player'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <User className="w-4 h-4" /> Player / Team Member
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              loginAsDemoUser();
              onClose();
            }}
            className="text-xs font-pixel text-rose-400 hover:underline flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Reset Demo User
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="pixel-btn-green py-2 px-4 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </div>
    </Modal>
  );
};

import React, { useState } from 'react';
import type { Hunt } from '../../types/hunt';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, Trash2, ShieldAlert, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  hunt: Hunt | null;
  onConfirmDelete: (huntId: string) => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  hunt,
  onConfirmDelete,
}) => {
  const { user } = useAuth();
  const [confirmInput, setConfirmInput] = useState('');

  if (!hunt) return null;

  const isLive = hunt.status === 'live';
  const isOwner = user.id === hunt.organizerId || user.role === 'organizer' || user.role === 'admin';

  const handleConfirm = () => {
    if (!isOwner) return;
    if (isLive && confirmInput.trim().toUpperCase() !== 'DELETE') return;

    onConfirmDelete(hunt.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="CONFIRM HUNT DELETION" maxWidth="max-w-md">
      <div className="space-y-6">
        {!isOwner ? (
          /* PERMISSION DENIED ERROR */
          <div className="p-4 rounded-2xl bg-rose-950 border-4 border-rose-500 text-center space-y-2">
            <ShieldAlert className="w-10 h-10 mx-auto text-rose-400" />
            <h4 className="text-sm font-arcade text-white">PERMISSION DENIED</h4>
            <p className="text-xs font-pixel text-rose-200">
              Only the organizer who created this hunt ({hunt.organizerName}) can delete it.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* LIVE HUNT WARNING ALERT */}
            {isLive ? (
              <div className="p-4 rounded-2xl bg-rose-950 border-4 border-rose-500 space-y-3">
                <div className="flex items-center gap-2 text-rose-300 font-arcade text-xs uppercase animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-rose-400" /> ⚠️ STONGER WARNING: HUNT IS LIVE!
                </div>
                <p className="text-xs font-pixel text-rose-200 leading-relaxed">
                  This hunt <strong>"{hunt.title}"</strong> is currently <strong>LIVE</strong> with active participating teams! Deleting it will immediately terminate the game and wipe session progress for all players.
                </p>
                <div className="space-y-1 pt-2">
                  <label className="block text-[10px] font-arcade text-rose-300 uppercase">
                    Type "DELETE" to confirm:
                  </label>
                  <input
                    type="text"
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder="Type DELETE..."
                    className="w-full gumball-input rounded-xl px-3 py-2 text-xs font-bold text-rose-300 uppercase border-rose-600"
                  />
                </div>
              </div>
            ) : (
              /* DRAFT / SCHEDULED HUNT CONFIRMATION */
              <div className="p-4 rounded-2xl bg-slate-900 border-4 border-slate-700 space-y-2">
                <h4 className="text-xs font-arcade text-white">Are you sure you want to delete this hunt?</h4>
                <p className="text-xs font-pixel text-slate-300">
                  Quest Title: <strong className="text-white">"{hunt.title}"</strong> ({hunt.status} mode).
                  This action cannot be undone.
                </p>
              </div>
            )}

            {/* BUTTON CONTROLS */}
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 btn-darwin-orange py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5">
                <X className="w-4 h-4" /> Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={isLive && confirmInput.trim().toUpperCase() !== 'DELETE'}
                className="flex-1 btn-anais-pink py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" /> Delete Hunt
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

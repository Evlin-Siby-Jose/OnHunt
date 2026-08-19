import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { QRScannerModal } from './QRScannerModal';
import { HintModal } from './HintModal';
import { TeamLobbyModal } from '../team/TeamLobbyModal';
import { Trophy, QrCode, HelpCircle, Send, Users, ArrowRight, Package, Lock, MapPin, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlayArenaProps {
  onComplete?: () => void;
  onOpenInventory?: () => void;
}

export const PlayArena: React.FC<PlayArenaProps> = ({ onComplete, onOpenInventory }) => {
  const { addXP } = useAuth();
  const { hunts, activeHuntId, teams, activeTeamId, submitCheckpointAnswer, unlockHint } = useGame();

  const activeHunt = hunts.find((h) => h.id === activeHuntId) || hunts[0];
  const activeTeam = teams.find((t) => t.id === activeTeamId && t.huntId === activeHunt?.id);

  const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [isVerifyingGps, setIsVerifyingGps] = useState(false);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isLobbyOpen, setIsLobbyOpen] = useState(false);

  const checkpoints = activeHunt ? activeHunt.checkpoints : [];
  const currentCheckpoint = checkpoints[currentCheckpointIndex] || checkpoints[0];

  useEffect(() => {
    if (activeTeam) {
      setCurrentCheckpointIndex(activeTeam.currentCheckpointIndex || 0);
    }
  }, [activeTeam]);

  const isCurrentCheckpointSolved = activeTeam?.completedCheckpoints.includes(currentCheckpoint?.id || '');

  const handleSubmit = (overrideAnswer?: string) => {
    if (!activeTeam || !currentCheckpoint) return;
    const finalVal = overrideAnswer || answerInput;
    if (!finalVal.trim()) return;

    const res = submitCheckpointAnswer(activeTeam.id, currentCheckpoint.id, finalVal);
    setFeedbackMsg({ success: res.success, text: res.message });

    if (res.success) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      addXP(res.pointsEarned || 100);
      setAnswerInput('');

      if (currentCheckpointIndex + 1 >= checkpoints.length) {
        if (onComplete) onComplete();
      }
    }
  };

  const handleSimulateGps = () => {
    setIsVerifyingGps(true);
    setTimeout(() => {
      setIsVerifyingGps(false);
      handleSubmit(currentCheckpoint?.correctAnswer || 'GEOFENCE-VERIFIED');
    }, 1200);
  };

  if (!activeHunt) {
    return (
      <div className="p-8 text-center text-slate-400 font-pixel">
        No active hunt selected. Please join a hunt room code!
      </div>
    );
  }

  const isCompleted = activeTeam?.status === 'completed';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* GAME ARENA HEADER BAR */}
      <div className="gumball-card p-5 rounded-3xl bg-slate-900 border-4 border-cyan-400 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-arcade uppercase bg-cyan-500 text-slate-950 font-bold">
                {activeHunt.theme} QUEST
              </span>
              <span className="text-[11px] font-pixel text-amber-400 font-bold">
                SCORE: {activeTeam?.score || 0} PTS
              </span>
            </div>
            <h2 className="text-xl font-arcade text-white">{activeHunt.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            {onOpenInventory && (
              <button
                onClick={onOpenInventory}
                className="btn-penny-yellow text-xs py-2 px-3 rounded-xl flex items-center gap-1"
              >
                <Package className="w-3.5 h-3.5" /> Backpack
              </button>
            )}

            <button
              onClick={() => setIsLobbyOpen(true)}
              className="btn-gumball-cyan text-xs py-2 px-3 rounded-xl flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5" /> {activeTeam?.name || 'Squad Lobby'}
            </button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-arcade text-slate-300">
            <span>Progress Node: {currentCheckpointIndex + 1} / {checkpoints.length}</span>
            <span>{Math.round(((currentCheckpointIndex + 1) / checkpoints.length) * 100)}%</span>
          </div>

          <div className="h-3 bg-slate-950 rounded-full border-2 border-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${((currentCheckpointIndex + 1) / checkpoints.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* COMPLETED QUEST VICTORY BANNER */}
      {isCompleted ? (
        <div className="gumball-card p-8 rounded-3xl bg-emerald-950 border-4 border-emerald-400 text-center space-y-4">
          <Trophy className="w-12 h-12 mx-auto text-yellow-300 animate-bounce" />
          <h3 className="text-2xl font-arcade text-white gumball-text-yellow">TREASURE FOUND! 🏆</h3>
          <p className="text-xs font-pixel text-emerald-200">
            Congratulations! Squad <strong>{activeTeam?.name}</strong> cleared all checkpoints!
          </p>
          {onComplete && (
            <button onClick={onComplete} className="btn-penny-yellow py-3 px-6 rounded-xl text-xs">
              View Post-Game Awards & Results
            </button>
          )}
        </div>
      ) : (
        /* ACTIVE CHECKPOINT GAME CARD */
        currentCheckpoint && (
          <div className="gumball-card p-6 rounded-3xl bg-slate-900 border-4 border-purple-500 space-y-6">
            
            {/* Checkpoint Header & Status */}
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <span className="text-xs font-arcade text-cyan-300">
                Node #{currentCheckpoint.order}: {currentCheckpoint.title}
              </span>

              {isCurrentCheckpointSolved ? (
                <span className="px-2.5 py-1 rounded text-[10px] font-arcade bg-emerald-500 text-slate-950 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SOLVED
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded text-[10px] font-arcade bg-amber-500 text-slate-950 font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> LOCKED NODE
                </span>
              )}
            </div>

            {/* Dialogue Story */}
            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-purple-900 space-y-1">
              <span className="text-[10px] font-arcade text-purple-300 uppercase">
                {currentCheckpoint.dialogueSpeaker || 'Story Character'}
              </span>
              <p className="text-xs font-pixel text-slate-200 italic leading-relaxed">
                "{currentCheckpoint.storyText}"
              </p>
            </div>

            {/* Clue Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-cyan-400 space-y-2">
              <h4 className="text-xs font-arcade text-cyan-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> YOUR CLUE
              </h4>
              <p className="text-xs md:text-sm font-pixel text-white leading-relaxed">
                "{currentCheckpoint.clueText}"
              </p>
            </div>

            {/* Challenge Solver Adaptors */}
            <div className="space-y-3">
              {/* GPS Geofence Challenge */}
              {currentCheckpoint.clueType === 'gps' && (
                <div className="p-4 rounded-2xl bg-slate-950 border-2 border-amber-400 space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-amber-300 font-arcade text-xs">
                    <MapPin className="w-5 h-5 text-amber-400 animate-bounce" /> LOCATION GEOFENCE CHECK
                  </div>
                  <p className="text-xs font-pixel text-slate-300">
                    Target Location: <strong>{currentCheckpoint.gpsCoordinates?.destinationName || 'Elmore Main Hall'}</strong>
                  </p>
                  <button
                    onClick={handleSimulateGps}
                    disabled={isVerifyingGps || isCurrentCheckpointSolved}
                    className="btn-penny-yellow py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 mx-auto disabled:opacity-40"
                  >
                    {isVerifyingGps ? 'Verifying GPS Proximity...' : '📍 Verify GPS Location'}
                  </button>
                </div>
              )}

              {/* MCQ Challenge */}
              {currentCheckpoint.clueType === 'mcq' && currentCheckpoint.mcqOptions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentCheckpoint.mcqOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSubmit(opt)}
                      disabled={isCurrentCheckpointSolved}
                      className="p-3 rounded-xl bg-slate-950 border-2 border-purple-800 hover:border-cyan-400 text-left text-xs font-pixel text-white transition-all hover:translate-x-1 disabled:opacity-50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* QR Challenge (Disables text input to prevent bypassing) */}
              {currentCheckpoint.clueType === 'qr_code' && (
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  disabled={isCurrentCheckpointSolved}
                  className="w-full btn-penny-yellow py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <QrCode className="w-4 h-4" /> Open Camera & Scan QR Pass
                </button>
              )}

              {/* Password Challenge */}
              {(currentCheckpoint.clueType === 'text_password' || currentCheckpoint.clueType === 'image_clue' || currentCheckpoint.clueType === 'photo' || currentCheckpoint.clueType === 'puzzle') && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="TYPE CIPHER ANSWER..."
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    disabled={isCurrentCheckpointSolved}
                    className="flex-1 gumball-input rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-cyan-300 disabled:opacity-50"
                  />
                  <button
                    onClick={() => handleSubmit()}
                    disabled={isCurrentCheckpointSolved}
                    className="btn-gumball-cyan py-3 px-5 rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" /> Submit
                  </button>
                </div>
              )}
            </div>

            {/* Feedback Message */}
            {feedbackMsg && (
              <div
                className={`p-3 rounded-xl border-2 text-xs font-pixel ${
                  feedbackMsg.success
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                    : 'bg-rose-950 border-rose-500 text-rose-200'
                }`}
              >
                {feedbackMsg.text}
              </div>
            )}

            {/* Action Bar (Strict Checkpoint Locking) */}
            <div className="flex items-center justify-between border-t-2 border-slate-800 pt-4">
              <button
                onClick={() => setIsHintModalOpen(true)}
                className="btn-penny-yellow text-[11px] py-2 px-3 rounded-xl flex items-center gap-1.5"
              >
                💡 Need a Hint?
              </button>

              {/* STRICT LOCKING: Only unlock Next Node if current checkpoint is solved! */}
              {isCurrentCheckpointSolved ? (
                <button
                  onClick={() => {
                    if (currentCheckpointIndex + 1 < checkpoints.length) {
                      setCurrentCheckpointIndex(currentCheckpointIndex + 1);
                    }
                  }}
                  disabled={currentCheckpointIndex + 1 >= checkpoints.length}
                  className="btn-gumball-cyan text-[11px] py-2 px-4 rounded-xl flex items-center gap-1 disabled:opacity-40"
                >
                  Next Node <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-arcade text-amber-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> SOLVE CLUE TO UNLOCK NEXT NODE
                </div>
              )}
            </div>

          </div>
        )
      )}

      {/* MODALS */}
      <QRScannerModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        mode="checkpoint"
        currentHuntId={activeHunt?.id}
        currentCheckpointId={currentCheckpoint?.id}
        targetQRText={currentCheckpoint?.qrCodeData || currentCheckpoint?.correctAnswer || ''}
        onScanSuccess={(data) => {
          const val = typeof data === 'string' ? data : data.checkpointId || currentCheckpoint?.correctAnswer || '';
          handleSubmit(val);
          setIsQrModalOpen(false);
        }}
      />

      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        hints={currentCheckpoint?.hints || []}
        unlockedHintIds={activeTeam?.unlockedHints[currentCheckpoint?.id || ''] || []}
        onUnlockHint={(hintId) => {
          if (activeTeam && currentCheckpoint) {
            unlockHint(activeTeam.id, currentCheckpoint.id, hintId);
          }
        }}
      />

      <TeamLobbyModal
        isOpen={isLobbyOpen}
        onClose={() => setIsLobbyOpen(false)}
        team={activeTeam || null}
      />
    </div>
  );
};

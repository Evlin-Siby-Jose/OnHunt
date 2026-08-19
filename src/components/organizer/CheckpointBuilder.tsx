import React, { useState } from 'react';
import type { Checkpoint, ChallengeType, Hint } from '../../types/hunt';
import { Plus, Trash2, QrCode, Key, HelpCircle, Image, ChevronDown, ChevronUp } from 'lucide-react';

interface CheckpointBuilderProps {
  checkpoints: Checkpoint[];
  onChange: (updatedCheckpoints: Checkpoint[]) => void;
}

export const CheckpointBuilder: React.FC<CheckpointBuilderProps> = ({ checkpoints, onChange }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleAddCheckpoint = () => {
    const newOrder = checkpoints.length + 1;
    const newCp: Checkpoint = {
      id: `cp_custom_${Date.now()}_${newOrder}`,
      huntId: '',
      order: newOrder,
      title: `Checkpoint ${newOrder}: Secret Discovery`,
      storyText: 'Write immersive lore text to set the scene for players...',
      clueType: 'text_password',
      clueText: 'Enter the clue question or prompt for this challenge.',
      correctAnswer: 'SECRET',
      rewardPoints: 100,
      penaltyPoints: 10,
      hints: [
        { id: `h_${Date.now()}_1`, order: 1, text: 'First letter starts with S...', penaltyPoints: 15 }
      ]
    };

    const updated = [...checkpoints, newCp];
    onChange(updated);
    setExpandedIndex(updated.length - 1);
  };

  const handleRemoveCheckpoint = (index: number) => {
    const updated = checkpoints
      .filter((_, idx) => idx !== index)
      .map((cp, idx) => ({ ...cp, order: idx + 1 }));
    onChange(updated);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= checkpoints.length) return;

    const list = [...checkpoints];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const reordered = list.map((cp, idx) => ({ ...cp, order: idx + 1 }));
    onChange(reordered);
    setExpandedIndex(targetIdx);
  };

  const handleUpdateField = (index: number, field: keyof Checkpoint, value: any) => {
    const updated = [...checkpoints];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddHint = (cpIndex: number) => {
    const cp = checkpoints[cpIndex];
    const newHintOrder = cp.hints.length + 1;
    const newHint: Hint = {
      id: `h_${Date.now()}_${newHintOrder}`,
      order: newHintOrder,
      text: 'Provide a helpful clue hint...',
      penaltyPoints: 15,
    };
    const updatedCp = { ...cp, hints: [...cp.hints, newHint] };
    const updatedList = [...checkpoints];
    updatedList[cpIndex] = updatedCp;
    onChange(updatedList);
  };

  const handleRemoveHint = (cpIndex: number, hintId: string) => {
    const cp = checkpoints[cpIndex];
    const updatedHints = cp.hints.filter((h) => h.id !== hintId).map((h, i) => ({ ...h, order: i + 1 }));
    const updatedCp = { ...cp, hints: updatedHints };
    const updatedList = [...checkpoints];
    updatedList[cpIndex] = updatedCp;
    onChange(updatedList);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold font-heading text-white">Interactive Checkpoint Nodes</h4>
          <p className="text-xs text-slate-400">Order, challenge types, hints, and reward scoring.</p>
        </div>
        <button onClick={handleAddCheckpoint} className="btn-secondary text-xs py-2">
          <Plus className="w-4 h-4 text-indigo-400" /> Add Checkpoint
        </button>
      </div>

      {checkpoints.map((cp, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <div
            key={cp.id || index}
            className={`glass-card rounded-2xl border transition-all ${
              isExpanded ? 'border-indigo-500/50 shadow-xl' : 'border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="p-4 flex items-center justify-between gap-3 cursor-pointer" onClick={() => setExpandedIndex(isExpanded ? null : index)}>
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveOrder(index, 'up'); }}
                    disabled={index === 0}
                    className="p-0.5 text-slate-500 hover:text-indigo-400 disabled:opacity-30"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveOrder(index, 'down'); }}
                    disabled={index === checkpoints.length - 1}
                    className="p-0.5 text-slate-500 hover:text-indigo-400 disabled:opacity-30"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-xs flex items-center justify-center">
                  #{cp.order}
                </div>

                <div>
                  <h5 className="text-sm font-bold text-white font-heading">{cp.title}</h5>
                  <span className="text-[11px] text-indigo-300 capitalize font-medium flex items-center gap-1">
                    {cp.clueType === 'text_password' && <Key className="w-3 h-3" />}
                    {cp.clueType === 'qr_code' && <QrCode className="w-3 h-3" />}
                    {cp.clueType === 'mcq' && <HelpCircle className="w-3 h-3" />}
                    {cp.clueType === 'image_clue' && <Image className="w-3 h-3" />}
                    {cp.clueType.replace('_', ' ')} • {cp.rewardPoints} pts
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemoveCheckpoint(index); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </div>

            {isExpanded && (
              <div className="p-4 border-t border-slate-800/80 space-y-4 bg-slate-950/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Checkpoint Title</label>
                    <input
                      type="text"
                      value={cp.title}
                      onChange={(e) => handleUpdateField(index, 'title', e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Challenge Type</label>
                    <select
                      value={cp.clueType}
                      onChange={(e) => handleUpdateField(index, 'clueType', e.target.value as ChallengeType)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs bg-slate-900"
                    >
                      <option value="text_password">Key Password Cipher</option>
                      <option value="qr_code">QR Code Scanner Challenge</option>
                      <option value="mcq">Multiple Choice Question (MCQ)</option>
                      <option value="image_clue">Image Clue Puzzle</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Story Text / Mission Lore</label>
                  <textarea
                    rows={2}
                    value={cp.storyText}
                    onChange={(e) => handleUpdateField(index, 'storyText', e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Clue Instruction / Question</label>
                  <input
                    type="text"
                    value={cp.clueText}
                    onChange={(e) => handleUpdateField(index, 'clueText', e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {cp.clueType === 'qr_code' && (
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                    <label className="block text-[11px] font-semibold text-indigo-300 uppercase">QR Code Payload / Secret Token</label>
                    <input
                      type="text"
                      value={cp.qrCodeData || cp.correctAnswer}
                      onChange={(e) => {
                        handleUpdateField(index, 'qrCodeData', e.target.value);
                        handleUpdateField(index, 'correctAnswer', e.target.value);
                      }}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                )}

                {cp.clueType === 'mcq' && (
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                    <label className="block text-[11px] font-semibold text-purple-300 uppercase">MCQ Options (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="Option 1, Option 2, Option 3, Option 4"
                      value={(cp.mcqOptions || []).join(', ')}
                      onChange={(e) => {
                        const opts = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        handleUpdateField(index, 'mcqOptions', opts);
                      }}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Correct Answer / Key</label>
                    <input
                      type="text"
                      value={cp.correctAnswer}
                      onChange={(e) => handleUpdateField(index, 'correctAnswer', e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono text-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Reward Points</label>
                    <input
                      type="number"
                      value={cp.rewardPoints}
                      onChange={(e) => handleUpdateField(index, 'rewardPoints', parseInt(e.target.value) || 0)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Wrong Penalty</label>
                    <input
                      type="number"
                      value={cp.penaltyPoints}
                      onChange={(e) => handleUpdateField(index, 'penaltyPoints', parseInt(e.target.value) || 0)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Configured Hints ({cp.hints.length})</span>
                    <button onClick={() => handleAddHint(index)} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                      + Add Hint
                    </button>
                  </div>

                  {cp.hints.map((hint, hIdx) => (
                    <div key={hint.id || hIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={hint.text}
                        onChange={(e) => {
                          const updatedHints = [...cp.hints];
                          updatedHints[hIdx].text = e.target.value;
                          handleUpdateField(index, 'hints', updatedHints);
                        }}
                        className="flex-1 glass-input rounded-lg px-2.5 py-1.5 text-xs"
                        placeholder="Hint text..."
                      />
                      <input
                        type="number"
                        title="Hint deduction penalty"
                        value={hint.penaltyPoints}
                        onChange={(e) => {
                          const updatedHints = [...cp.hints];
                          updatedHints[hIdx].penaltyPoints = parseInt(e.target.value) || 0;
                          handleUpdateField(index, 'hints', updatedHints);
                        }}
                        className="w-20 glass-input rounded-lg px-2 py-1.5 text-xs text-rose-400 font-medium"
                      />
                      <button
                        onClick={() => handleRemoveHint(index, hint.id)}
                        className="p-1 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

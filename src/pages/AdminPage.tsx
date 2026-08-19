import React from 'react';
import { useGame } from '../context/GameContext';
import { Shield, Cpu } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { hunts, teams } = useGame();

  const totalCheckpoints = hunts.reduce((acc, h) => acc + h.checkpoints.length, 0);

  const roadmapMilestones = [
    { code: 'MVP', title: 'Core Hunt Engine & QR Solver', status: 'Completed', color: 'emerald' },
    { code: 'M1', title: 'GPS Geofencing & Multi-Media Clues', status: 'Architected', color: 'indigo' },
    { code: 'M2', title: 'AI Story & Clue Generation Engine', status: 'Integrated', color: 'purple' },
    { code: 'M3', title: 'AI NPC Characters & Multiplayer Chat', status: 'Ready', color: 'amber' },
    { code: 'M4', title: 'AI Game Director & Dynamic Narratives', status: 'Planned', color: 'blue' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="glass-card p-6 rounded-2xl border-indigo-500/30 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1">
            System Administration & Architecture
          </span>
          <h2 className="text-2xl font-black font-heading text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-400" /> Platform Command Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">Platform analytics, active sessions, and M1-M4 roadmap status.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Hunts</span>
          <p className="text-2xl font-bold font-heading text-white mt-1">{hunts.length}</p>
        </div>
        <div className="glass-card p-4 rounded-xl border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400">Checkpoint Nodes</span>
          <p className="text-2xl font-bold font-heading text-indigo-400 mt-1">{totalCheckpoints}</p>
        </div>
        <div className="glass-card p-4 rounded-xl border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400">Active Squads</span>
          <p className="text-2xl font-bold font-heading text-purple-400 mt-1">{teams.length}</p>
        </div>
        <div className="glass-card p-4 rounded-xl border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400">Platform Health</span>
          <p className="text-2xl font-bold font-heading text-emerald-400 mt-1">99.9%</p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold font-heading text-white">M1–M4 Expansion Roadmap Status</h3>
        </div>

        <div className="space-y-3">
          {roadmapMilestones.map((m) => (
            <div
              key={m.code}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 font-bold text-xs text-indigo-300 flex items-center justify-center font-mono">
                  {m.code}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white font-heading">{m.title}</h4>
                  <span className="text-[10px] text-slate-400">Modular schema & hook ready</span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

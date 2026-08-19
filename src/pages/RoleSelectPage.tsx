import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Key, ArrowLeft, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleSelectPageProps {
  onConfirmRole: (mode: 'organizer' | 'player') => void;
  onBackToLanding: () => void;
}

export const RoleSelectPage: React.FC<RoleSelectPageProps> = ({ onConfirmRole, onBackToLanding }) => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="flex items-center justify-between">
        <button onClick={onBackToLanding} className="btn-darwin-orange text-xs py-2 px-4 rounded-xl flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Landing Page
        </button>

        <span className="text-xs font-arcade text-cyan-300">
          User: {user.name}
        </span>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-arcade text-white tracking-tight gumball-text-cyan">
          CHOOSE YOUR EXPERIENCE
        </h2>
        <p className="text-xs md:text-sm font-pixel text-slate-300">
          Select whether you want to build and manage treasure hunts or jump straight in to play as a contestant.
        </p>
      </div>

      {/* DUAL ROLE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ORGANIZER CARD */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="gumball-card p-8 rounded-2xl border-4 border-purple-500 bg-slate-900 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border-4 border-purple-400 flex items-center justify-center text-purple-300 shadow-[4px_4px_0px_#000]">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-arcade text-white">CREATE A HUNT</h3>
            
            <p className="text-xs font-pixel text-slate-300 leading-relaxed">
              "For organizers, event planners, teachers, clubs and creators."
            </p>

            <ul className="text-xs font-pixel text-purple-200 space-y-1.5 list-disc list-inside">
              <li>Visual Step-by-Step Hunt Builder</li>
              <li>✨ Conversational AI Story Engine</li>
              <li>Printable QR Code Sheet Passes</li>
              <li>🔴 Dedicated 4K Live Control Center</li>
            </ul>
          </div>

          <button
            onClick={() => onConfirmRole('organizer')}
            className="w-full btn-anais-pink py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs"
          >
            Enter Organizer Mode <Sparkles className="w-4 h-4" />
          </button>
        </motion.div>

        {/* PLAYER CARD */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="gumball-card p-8 rounded-2xl border-4 border-cyan-400 bg-slate-900 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-600/30 border-4 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[4px_4px_0px_#000]">
              <Gamepad2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-arcade text-white">JOIN A HUNT</h3>

            <p className="text-xs font-pixel text-slate-300 leading-relaxed">
              "For players ready to solve clues and compete."
            </p>

            <ul className="text-xs font-pixel text-cyan-200 space-y-1.5 list-disc list-inside">
              <li>Enter Hunt Code or Scan QR Pass</li>
              <li>Interactive Story & Clue Cards</li>
              <li>🎒 Quest Inventory Backpack</li>
              <li>Real-Time Ranks & Tournament Awards</li>
            </ul>
          </div>

          <button
            onClick={() => onConfirmRole('player')}
            className="w-full btn-gumball-cyan py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs"
          >
            Enter Player Mode <Key className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </div>
  );
};

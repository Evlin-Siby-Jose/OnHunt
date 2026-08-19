import React from 'react';
import { Sparkles, Edit3, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface Step2ChooseMethodProps {
  onBack: () => void;
  onSelectManual: () => void;
  onSelectAI: () => void;
}

export const Step2ChooseMethod: React.FC<Step2ChooseMethodProps> = ({ onBack, onSelectManual, onSelectAI }) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="btn-darwin-orange text-xs py-2 px-3 rounded-xl flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Basic Info
      </button>

      <div className="text-center space-y-2">
        <span className="text-[10px] font-arcade text-cyan-300 uppercase tracking-widest block">
          STEP 2 OF 2 — CREATION METHOD
        </span>
        <h2 className="text-2xl font-arcade text-white gumball-text-cyan">
          CHOOSE CREATION METHOD
        </h2>
        <p className="text-xs font-pixel text-slate-300">
          Would you like to design checkpoints yourself or have AI generate the adventure?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* MANUAL BUILD */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={onSelectManual}
          className="gumball-card p-8 rounded-3xl border-4 border-emerald-500 bg-slate-900 flex flex-col justify-between space-y-6 cursor-pointer"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/30 border-4 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[4px_4px_0px_#000]">
              <Edit3 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-arcade text-white">BUILD MANUALLY</h3>
            <p className="text-xs font-pixel text-slate-300 leading-relaxed">
              "Create every clue and challenge yourself."
            </p>

            <ul className="text-xs font-pixel text-emerald-300 space-y-1.5 list-disc list-inside">
              <li>Full 3-Panel Visual Checkpoint Editor</li>
              <li>Reorder & drag nodes smoothly</li>
              <li>Configure exact answers & hints</li>
            </ul>
          </div>

          <button className="w-full btn-gumball-cyan py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs">
            Open Manual Builder <Edit3 className="w-4 h-4" />
          </button>
        </motion.div>

        {/* AI CREATE */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={onSelectAI}
          className="gumball-card p-8 rounded-3xl border-4 border-purple-500 bg-slate-900 flex flex-col justify-between space-y-6 cursor-pointer"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border-4 border-purple-400 flex items-center justify-center text-purple-300 shadow-[4px_4px_0px_#000]">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-arcade text-white">✨ CREATE WITH AI</h3>
            <p className="text-xs font-pixel text-slate-300 leading-relaxed">
              "Describe your idea and let OnHunt build the adventure."
            </p>

            <ul className="text-xs font-pixel text-purple-200 space-y-1.5 list-disc list-inside">
              <li>Conversational prompt assistant</li>
              <li>Generates storyline, clues & characters</li>
              <li>Editable AI generation result</li>
            </ul>
          </div>

          <button className="w-full btn-anais-pink py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs">
            Launch AI Creator <Sparkles className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </div>
  );
};

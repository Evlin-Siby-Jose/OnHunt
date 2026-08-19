import React from 'react';
import { Gamepad2, Sparkles, Key, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onSelectRole: (mode: 'organizer' | 'player') => void;
  onExploreHunts: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole, onExploreHunts }) => {
  return (
    <div className="space-y-16 max-w-6xl mx-auto py-6 px-4">
      {/* HERO SECTION */}
      <div className="gumball-card p-8 md:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-4 border-cyan-400 text-center space-y-6 relative overflow-hidden">
        
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 text-xs font-arcade uppercase tracking-wider rounded-md">
          <Gamepad2 className="w-4 h-4 animate-bounce" /> Dual-Sided Adventure Engine
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl md:text-6xl font-arcade text-white tracking-tight gumball-text-cyan leading-tight">
          ONHUNT
        </h1>

        <h2 className="text-lg md:text-2xl font-arcade gumball-text-yellow">
          "Create the Hunt. Start the Adventure."
        </h2>

        <p className="text-sm md:text-base font-pixel text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Create immersive treasure hunts manually or let AI build one for you. Host college fests, school competitions, escape rooms, or outdoor quests!
        </p>

        {/* PRIMARY ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-lg mx-auto">
          <button
            onClick={() => onSelectRole('organizer')}
            className="w-full sm:w-auto flex-1 btn-darwin-orange py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-xs"
          >
            <Sparkles className="w-4 h-4" /> Create a Hunt
          </button>

          <button
            onClick={() => onSelectRole('player')}
            className="w-full sm:w-auto flex-1 btn-gumball-cyan py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-xs"
          >
            <Key className="w-4 h-4" /> Join a Hunt
          </button>
        </div>

        {/* SECONDARY OPTION */}
        <div className="pt-2">
          <button
            onClick={onExploreHunts}
            className="text-xs font-arcade text-slate-400 hover:text-amber-300 underline underline-offset-4 transition-colors inline-flex items-center gap-1"
          >
            Explore Hunts <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* VISUAL PREVIEW: CREATE → PLAY → DISCOVER */}
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-arcade text-white uppercase tracking-wider">
          CREATE → PLAY → DISCOVER
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* STEP 1: CREATE */}
          <motion.div
            whileHover={{ y: -5 }}
            className="gumball-card p-6 rounded-2xl border-4 border-purple-500 bg-slate-900 text-left space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center text-purple-300 font-arcade font-bold">
              01
            </div>
            <span className="text-[10px] font-arcade text-purple-400 uppercase tracking-widest block">
              ORGANIZER WORKSPACE
            </span>
            <h4 className="text-base font-arcade text-white">CREATE THE HUNT</h4>
            <p className="text-xs font-pixel text-slate-300 leading-relaxed">
              Use Canva-like visual checkpoint builders, QR code passes, and AI story generators to craft your quest.
            </p>
          </motion.div>

          {/* STEP 2: PLAY */}
          <motion.div
            whileHover={{ y: -5 }}
            className="gumball-card p-6 rounded-2xl border-4 border-cyan-400 bg-slate-900 text-left space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-arcade font-bold">
              02
            </div>
            <span className="text-[10px] font-arcade text-cyan-400 uppercase tracking-widest block">
              PLAYER EXPERIENCE
            </span>
            <h4 className="text-base font-arcade text-white">START THE ADVENTURE</h4>
            <p className="text-xs font-pixel text-slate-300 leading-relaxed">
              Players join via 6-digit codes or QR passes. Solve clues, open inventory items, and use strategic hints.
            </p>
          </motion.div>

          {/* STEP 3: DISCOVER */}
          <motion.div
            whileHover={{ y: -5 }}
            className="gumball-card p-6 rounded-2xl border-4 border-amber-400 bg-slate-900 text-left space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-arcade font-bold">
              03
            </div>
            <span className="text-[10px] font-arcade text-amber-400 uppercase tracking-widest block">
              TOURNAMENT RANKS
            </span>
            <h4 className="text-base font-arcade text-white">DISCOVER TREASURE</h4>
            <p className="text-xs font-pixel text-slate-300 leading-relaxed">
              Real-time multi-tab leaderboards, live organizer announcements, checkpoint completion badges, and post-game awards!
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

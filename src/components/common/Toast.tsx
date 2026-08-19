import React from 'react';
import { useGame } from '../../context/GameContext';
import { Bell, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast: React.FC = () => {
  const { activeToast, dismissToast } = useGame();

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-20 right-4 z-50 max-w-md w-full"
        >
          <div
            className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-3 ${
              activeToast.urgent
                ? 'bg-rose-950/90 border-rose-500/60 text-rose-100 shadow-rose-900/30'
                : 'bg-indigo-950/90 border-indigo-500/60 text-indigo-100 shadow-indigo-900/30'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${activeToast.urgent ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
              {activeToast.urgent ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5 animate-bounce" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-sm font-heading">{activeToast.title}</h4>
                <span className="text-[10px] opacity-70">{activeToast.createdAt}</span>
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{activeToast.message}</p>
            </div>

            <button
              onClick={dismissToast}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

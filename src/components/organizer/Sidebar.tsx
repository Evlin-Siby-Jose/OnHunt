import React from 'react';
import { LayoutDashboard, Compass, PlusCircle, Layers, Users, Radio, BarChart3, Settings, Sparkles } from 'lucide-react';

export type OrganizerTab = 'dashboard' | 'myhunts' | 'create' | 'templates' | 'teams' | 'live' | 'analytics' | 'settings';

interface SidebarProps {
  activeTab: OrganizerTab;
  setActiveTab: (tab: OrganizerTab) => void;
  onOpenAiModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenAiModal }) => {
  const menuItems: { id: OrganizerTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'myhunts', label: 'My Hunts', icon: <Compass className="w-4 h-4" /> },
    { id: 'create', label: 'Create Hunt', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'templates', label: 'Templates', icon: <Layers className="w-4 h-4" /> },
    { id: 'teams', label: 'Teams', icon: <Users className="w-4 h-4" /> },
    { id: 'live', label: 'Live Games', icon: <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />, badge: 'LIVE' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-b-4 md:border-b-0 md:border-r-4 border-purple-900 p-4 space-y-4 shrink-0">
      {/* Workspace Header */}
      <div className="p-3 rounded-xl bg-slate-950 border-2 border-purple-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-purple-700 border border-purple-400 flex items-center justify-center font-arcade font-bold text-white text-xs">
          ON
        </div>
        <div>
          <span className="block font-arcade text-xs text-white">CREATOR HUB</span>
          <span className="text-[9px] font-pixel text-cyan-300">Canva + Notion Studio</span>
        </div>
      </div>

      {/* AI Quick Button */}
      <button
        onClick={onOpenAiModal}
        className="w-full btn-anais-pink py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-purple-200" /> ✨ AI Creator
      </button>

      {/* Nav List */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-arcade flex items-center justify-between transition-all ${
              activeTab === item.id
                ? 'bg-purple-800 text-white border-2 border-purple-400 shadow-[3px_3px_0px_#000]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-slate-950">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

import React, { useState } from 'react';
import type { Hunt } from '../types/hunt';
import { useGame } from '../context/GameContext';
import { Sidebar } from '../components/organizer/Sidebar';
import type { OrganizerTab } from '../components/organizer/Sidebar';
import { OrganizerDashboard } from '../components/organizer/OrganizerDashboard';
import { MyHuntsView } from '../components/organizer/MyHuntsView';
import { Step1BasicInfo } from '../components/organizer/Step1BasicInfo';
import { Step2ChooseMethod } from '../components/organizer/Step2ChooseMethod';
import { HuntEditor } from '../components/organizer/HuntEditor';
import { ConversationalAICreator } from '../components/organizer/ConversationalAICreator';
import { LiveControlCenter } from '../components/organizer/LiveControlCenter';
import { OrganizerTeamsView } from '../components/organizer/OrganizerTeamsView';
import { PlayerPreviewModal } from '../components/organizer/PlayerPreviewModal';
import { PublishChecklistModal } from '../components/organizer/PublishChecklistModal';
import { ArrowLeft } from 'lucide-react';

interface OrganizerWorkspaceProps {
  onBackToRoleSelect: () => void;
}

export const OrganizerWorkspace: React.FC<OrganizerWorkspaceProps> = ({ onBackToRoleSelect }) => {
  const { hunts, createHunt } = useGame();

  const [activeTab, setActiveTab] = useState<OrganizerTab>('dashboard');
  const [createStep, setCreateStep] = useState<1 | 2 | 'manual' | 'ai'>(1);
  const [basicInfoData, setBasicInfoData] = useState<any>(null);
  
  const [editingHuntId, setEditingHuntId] = useState<string | null>(null);
  const [previewHunt, setPreviewHunt] = useState<Hunt | null>(null);
  const [publishHunt, setPublishHunt] = useState<Hunt | null>(null);

  const handleStartCreate = () => {
    setActiveTab('create');
    setCreateStep(1);
    setEditingHuntId(null);
  };

  const handleStep1Next = (data: any) => {
    setBasicInfoData(data);
    setCreateStep(2);
  };

  const handleAcceptAiHunt = (newHunt: Hunt) => {
    createHunt(newHunt);
    setEditingHuntId(newHunt.id);
    setActiveTab('myhunts');
  };

  const currentHuntForEditing = hunts.find((h) => h.id === editingHuntId) || hunts[0];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] max-w-7xl mx-auto">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setEditingHuntId(null);
        }}
        onOpenAiModal={() => {
          setActiveTab('create');
          setCreateStep('ai');
        }}
      />

      {/* MAIN WORKSPACE CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
        
        {/* TOP WORKSPACE HEADER & SWITCHER */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
          <button onClick={onBackToRoleSelect} className="btn-darwin-orange text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Role Select
          </button>

          <span className="text-xs font-arcade text-purple-300">
            ORGANIZER WORKSPACE • MODE: CREATOR
          </span>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && !editingHuntId && (
          <OrganizerDashboard
            onStartCreate={handleStartCreate}
            onOpenAiModal={() => {
              setActiveTab('create');
              setCreateStep('ai');
            }}
            onSelectTemplate={() => setActiveTab('templates')}
            onStartLiveGame={() => setActiveTab('live')}
            onEditHunt={(id) => {
              setEditingHuntId(id);
              setActiveTab('myhunts');
            }}
          />
        )}

        {/* TAB 2: MY HUNTS */}
        {activeTab === 'myhunts' && !editingHuntId && (
          <MyHuntsView
            onEditHunt={(id) => setEditingHuntId(id)}
            onPreviewHunt={(id) => {
              const target = hunts.find((h) => h.id === id);
              if (target) setPreviewHunt(target);
            }}
            onCreateNew={handleStartCreate}
            onOpenAiModal={() => {
              setActiveTab('create');
              setCreateStep('ai');
            }}
          />
        )}

        {/* EDITING A SPECIFIC HUNT */}
        {editingHuntId && currentHuntForEditing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setEditingHuntId(null)}
                className="btn-darwin-orange text-xs py-1.5 px-3 rounded-lg flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to My Hunts
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewHunt(currentHuntForEditing)}
                  className="btn-penny-yellow text-[10px] py-1.5 px-3 rounded-lg"
                >
                  👁 Preview as Player
                </button>

                <button
                  onClick={() => setPublishHunt(currentHuntForEditing)}
                  className="btn-gumball-cyan text-[10px] py-1.5 px-3 rounded-lg"
                >
                  Publish Checklist
                </button>
              </div>
            </div>

            <HuntEditor huntId={editingHuntId} onBack={() => setEditingHuntId(null)} />
          </div>
        )}

        {/* TAB 3: CREATE HUNT WIZARD */}
        {activeTab === 'create' && !editingHuntId && (
          <>
            {createStep === 1 && (
              <Step1BasicInfo
                initialData={basicInfoData}
                onNext={handleStep1Next}
              />
            )}

            {createStep === 2 && (
              <Step2ChooseMethod
                onBack={() => setCreateStep(1)}
                onSelectManual={() => setCreateStep('manual')}
                onSelectAI={() => setCreateStep('ai')}
              />
            )}

            {createStep === 'manual' && (
              <div className="space-y-4">
                <button onClick={() => setCreateStep(2)} className="btn-darwin-orange text-xs py-1 px-3 rounded-lg flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Method
                </button>
                <HuntEditor huntId={hunts[0]?.id || null} onBack={() => setActiveTab('myhunts')} />
              </div>
            )}

            {createStep === 'ai' && (
              <ConversationalAICreator
                initialBasicInfo={basicInfoData}
                onBack={() => setCreateStep(2)}
                onAcceptHunt={handleAcceptAiHunt}
              />
            )}
          </>
        )}

        {/* TAB 4: TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="gumball-card p-8 rounded-3xl bg-slate-900 border-4 border-cyan-400 space-y-4">
            <h3 className="text-xl font-arcade text-white gumball-text-cyan">📋 READY-MADE QUEST TEMPLATES</h3>
            <p className="text-xs font-pixel text-slate-300">Pick a pre-configured quest template to launch instantly:</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hunts.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-slate-950 border-2 border-slate-800 space-y-2">
                  <h4 className="text-sm font-arcade text-white">{t.title}</h4>
                  <p className="text-xs font-pixel text-slate-300 line-clamp-2">{t.description}</p>
                  <button onClick={() => handleAcceptAiHunt(t)} className="w-full btn-gumball-cyan py-2 rounded-xl text-xs">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TEAMS */}
        {activeTab === 'teams' && (
          <OrganizerTeamsView />
        )}

        {/* TAB 6: LIVE GAMES */}
        {activeTab === 'live' && (
          <LiveControlCenter />
        )}

        {/* TAB 7 & 8: ANALYTICS & SETTINGS */}
        {(activeTab === 'analytics' || activeTab === 'settings') && (
          <div className="gumball-card p-8 rounded-3xl bg-slate-900 border-4 border-purple-500 space-y-3">
            <h3 className="text-xl font-arcade text-white capitalize">{activeTab} Workspace</h3>
            <p className="text-xs font-pixel text-slate-300">
              Manage participant metrics, tournament performance analytics, and platform preferences.
            </p>
          </div>
        )}
      </main>

      {/* MODALS */}
      {previewHunt && (
        <PlayerPreviewModal
          isOpen={!!previewHunt}
          onClose={() => setPreviewHunt(null)}
          hunt={previewHunt}
        />
      )}

      {publishHunt && (
        <PublishChecklistModal
          isOpen={!!publishHunt}
          onClose={() => setPublishHunt(null)}
          hunt={publishHunt}
          onPublishConfirmed={() => setPublishHunt(null)}
        />
      )}
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Hunt } from '../types/hunt';
import type { Team } from '../types/team';
import type { Announcement, Submission, LeaderboardEntry } from '../types/session';
import { StorageService } from '../services/db';
import { syncBus } from '../services/sync';
import type { SyncPayload } from '../services/sync';
import { AIService } from '../services/aiService';

interface GameContextType {
  hunts: Hunt[];
  teams: Team[];
  activeHuntId: string | null;
  activeTeamId: string | null;
  announcements: Announcement[];
  activeToast: Announcement | null;
  dismissToast: () => void;
  setActiveHuntId: (id: string | null) => void;
  setActiveTeamId: (id: string | null) => void;
  
  createHunt: (hunt: Hunt) => void;
  updateHunt: (hunt: Hunt) => void;
  deleteHunt: (huntId: string) => void;
  duplicateHunt: (huntId: string) => void;
  setHuntStatus: (huntId: string, status: Hunt['status']) => void;
  broadcastAnnouncement: (huntId: string, title: string, message: string, urgent?: boolean) => void;
  
  createTeam: (huntId: string, name: string, captainUserId: string, captainName: string, captainAvatar: string) => Team;
  joinTeamByCode: (inviteCode: string, userId: string, userName: string, userAvatar: string) => Team | null;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  transferCaptain: (teamId: string, newCaptainUserId: string) => void;
  removeTeamMember: (teamId: string, memberUserId: string) => void;
  disbandTeam: (teamId: string) => void;
  moveTeamMember: (memberUserId: string, fromTeamId: string, toTeamId: string) => void;

  submitCheckpointAnswer: (teamId: string, checkpointId: string, answer: string) => { success: boolean; message: string; pointsEarned: number };
  unlockHint: (teamId: string, checkpointId: string, hintId: string) => void;
  getLeaderboard: (huntId: string) => LeaderboardEntry[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hunts, setHunts] = useState<Hunt[]>(() => StorageService.getHunts());
  const [teams, setTeams] = useState<Team[]>(() => StorageService.getTeams());
  const [activeHuntId, setActiveHuntId] = useState<string | null>('hunt_pirate_01');
  const [activeTeamId, setActiveTeamId] = useState<string | null>('team_phoenix_01');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeToast, setActiveToast] = useState<Announcement | null>(null);

  useEffect(() => {
    StorageService.saveHunts(hunts);
  }, [hunts]);

  useEffect(() => {
    StorageService.saveTeams(teams);
  }, [teams]);

  useEffect(() => {
    if (activeHuntId) {
      setAnnouncements(StorageService.getAnnouncements(activeHuntId));
    }
  }, [activeHuntId]);

  useEffect(() => {
    const unsubscribe = syncBus.subscribe((payload: SyncPayload) => {
      if (payload.type === 'HUNT_STATUS_CHANGED') {
        setHunts((prev) =>
          prev.map((h) => (h.id === payload.huntId ? { ...h, status: payload.data.status } : h))
        );
      } else if (payload.type === 'ANNOUNCEMENT_BROADCAST' && payload.announcement) {
        if (payload.huntId === activeHuntId) {
          setAnnouncements((prev) => [payload.announcement!, ...prev]);
          setActiveToast(payload.announcement);
        }
      } else if (payload.type === 'TEAM_PROGRESS_UPDATED' || payload.type === 'CHECKPOINT_CLEARED') {
        const updatedTeams = StorageService.getTeams();
        setTeams(updatedTeams);
      }
    });

    return () => unsubscribe();
  }, [activeHuntId]);

  const dismissToast = () => setActiveToast(null);

  const createHunt = (newHunt: Hunt) => {
    const huntWithCode: Hunt = {
      ...newHunt,
      joinCode: newHunt.joinCode || AIService.generateRandomJoinCode(),
    };
    setHunts((prev) => [huntWithCode, ...prev]);
    setActiveHuntId(huntWithCode.id);
  };

  const updateHunt = (updatedHunt: Hunt) => {
    setHunts((prev) => prev.map((h) => (h.id === updatedHunt.id ? updatedHunt : h)));
  };

  const deleteHunt = (huntId: string) => {
    setHunts((prev) => prev.filter((h) => h.id !== huntId));
    if (activeHuntId === huntId) setActiveHuntId(null);
  };

  const duplicateHunt = (huntId: string) => {
    const target = hunts.find((h) => h.id === huntId);
    if (!target) return;
    const duplicated: Hunt = {
      ...target,
      id: `hunt_copy_${Date.now()}`,
      joinCode: AIService.generateRandomJoinCode(),
      title: `${target.title} (Copy)`,
      status: 'draft',
      playCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      checkpoints: target.checkpoints.map((cp) => ({
        ...cp,
        id: `cp_copy_${Date.now()}_${cp.order}`,
        huntId: `hunt_copy_${Date.now()}`,
      }))
    };
    setHunts((prev) => [duplicated, ...prev]);
  };

  const setHuntStatus = (huntId: string, status: Hunt['status']) => {
    setHunts((prev) =>
      prev.map((h) => (h.id === huntId ? { ...h, status, updatedAt: new Date().toISOString() } : h))
    );
    syncBus.publish('HUNT_STATUS_CHANGED', huntId, { status });
  };

  const broadcastAnnouncement = (huntId: string, title: string, message: string, urgent: boolean = false) => {
    const newAnno: Announcement = {
      id: `anno_${Date.now()}`,
      huntId,
      title,
      message,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      urgent,
    };
    StorageService.addAnnouncement(newAnno);
    setAnnouncements((prev) => [newAnno, ...prev]);
    setActiveToast(newAnno);
    syncBus.publish('ANNOUNCEMENT_BROADCAST', huntId, null, newAnno);
  };

  const createTeam = (
    huntId: string,
    name: string,
    captainUserId: string,
    captainName: string,
    captainAvatar: string
  ): Team => {
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      huntId,
      name,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      captainId: captainUserId,
      members: [
        {
          userId: captainUserId,
          name: captainName,
          avatar: captainAvatar,
          isCaptain: true,
          joinedAt: new Date().toISOString(),
        }
      ],
      score: 0,
      currentCheckpointIndex: 0,
      unlockedHints: {},
      completedCheckpoints: [],
      inventory: [],
      startTime: new Date().toISOString(),
      status: 'playing',
    };

    const updated = [newTeam, ...teams];
    setTeams(updated);
    StorageService.saveTeams(updated);
    setActiveTeamId(newTeam.id);
    syncBus.publish('TEAM_PROGRESS_UPDATED', huntId);
    return newTeam;
  };

  const joinTeamByCode = (code: string, userId: string, userName: string, userAvatar: string): Team | null => {
    const cleanCode = code.trim().toUpperCase();

    let targetTeam = teams.find((t) => t.inviteCode.toUpperCase() === cleanCode);

    if (!targetTeam) {
      const targetHunt = hunts.find((h) => h.joinCode && h.joinCode.toUpperCase() === cleanCode);
      if (targetHunt) {
        targetTeam = teams.find((t) => t.huntId === targetHunt.id);
        if (!targetTeam) {
          targetTeam = createTeam(targetHunt.id, `${userName}'s Squad`, userId, userName, userAvatar);
          return targetTeam;
        }
      }
    }

    if (!targetTeam) return null;

    if (targetTeam.members.some((m) => m.userId === userId)) {
      setActiveTeamId(targetTeam.id);
      setActiveHuntId(targetTeam.huntId);
      return targetTeam;
    }

    const updatedTeam: Team = {
      ...targetTeam,
      members: [
        ...targetTeam.members,
        { userId, name: userName, avatar: userAvatar, isCaptain: false, joinedAt: new Date().toISOString() }
      ]
    };

    const updatedTeams = teams.map((t) => (t.id === targetTeam!.id ? updatedTeam : t));
    setTeams(updatedTeams);
    StorageService.saveTeams(updatedTeams);
    setActiveTeamId(updatedTeam.id);
    setActiveHuntId(updatedTeam.huntId);
    syncBus.publish('TEAM_PROGRESS_UPDATED', targetTeam.huntId);
    return updatedTeam;
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    const updatedTeams = teams.map((t) => (t.id === teamId ? { ...t, ...updates } : t));
    setTeams(updatedTeams);
    StorageService.saveTeams(updatedTeams);
    syncBus.publish('TEAM_PROGRESS_UPDATED', teams.find((t) => t.id === teamId)?.huntId || '');
  };

  const transferCaptain = (teamId: string, newCaptainUserId: string) => {
    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam) return;

    const updatedMembers = targetTeam.members.map((m) => ({
      ...m,
      isCaptain: m.userId === newCaptainUserId,
    }));

    updateTeam(teamId, {
      captainId: newCaptainUserId,
      members: updatedMembers,
    });
  };

  const removeTeamMember = (teamId: string, memberUserId: string) => {
    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam) return;

    const updatedMembers = targetTeam.members.filter((m) => m.userId !== memberUserId);
    updateTeam(teamId, { members: updatedMembers });
  };

  const disbandTeam = (teamId: string) => {
    const targetTeam = teams.find((t) => t.id === teamId);
    const updatedTeams = teams.filter((t) => t.id !== teamId);
    setTeams(updatedTeams);
    StorageService.saveTeams(updatedTeams);
    if (activeTeamId === teamId) setActiveTeamId(null);
    syncBus.publish('TEAM_PROGRESS_UPDATED', targetTeam?.huntId || '');
  };

  const moveTeamMember = (memberUserId: string, fromTeamId: string, toTeamId: string) => {
    const fromTeam = teams.find((t) => t.id === fromTeamId);
    const toTeam = teams.find((t) => t.id === toTeamId);
    if (!fromTeam || !toTeam) return;

    const targetMember = fromTeam.members.find((m) => m.userId === memberUserId);
    if (!targetMember) return;

    const updatedFromMembers = fromTeam.members.filter((m) => m.userId !== memberUserId);
    const updatedToMembers = [...toTeam.members, { ...targetMember, isCaptain: false }];

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === fromTeamId) return { ...t, members: updatedFromMembers };
        if (t.id === toTeamId) return { ...t, members: updatedToMembers };
        return t;
      })
    );
    StorageService.saveTeams(StorageService.getTeams());
    syncBus.publish('TEAM_PROGRESS_UPDATED', fromTeam.huntId);
  };

  const submitCheckpointAnswer = (
    teamId: string,
    checkpointId: string,
    answer: string
  ): { success: boolean; message: string; pointsEarned: number } => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return { success: false, message: 'Team not found', pointsEarned: 0 };

    const hunt = hunts.find((h) => h.id === team.huntId);
    if (!hunt) return { success: false, message: 'Hunt not found', pointsEarned: 0 };

    const checkpoint = hunt.checkpoints.find((cp) => cp.id === checkpointId);
    if (!checkpoint) return { success: false, message: 'Checkpoint not found', pointsEarned: 0 };

    const isMatch = answer.trim().toUpperCase() === checkpoint.correctAnswer.trim().toUpperCase();

    if (!isMatch) {
      return { success: false, message: 'Incorrect answer! Try again or request a hint.', pointsEarned: 0 };
    }

    if (team.completedCheckpoints.includes(checkpointId)) {
      return { success: true, message: 'Already completed this checkpoint!', pointsEarned: 0 };
    }

    const hintIdsUnlocked = team.unlockedHints[checkpointId] || [];
    let hintPenaltyTotal = 0;
    checkpoint.hints.forEach((h) => {
      if (hintIdsUnlocked.includes(h.id)) {
        hintPenaltyTotal += h.penaltyPoints;
      }
    });

    const netPoints = Math.max(10, checkpoint.rewardPoints - hintPenaltyTotal);
    const isLastCheckpoint = team.completedCheckpoints.length + 1 >= hunt.checkpoints.length;

    const newInventory = [...(team.inventory || [])];
    if (checkpoint.rewardItem && !newInventory.some((i) => i.id === checkpoint.rewardItem?.id)) {
      newInventory.push(checkpoint.rewardItem);
    }

    const updatedTeam: Team = {
      ...team,
      score: team.score + netPoints,
      currentCheckpointIndex: isLastCheckpoint ? team.currentCheckpointIndex : team.currentCheckpointIndex + 1,
      completedCheckpoints: [...team.completedCheckpoints, checkpointId],
      inventory: newInventory,
      status: isLastCheckpoint ? 'completed' : 'playing',
      endTime: isLastCheckpoint ? new Date().toISOString() : team.endTime,
    };

    const updatedTeams = teams.map((t) => (t.id === teamId ? updatedTeam : t));
    setTeams(updatedTeams);
    StorageService.saveTeams(updatedTeams);

    const submission: Submission = {
      id: `sub_${Date.now()}`,
      teamId,
      teamName: team.name,
      checkpointId,
      answerSubmitted: answer,
      isCorrect: true,
      pointsEarned: netPoints,
      submittedAt: new Date().toISOString(),
    };
    const subs = StorageService.getSubmissions();
    StorageService.saveSubmissions([submission, ...subs]);

    syncBus.publish('CHECKPOINT_CLEARED', hunt.id, { teamName: team.name, checkpointTitle: checkpoint.title, netPoints });

    return {
      success: true,
      message: `Correct! You cleared "${checkpoint.title}" and earned ${netPoints} points!`,
      pointsEarned: netPoints,
    };
  };

  const unlockHint = (teamId: string, checkpointId: string, hintId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;

    const currentUnlocked = team.unlockedHints[checkpointId] || [];
    if (currentUnlocked.includes(hintId)) return;

    const updatedTeam: Team = {
      ...team,
      unlockedHints: {
        ...team.unlockedHints,
        [checkpointId]: [...currentUnlocked, hintId],
      }
    };

    const updatedTeams = teams.map((t) => (t.id === teamId ? updatedTeam : t));
    setTeams(updatedTeams);
    StorageService.saveTeams(updatedTeams);
  };

  const getLeaderboard = useCallback((huntId: string): LeaderboardEntry[] => {
    const hunt = hunts.find((h) => h.id === huntId);
    const totalCps = hunt ? hunt.checkpoints.length : 1;

    const huntTeams = teams.filter((t) => t.huntId === huntId);

    const entries: LeaderboardEntry[] = huntTeams.map((team) => {
      const startMs = team.startTime ? new Date(team.startTime).getTime() : Date.now();
      const endMs = team.endTime ? new Date(team.endTime).getTime() : Date.now();
      const elapsedSec = Math.floor((endMs - startMs) / 1000);

      return {
        rank: 0,
        teamId: team.id,
        teamName: team.name,
        score: team.score,
        completedCheckpointsCount: team.completedCheckpoints.length,
        totalCheckpoints: totalCps,
        timeElapsedSeconds: elapsedSec,
        status: team.status === 'completed' ? 'completed' : 'playing',
      };
    });

    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.completedCheckpointsCount !== a.completedCheckpointsCount) return b.completedCheckpointsCount - a.completedCheckpointsCount;
      return a.timeElapsedSeconds - b.timeElapsedSeconds;
    });

    return entries.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [hunts, teams]);

  return (
    <GameContext.Provider
      value={{
        hunts,
        teams,
        activeHuntId,
        activeTeamId,
        announcements,
        activeToast,
        dismissToast,
        setActiveHuntId,
        setActiveTeamId,
        createHunt,
        updateHunt,
        deleteHunt,
        duplicateHunt,
        setHuntStatus,
        broadcastAnnouncement,
        createTeam,
        joinTeamByCode,
        updateTeam,
        transferCaptain,
        removeTeamMember,
        disbandTeam,
        moveTeamMember,
        submitCheckpointAnswer,
        unlockHint,
        getLeaderboard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

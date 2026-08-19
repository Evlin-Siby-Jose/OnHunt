import type { InventoryItem } from './hunt';

export interface TeamMember {
  userId: string;
  name: string;
  avatar: string;
  isCaptain: boolean;
  joinedAt: string;
}

export interface Team {
  id: string;
  huntId: string;
  name: string;
  inviteCode: string;
  captainId: string;
  members: TeamMember[];
  score: number;
  currentCheckpointIndex: number;
  unlockedHints: Record<string, string[]>; // checkpointId -> hintIds[]
  revealedAnswerCheckpointIds?: string[];
  completedCheckpoints: string[]; // checkpointIds
  inventory: InventoryItem[]; // Backpack collected items
  startTime?: string;
  endTime?: string;
  status: 'lobby' | 'playing' | 'completed';
}

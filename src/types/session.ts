export interface Submission {
  id: string;
  teamId: string;
  teamName: string;
  checkpointId: string;
  answerSubmitted: string;
  isCorrect: boolean;
  pointsEarned: number;
  submittedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  score: number;
  completedCheckpointsCount: number;
  totalCheckpoints: number;
  timeElapsedSeconds: number;
  status: 'playing' | 'completed';
}

export interface Announcement {
  id: string;
  huntId: string;
  title: string;
  message: string;
  createdAt: string;
  urgent: boolean;
}

export interface AwardBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface GameSession {
  huntId: string;
  status: 'draft' | 'scheduled' | 'live' | 'completed';
  startedAt?: string;
  pausedAt?: string;
  endedAt?: string;
  announcements: Announcement[];
}

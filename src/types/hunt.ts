export type HuntTheme = 'gumball' | 'cyberpunk' | 'fantasy' | 'mystery' | 'pirate' | 'space' | 'detective' | 'horror' | 'adventure' | 'modern';
export type HuntDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeType = 'text_password' | 'qr_code' | 'mcq' | 'image_clue' | 'photo' | 'gps' | 'puzzle';
export type HuntStatus = 'draft' | 'scheduled' | 'live' | 'completed';

export interface Hint {
  id: string;
  order: number;
  text: string;
  penaltyPoints: number;
  isFree?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string; // Emoji or Icon identifier e.g. 🗝, 📜, 💎, 🔮
  description: string;
}

export interface Checkpoint {
  id: string;
  huntId: string;
  order: number;
  title: string;
  storyText: string;
  dialogueSpeaker?: string;
  clueText: string;
  clueImageUrl?: string;
  clueType: ChallengeType;
  qrCodeData?: string;
  correctAnswer: string;
  mcqOptions?: string[];
  puzzleData?: any;
  hints: Hint[];
  rewardPoints: number;
  penaltyPoints: number;
  maxAttempts?: number;
  rewardItem?: InventoryItem; // Collectable item awarded upon completion
  gpsCoordinates?: { lat: number; lng: number; radiusMeters: number; destinationName?: string };
}

export interface PublishChecklist {
  detailsComplete: boolean;
  checkpointsComplete: boolean;
  answersConfigured: boolean;
  teamsConfigured: boolean;
  timerConfigured: boolean;
}

export interface Hunt {
  id: string;
  joinCode: string; // e.g. ONHUNT-7X42 or GUMBALL
  organizerId: string;
  organizerName: string;
  title: string;
  description: string;
  coverImage: string;
  theme: HuntTheme;
  targetAudience?: 'Kids' | 'Students' | 'Adults' | 'Corporate';
  timeLimitMinutes: number;
  maxTeamSize: number;
  difficulty: HuntDifficulty;
  visibility: 'public' | 'private';
  status: HuntStatus;
  checkpoints: Checkpoint[];
  createdAt: string;
  updatedAt: string;
  lastEdited?: string;
  playCount: number;
  rating: number;
  aiGenerated?: boolean;
  aiPrompt?: string;
  publishChecklist?: PublishChecklist;
}

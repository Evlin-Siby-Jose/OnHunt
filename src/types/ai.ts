import type { HuntTheme, HuntDifficulty } from './hunt';

export interface AIHuntGenerateRequest {
  topic: string;
  theme: HuntTheme;
  difficulty: HuntDifficulty;
  checkpointCount: number;
  timeLimitMinutes: number;
  targetAudience?: string;
}

export interface AIClueGenerateRequest {
  storyContext: string;
  answerTarget: string;
  theme: HuntTheme;
  difficulty: HuntDifficulty;
}

export interface AIHintGenerateRequest {
  clueText: string;
  correctAnswer: string;
  level: number;
}

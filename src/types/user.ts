export type UserRole = 'organizer' | 'player' | 'captain' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  activeMode: 'organizer' | 'player';
  xp: number;
  level: number;
  huntsCreated: number;
  huntsCompleted: number;
  joinedAt: string;
}

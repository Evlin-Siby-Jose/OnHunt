import type { Hunt } from '../types/hunt';
import type { Team } from '../types/team';
import type { UserProfile } from '../types/user';
import type { Submission, Announcement } from '../types/session';

const HUNTS_STORAGE_KEY = 'onhunt_hunts_v3';
const TEAMS_STORAGE_KEY = 'onhunt_teams_v3';
const USER_STORAGE_KEY = 'onhunt_user_v3';
const SUBMISSIONS_STORAGE_KEY = 'onhunt_submissions_v3';
const ANNOUNCEMENTS_STORAGE_KEY = 'onhunt_announcements_v3';

export const INITIAL_USER: UserProfile = {
  id: 'usr_organizer_01',
  name: 'Gumball Watterson',
  email: 'gumball@elmore.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'organizer',
  activeMode: 'organizer',
  xp: 3200,
  level: 6,
  huntsCreated: 5,
  huntsCompleted: 15,
  joinedAt: '2026-01-15',
};

export const SEED_HUNTS: Hunt[] = [
  {
    id: 'hunt_pirate_01',
    joinCode: 'ONHUNT-7X42',
    organizerId: 'usr_organizer_01',
    organizerName: 'Gumball Watterson',
    title: 'Curse of Skull Rock: Pirate Treasure',
    description: 'Follow the star chart, decipher ancient sea runes, collect Blackbeard\'s lost artifacts, and uncover the chest of doubloons!',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    theme: 'pirate',
    targetAudience: 'Students',
    timeLimitMinutes: 60,
    maxTeamSize: 4,
    difficulty: 'medium',
    visibility: 'public',
    status: 'live',
    playCount: 340,
    rating: 4.9,
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-08-19T09:00:00Z',
    lastEdited: '10 mins ago',
    publishChecklist: {
      detailsComplete: true,
      checkpointsComplete: true,
      answersConfigured: true,
      teamsConfigured: true,
      timerConfigured: true,
    },
    checkpoints: [
      {
        id: 'cp_p_01',
        huntId: 'hunt_pirate_01',
        order: 1,
        title: 'The Abandoned Library Vault',
        storyText: 'The old sea map leads your squad deeper into the abandoned library vault. A thick dust covers the brass manuscript table.',
        dialogueSpeaker: 'Captain Blackbeard',
        clueType: 'text_password',
        clueText: 'Where knowledge sleeps behind endless doors, your next secret waits among the words. Solve: What direction is opposite to North-East?',
        correctAnswer: 'SOUTH-WEST',
        rewardPoints: 100,
        penaltyPoints: 10,
        rewardItem: {
          id: 'item_map_piece',
          name: '📜 Torn Map Fragment',
          icon: '📜',
          description: 'A yellowed parchment snippet detailing the northern reef coordinates.'
        },
        hints: [
          { id: 'h_p1_1', order: 1, text: 'Opposite of North is South, opposite of East is West.', penaltyPoints: 0, isFree: true },
          { id: 'h_p1_2', order: 2, text: 'Answer format: SOUTH-WEST', penaltyPoints: 20 },
          { id: 'h_p1_3', order: 3, text: 'Exact Answer: SOUTH-WEST', penaltyPoints: 50 }
        ]
      },
      {
        id: 'cp_p_02',
        huntId: 'hunt_pirate_01',
        order: 2,
        title: 'The Optical Sea Runes Lock',
        storyText: 'Outside the quarterdeck, a glowing optical QR sea rune is embedded into the iron doorframe.',
        dialogueSpeaker: 'Quartermaster Sally',
        clueType: 'qr_code',
        clueText: 'Scan the optical QR rune token embedded near the captain\'s quarters.',
        qrCodeData: 'ONHUNT-PIRATE-RUNE-99',
        correctAnswer: 'ONHUNT-PIRATE-RUNE-99',
        rewardPoints: 150,
        penaltyPoints: 15,
        rewardItem: {
          id: 'item_key',
          name: '🗝 Ancient Brass Key',
          icon: '🗝',
          description: 'Heavy iron key forged in Port Royal to unlock Blackbeard\'s chest.'
        },
        hints: [
          { id: 'h_p2_1', order: 1, text: 'Point your camera at the QR code token.', penaltyPoints: 0, isFree: true },
          { id: 'h_p2_2', order: 2, text: 'Payload: ONHUNT-PIRATE-RUNE-99', penaltyPoints: 20 }
        ]
      },
      {
        id: 'cp_p_03',
        huntId: 'hunt_pirate_01',
        order: 3,
        title: 'The Celestial Star Navigation',
        storyText: 'Standing under the night sky, you must choose the correct star constellation used by ancient mariners.',
        dialogueSpeaker: 'Gumball Navigator',
        clueType: 'mcq',
        clueText: 'Which celestial constellation points directly toward True North in the Northern Hemisphere?',
        mcqOptions: [
          'Orion\'s Belt',
          'Ursa Minor (Polaris)',
          'Southern Cross',
          'Cassiopeia'
        ],
        correctAnswer: 'Ursa Minor (Polaris)',
        rewardPoints: 200,
        penaltyPoints: 20,
        rewardItem: {
          id: 'item_crystal',
          name: '💎 Glowing Sea Crystal',
          icon: '💎',
          description: 'Luminescent gemstone that reveals hidden door inscriptions.'
        },
        hints: [
          { id: 'h_p3_1', order: 1, text: 'It contains the famous North Star (Polaris).', penaltyPoints: 0, isFree: true },
          { id: 'h_p3_2', order: 2, text: 'Option starts with Ursa...', penaltyPoints: 20 }
        ]
      }
    ]
  },
  {
    id: 'hunt_gumball_01',
    joinCode: 'GUMBALL',
    organizerId: 'usr_organizer_01',
    organizerName: 'Gumball Watterson',
    title: 'Elmore High School Mayhem Quest',
    description: 'Help Gumball & Darwin locate Mr. Small\'s missing rainbow crystal before Principal Brown catches them!',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    theme: 'gumball',
    targetAudience: 'Kids',
    timeLimitMinutes: 40,
    maxTeamSize: 4,
    difficulty: 'easy',
    visibility: 'public',
    status: 'live',
    playCount: 250,
    rating: 5.0,
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-08-19T09:00:00Z',
    lastEdited: '1 hour ago',
    publishChecklist: {
      detailsComplete: true,
      checkpointsComplete: true,
      answersConfigured: true,
      teamsConfigured: true,
      timerConfigured: true,
    },
    checkpoints: [
      {
        id: 'cp_gb_01',
        huntId: 'hunt_gumball_01',
        order: 1,
        title: 'The Cafeteria Receipt Cipher',
        storyText: 'Darwin knocked over the Joyful Burger tray! Unscramble the order receipt code.',
        dialogueSpeaker: 'Darwin Watterson',
        clueType: 'text_password',
        clueText: 'Unscramble Darwin\'s favorite dish: "F I S H S T I C K S"',
        correctAnswer: 'FISHSTICKS',
        rewardPoints: 100,
        penaltyPoints: 10,
        rewardItem: {
          id: 'item_orb',
          name: '🔮 Mystery Elmore Orb',
          icon: '🔮',
          description: 'Magical orb that hums with cartoon energy.'
        },
        hints: [
          { id: 'h_gb_1_1', order: 1, text: 'Darwin is a goldfish who loves these crispy treats!', penaltyPoints: 0, isFree: true }
        ]
      }
    ]
  }
];

export const SEED_TEAMS: Team[] = [
  {
    id: 'team_phoenix_01',
    huntId: 'hunt_pirate_01',
    name: 'Team Phoenix',
    inviteCode: 'ONHUNT-7X42',
    captainId: 'usr_organizer_01',
    members: [
      { userId: 'usr_organizer_01', name: 'Gumball Watterson', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', isCaptain: true, joinedAt: '2026-08-19T09:10:00Z' },
      { userId: 'usr_player_02', name: 'Darwin Watterson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', isCaptain: false, joinedAt: '2026-08-19T09:12:00Z' }
    ],
    score: 720,
    currentCheckpointIndex: 1,
    unlockedHints: { 'cp_p_01': ['h_p1_1'] },
    completedCheckpoints: ['cp_p_01'],
    inventory: [
      { id: 'item_map_piece', name: '📜 Torn Map Fragment', icon: '📜', description: 'A yellowed parchment snippet.' }
    ],
    startTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: 'playing'
  }
];

export class StorageService {
  static getHunts(): Hunt[] {
    const raw = localStorage.getItem(HUNTS_STORAGE_KEY);
    if (!raw) {
      this.saveHunts(SEED_HUNTS);
      return SEED_HUNTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_HUNTS;
    }
  }

  static saveHunts(hunts: Hunt[]): void {
    localStorage.setItem(HUNTS_STORAGE_KEY, JSON.stringify(hunts));
  }

  static getTeams(): Team[] {
    const raw = localStorage.getItem(TEAMS_STORAGE_KEY);
    if (!raw) {
      this.saveTeams(SEED_TEAMS);
      return SEED_TEAMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_TEAMS;
    }
  }

  static saveTeams(teams: Team[]): void {
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  }

  static getUser(): UserProfile {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      this.saveUser(INITIAL_USER);
      return INITIAL_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USER;
    }
  }

  static saveUser(user: UserProfile): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  static getSubmissions(): Submission[] {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static saveSubmissions(submissions: Submission[]): void {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
  }

  static getAnnouncements(huntId: string): Announcement[] {
    const raw = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
    const list: Announcement[] = raw ? JSON.parse(raw) : [];
    return list.filter((a) => a.huntId === huntId);
  }

  static addAnnouncement(announcement: Announcement): void {
    const raw = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
    const list: Announcement[] = raw ? JSON.parse(raw) : [];
    list.unshift(announcement);
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(list));
  }
}

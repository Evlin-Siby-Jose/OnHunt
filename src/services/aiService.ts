import type { AIHuntGenerateRequest, AIClueGenerateRequest } from '../types/ai';
import type { Hunt, Checkpoint } from '../types/hunt';

export class AIService {
  /**
   * Helper to generate a random 6-character uppercase Join Code for every hunt event!
   */
  static generateRandomJoinCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  static async generateHunt(request: AIHuntGenerateRequest, organizerId: string, organizerName: string): Promise<Hunt> {
    await new Promise((res) => setTimeout(res, 1800));

    const timestamp = Date.now();
    const huntId = `hunt_ai_${timestamp}`;
    const joinCode = this.generateRandomJoinCode();
    const checkpoints: Checkpoint[] = [];

    const themesMap: Record<string, { storyPrefix: string; cover: string }> = {
      gumball: {
        storyPrefix: 'In the colorful cartoon town of Elmore, an absurd chaotic adventure begins!',
        cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      },
      cyberpunk: {
        storyPrefix: 'In the illuminated undercity, cyber-agents intercept a rogue data packet.',
        cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      },
      fantasy: {
        storyPrefix: 'Deep within the ancient Whispering Woods, a forgotten elemental rune glows.',
        cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      },
      mystery: {
        storyPrefix: 'Rain falls on the cobble streets of Old Town as you discover a locked leather journal.',
        cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
      },
      pirate: {
        storyPrefix: 'Salt spray hits your face as the captain pulls out an aged parchment map.',
        cover: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
      },
      space: {
        storyPrefix: 'Orbital Station Zenith reports a signal anomaly coming from Sector 4.',
        cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      },
      modern: {
        storyPrefix: 'Welcome to the tech innovation challenge! Your first clue lies within the main atrium.',
        cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      }
    };

    const selectedTheme = themesMap[request.theme] || themesMap.gumball;

    for (let i = 1; i <= request.checkpointCount; i++) {
      if (i === 1) {
        checkpoints.push({
          id: `cp_ai_${timestamp}_1`,
          huntId,
          order: 1,
          title: `Checkpoint 1: The Initiation Clue (${request.topic})`,
          storyText: `${selectedTheme.storyPrefix} Your team must decrypt the introductory master code.`,
          clueType: 'text_password',
          clueText: `Solve the entry code cipher: What is the primary keyword for ${request.topic}? (Answer: SEARCH)`,
          correctAnswer: 'SEARCH',
          rewardPoints: 100,
          penaltyPoints: 10,
          hints: [
            { id: `h_${timestamp}_1_1`, order: 1, text: '6-letter word starting with S and ending with H', penaltyPoints: 15 },
            { id: `h_${timestamp}_1_2`, order: 2, text: 'Word: SEARCH', penaltyPoints: 25 }
          ]
        });
      } else if (i === 2) {
        checkpoints.push({
          id: `cp_ai_${timestamp}_2`,
          huntId,
          order: 2,
          title: `Checkpoint 2: Optical Scanner Beacon`,
          storyText: 'The pathway opens up into a high-security chamber requiring physical visual verification.',
          clueType: 'qr_code',
          clueText: `Locate and scan the QR verification token code for ${request.topic}.`,
          qrCodeData: `ONHUNT-AI-PASS-${request.topic.toUpperCase().replace(/\s+/g, '-')}-2026`,
          correctAnswer: `ONHUNT-AI-PASS-${request.topic.toUpperCase().replace(/\s+/g, '-')}-2026`,
          rewardPoints: 150,
          penaltyPoints: 15,
          hints: [
            { id: `h_${timestamp}_2_1`, order: 1, text: 'Scan the checkpoint QR optical code', penaltyPoints: 20 }
          ]
        });
      } else {
        checkpoints.push({
          id: `cp_ai_${timestamp}_${i}`,
          huntId,
          order: i,
          title: `Checkpoint ${i}: Knowledge Assessment`,
          storyText: 'You reach the inner sanctum. Answer the knowledge challenge correctly to secure victory.',
          clueType: 'mcq',
          clueText: `Which fundamental principle is central to ${request.topic}?`,
          mcqOptions: [
            'Scalable Modular Architecture',
            'Static Monolithic State',
            'Synchronous Polling Loops',
            'Unencrypted Open Data'
          ],
          correctAnswer: 'Scalable Modular Architecture',
          rewardPoints: 200,
          penaltyPoints: 20,
          hints: [
            { id: `h_${timestamp}_${i}_1`, order: 1, text: 'Think about best practices in software design', penaltyPoints: 25 }
          ]
        });
      }
    }

    return {
      id: huntId,
      joinCode,
      organizerId,
      organizerName,
      title: `Quest: ${request.topic}`,
      description: `An exciting ${request.difficulty} treasure hunt themed in ${request.theme} style centered on ${request.topic}.`,
      coverImage: selectedTheme.cover,
      theme: request.theme,
      timeLimitMinutes: request.timeLimitMinutes,
      maxTeamSize: 4,
      difficulty: request.difficulty,
      visibility: 'public',
      status: 'draft',
      playCount: 0,
      rating: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      checkpoints,
      aiGenerated: true,
      aiPrompt: `Topic: ${request.topic}, Theme: ${request.theme}, Difficulty: ${request.difficulty}`
    };
  }

  static async generateClueText(request: AIClueGenerateRequest): Promise<{ clueText: string; hints: string[] }> {
    await new Promise((res) => setTimeout(res, 800));
    return {
      clueText: `AI Generated Clue [${request.theme.toUpperCase()}]: Decrypt the target symbol matching "${request.answerTarget}".`,
      hints: [
        `Hint 1: It relates directly to ${request.answerTarget.substring(0, 2)}...`,
        `Hint 2: Exact term is ${request.answerTarget}`
      ]
    };
  }
}

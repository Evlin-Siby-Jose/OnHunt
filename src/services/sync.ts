import type { Announcement } from '../types/session';

export type SyncEventType = 
  | 'HUNT_STATUS_CHANGED'
  | 'LEADERBOARD_UPDATED'
  | 'ANNOUNCEMENT_BROADCAST'
  | 'CHECKPOINT_CLEARED'
  | 'TEAM_PROGRESS_UPDATED';

export interface SyncPayload {
  type: SyncEventType;
  huntId: string;
  data?: any;
  announcement?: Announcement;
  timestamp: number;
}

class RealtimeSyncBus {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(payload: SyncPayload) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('onhunt_realtime_sync_channel');
      this.channel.onmessage = (event: MessageEvent<SyncPayload>) => {
        this.notifyListeners(event.data);
      };
    }
  }

  public subscribe(callback: (payload: SyncPayload) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public publish(type: SyncEventType, huntId: string, data?: any, announcement?: Announcement): void {
    const payload: SyncPayload = {
      type,
      huntId,
      data,
      announcement,
      timestamp: Date.now(),
    };
    
    if (this.channel) {
      this.channel.postMessage(payload);
    }
    
    this.notifyListeners(payload);
  }

  private notifyListeners(payload: SyncPayload): void {
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (err) {
        console.error('Error in sync listener:', err);
      }
    });
  }
}

export const syncBus = new RealtimeSyncBus();

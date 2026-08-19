import QRCode from 'qrcode';

export interface QRValidationResult {
  valid: boolean;
  type?: 'join' | 'checkpoint' | 'unknown';
  error?: string;
  joinCode?: string;
  huntId?: string;
  checkpointId?: string;
}

export class QRService {
  /**
   * Generates a Hunt Join QR Payload: ONHUNT-JOIN-<joinCode>
   */
  static generateHuntJoinQRPayload(joinCode: string): string {
    return `ONHUNT-JOIN-${joinCode.trim().toUpperCase()}`;
  }

  /**
   * Generates a Checkpoint QR Payload: ONHUNT-CP-<huntId>-<checkpointId>
   */
  static generateCheckpointQRPayload(huntId: string, checkpointId: string): string {
    return `ONHUNT-CP-${huntId}-${checkpointId}`;
  }

  /**
   * Generates Data URL image string for QR code rendering
   */
  static async generateDataURL(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
    } catch (err) {
      console.error('Failed to generate QR data URL:', err);
      return '';
    }
  }

  /**
   * Parses and validates scanned QR text against context requirements:
   * Mode: 'join' (expects ONHUNT-JOIN-*) or 'checkpoint' (expects ONHUNT-CP-*)
   */
  static parseAndValidateQR(
    scannedText: string,
    context: {
      mode: 'join' | 'checkpoint';
      currentHuntId?: string;
      currentCheckpointId?: string;
    }
  ): QRValidationResult {
    const raw = scannedText.trim();

    if (!raw) {
      return { valid: false, error: 'Empty QR code scanned.' };
    }

    // Check if it's a Hunt Join QR
    if (raw.startsWith('ONHUNT-JOIN-')) {
      const joinCode = raw.replace('ONHUNT-JOIN-', '').trim();

      if (context.mode === 'checkpoint') {
        return {
          valid: false,
          type: 'join',
          error: "This is a Hunt Join QR code, not a Checkpoint QR!",
        };
      }

      return {
        valid: true,
        type: 'join',
        joinCode,
      };
    }

    // Check if it's a Checkpoint QR
    if (raw.startsWith('ONHUNT-CP-')) {
      const parts = raw.split('-');
      // Expected format: ONHUNT-CP-<huntId>-<checkpointId>
      if (parts.length < 4) {
        return { valid: false, error: 'Invalid OnHunt Checkpoint QR code format.' };
      }

      const huntId = parts[2];
      const checkpointId = parts.slice(3).join('-');

      if (context.mode === 'join') {
        return {
          valid: false,
          type: 'checkpoint',
          error: "This is a Checkpoint QR code. Use it inside an active game!",
        };
      }

      // Checkpoint mode validations
      if (context.currentHuntId && huntId !== context.currentHuntId) {
        return {
          valid: false,
          type: 'checkpoint',
          error: "This QR code belongs to a different hunt.",
        };
      }

      if (context.currentCheckpointId && checkpointId !== context.currentCheckpointId) {
        return {
          valid: false,
          type: 'checkpoint',
          error: "Wrong QR code. Keep searching!",
        };
      }

      return {
        valid: true,
        type: 'checkpoint',
        huntId,
        checkpointId,
      };
    }

    // Legacy or custom raw code fallback for seed data compatibility
    if (context.mode === 'join') {
      return {
        valid: true,
        type: 'join',
        joinCode: raw.toUpperCase(),
      };
    }

    if (context.mode === 'checkpoint') {
      if (context.currentCheckpointId && raw !== context.currentCheckpointId) {
        return {
          valid: false,
          error: "Wrong QR code. Keep searching!",
        };
      }
      return {
        valid: true,
        type: 'checkpoint',
      };
    }

    return { valid: false, error: 'Invalid OnHunt QR code.' };
  }
}

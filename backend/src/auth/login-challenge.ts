import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

export const LOGIN_CHALLENGE_TTL_MS = 5 * 60 * 1000;

const NONCE_LINE = /^Nonce: ([0-9a-f]{32})\.(\d{1,15})\.([0-9a-f]{64})$/m;

export type LoginChallenge = {
  message: string;
  expiresAt: string;
};

export type CheckedChallenge = {
  nonce: string;
  expiresAt: number;
};

/**
 * Issues and checks the messages a wallet signs to log in.
 *
 * A message carries a random nonce and its expiry, authenticated with an
 * HMAC so the server does not need to store issued challenges. Each nonce
 * is accepted once per process and only until it expires.
 */
export class LoginChallenges {
  private readonly usedNonces = new Map<string, number>();

  constructor(
    private readonly secret: string,
    private readonly ttlMs = LOGIN_CHALLENGE_TTL_MS,
    private readonly now: () => number = Date.now,
  ) {}

  issue(): LoginChallenge {
    const nonce = randomBytes(16).toString('hex');
    const expiresAt = this.now() + this.ttlMs;
    return {
      message: this.format(nonce, expiresAt),
      expiresAt: new Date(expiresAt).toISOString(),
    };
  }

  /**
   * Returns the nonce if `message` is an unexpired, unused challenge issued
   * by this server, otherwise null. Does not mark the nonce as used.
   */
  check(message: string): CheckedChallenge | null {
    if (typeof message !== 'string') return null;
    const match = NONCE_LINE.exec(message);
    if (!match) return null;
    const [, nonce, expiresAtText, mac] = match;
    const expiresAt = Number(expiresAtText);

    const expected = Buffer.from(this.mac(nonce, expiresAt), 'hex');
    if (!timingSafeEqual(expected, Buffer.from(mac, 'hex'))) return null;
    // Only the exact text issued by this server is accepted
    if (message !== this.format(nonce, expiresAt)) return null;

    const now = this.now();
    if (expiresAt <= now || expiresAt - now > this.ttlMs) return null;
    if (this.usedNonces.has(nonce)) return null;
    return { nonce, expiresAt };
  }

  markUsed({ nonce, expiresAt }: CheckedChallenge) {
    const now = this.now();
    for (const [used, usedExpiresAt] of this.usedNonces) {
      if (usedExpiresAt <= now) this.usedNonces.delete(used);
    }
    this.usedNonces.set(nonce, expiresAt);
  }

  private format(nonce: string, expiresAt: number) {
    return [
      'Log in to the DRep campaign platform.',
      '',
      `Nonce: ${nonce}.${expiresAt}.${this.mac(nonce, expiresAt)}`,
      `Expires: ${new Date(expiresAt).toISOString()}`,
    ].join('\n');
  }

  private mac(nonce: string, expiresAt: number) {
    return createHmac('sha256', this.secret)
      .update(`login-challenge:${nonce}.${expiresAt}`)
      .digest('hex');
  }
}

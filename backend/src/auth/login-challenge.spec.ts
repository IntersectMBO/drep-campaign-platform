import { LoginChallenges } from './login-challenge';

const SECRET = 'test-secret-that-is-at-least-32-characters';

describe('LoginChallenges', () => {
  let now: number;
  let challenges: LoginChallenges;

  beforeEach(() => {
    now = Date.UTC(2026, 0, 1);
    challenges = new LoginChallenges(SECRET, 5 * 60 * 1000, () => now);
  });

  it('accepts a challenge it issued', () => {
    const { message, expiresAt } = challenges.issue();

    expect(challenges.check(message)).toEqual({
      nonce: expect.stringMatching(/^[0-9a-f]{32}$/),
      expiresAt: Date.parse(expiresAt),
    });
  });

  it('issues a different nonce each time', () => {
    expect(challenges.issue().message).not.toBe(challenges.issue().message);
  });

  it('rejects a challenge issued with another secret', () => {
    const other = new LoginChallenges(
      `${SECRET}-other`,
      5 * 60 * 1000,
      () => now,
    );

    expect(challenges.check(other.issue().message)).toBeNull();
  });

  it('rejects a challenge with a changed nonce or expiry', () => {
    const { message } = challenges.issue();

    expect(
      challenges.check(
        message.replace(
          /Nonce: (.)/,
          (_, first) => `Nonce: ${first === '0' ? '1' : '0'}`,
        ),
      ),
    ).toBeNull();
    expect(
      challenges.check(
        message.replace(/\.(\d+)\./, (_, expiry) => `.${Number(expiry) + 1}.`),
      ),
    ).toBeNull();
  });

  it('rejects extra text around the challenge', () => {
    const { message } = challenges.issue();

    expect(challenges.check(`${message}\nExtra line`)).toBeNull();
    expect(challenges.check(`Hello\n${message}`)).toBeNull();
  });

  it('rejects an expired challenge', () => {
    const { message } = challenges.issue();
    now += 5 * 60 * 1000;

    expect(challenges.check(message)).toBeNull();
  });

  it('accepts each challenge only once', () => {
    const { message } = challenges.issue();
    const checked = challenges.check(message);
    challenges.markUsed(checked);

    expect(challenges.check(message)).toBeNull();
  });

  it('forgets used challenges once they have expired', () => {
    const first = challenges.issue();
    challenges.markUsed(challenges.check(first.message));
    now += 6 * 60 * 1000;
    const second = challenges.issue();
    challenges.markUsed(challenges.check(second.message));

    expect((challenges as any).usedNonces.size).toBe(1);
  });

  it('rejects input that is not a challenge', () => {
    expect(challenges.check('')).toBeNull();
    expect(challenges.check(undefined)).toBeNull();
    expect(challenges.check('Verify DRep drep1example')).toBeNull();
  });
});

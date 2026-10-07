import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TestWalletKey } from '../../test/test-wallet';
import { AuthService } from './auth.service';

const SECRET = 'test-secret-that-is-at-least-32-characters';

const createService = (secret = SECRET) => {
  const jwtService = new JwtService({
    secret,
    signOptions: { algorithm: 'HS256' },
    verifyOptions: { algorithms: ['HS256'] },
  });
  const configService = new ConfigService({ JWT_SECRET: secret });
  return { service: new AuthService(jwtService, configService), jwtService };
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let stakeKey: TestWalletKey;
  let drepKey: TestWalletKey;

  beforeEach(() => {
    ({ service, jwtService } = createService());
    stakeKey = new TestWalletKey();
    drepKey = new TestWalletKey();
  });

  describe('configuration', () => {
    it('refuses to start without a JWT secret', () => {
      expect(
        () => new AuthService(new JwtService({}), new ConfigService({})),
      ).toThrow(/JWT_SECRET/);
    });

    it('refuses to start with a short JWT secret', () => {
      expect(() => createService('too-short')).toThrow(/32 characters/);
    });
  });

  describe('login', () => {
    it('issues a session for the stake address that signed the challenge', async () => {
      const { message } = service.issueChallenge();

      const result = await service.login({
        message,
        stakeAddress: stakeKey.stakeAddress(),
        stake: stakeKey.signData(message),
      });

      expect(result.stakeAddress).toBe(stakeKey.stakeAddress());
      expect(result.drepId).toBeUndefined();
      const claims = jwtService.decode(result.token);
      expect(claims.sub).toBe(stakeKey.stakeAddress());
      expect(claims.drepId).toBeUndefined();
      expect(claims.exp - claims.iat).toBe(24 * 60 * 60);
    });

    it('adds the DRep id proven by a DRep key signature', async () => {
      const { message } = service.issueChallenge();

      const result = await service.login({
        message,
        stakeAddress: stakeKey.stakeAddress(),
        stake: stakeKey.signData(message),
        drep: drepKey.signData(message),
        expiry: '2 weeks',
      });

      expect(result.drepId).toBe(drepKey.drepId());
      const claims = jwtService.decode(result.token);
      expect(claims.drepId).toBe(drepKey.drepId());
      expect(claims.exp - claims.iat).toBe(14 * 24 * 60 * 60);
      expect(await service.verifyJWT(result.token)).toEqual({
        stakeAddress: stakeKey.stakeAddress(),
        drepId: drepKey.drepId(),
      });
    });

    it('rejects a message that was not issued by the server', async () => {
      const message = 'Verify DRep drep1example';

      await expect(
        service.login({
          message,
          stakeAddress: stakeKey.stakeAddress(),
          stake: stakeKey.signData(message),
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects a signature from a key other than the stake address', async () => {
      const { message } = service.issueChallenge();

      await expect(
        service.login({
          message,
          stakeAddress: new TestWalletKey().stakeAddress(),
          stake: stakeKey.signData(message),
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects a stake signature over another message', async () => {
      const { message } = service.issueChallenge();
      const { message: otherMessage } = service.issueChallenge();

      await expect(
        service.login({
          message,
          stakeAddress: stakeKey.stakeAddress(),
          stake: stakeKey.signData(otherMessage),
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects a DRep signature over another message', async () => {
      const { message } = service.issueChallenge();

      await expect(
        service.login({
          message,
          stakeAddress: stakeKey.stakeAddress(),
          stake: stakeKey.signData(message),
          drep: drepKey.signData(`Verify DRep ${drepKey.drepId()}`),
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('accepts each signed challenge only once', async () => {
      const { message } = service.issueChallenge();
      const payload = {
        message,
        stakeAddress: stakeKey.stakeAddress(),
        stake: stakeKey.signData(message),
      };
      await service.login(payload);

      await expect(service.login(payload)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('keeps the challenge usable after a failed attempt', async () => {
      const { message } = service.issueChallenge();
      await expect(
        service.login({
          message,
          stakeAddress: stakeKey.stakeAddress(),
          stake: new TestWalletKey().signData(message),
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      await expect(
        service.login({
          message,
          stakeAddress: stakeKey.stakeAddress(),
          stake: stakeKey.signData(message),
        }),
      ).resolves.toHaveProperty('token');
    });
  });

  describe('verifyJWT', () => {
    it('rejects tokens signed with another secret', async () => {
      const other = new JwtService({ secret: `${SECRET}-other` });
      const token = await other.signAsync({ sub: stakeKey.stakeAddress() });

      expect(await service.verifyJWT(token)).toBeNull();
    });

    it('rejects expired tokens', async () => {
      const token = await jwtService.signAsync(
        { sub: stakeKey.stakeAddress() },
        { expiresIn: -10 },
      );

      expect(await service.verifyJWT(token)).toBeNull();
    });

    it('rejects unsigned tokens', async () => {
      const encode = (value: object) =>
        Buffer.from(JSON.stringify(value)).toString('base64url');
      const token = `${encode({ alg: 'none', typ: 'JWT' })}.${encode({
        sub: stakeKey.stakeAddress(),
      })}.`;

      expect(await service.verifyJWT(token)).toBeNull();
    });

    it('rejects tokens without a stake address', async () => {
      const token = await jwtService.signAsync({ signature: 'a', key: 'b' });

      expect(await service.verifyJWT(token)).toBeNull();
    });
  });
});

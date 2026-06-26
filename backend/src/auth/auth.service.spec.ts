import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getJwtSecret } from './jwt.config';

const JWT_SECRET = 'test-secret-with-at-least-thirty-two-chars';

function createConfig(overrides: Record<string, string | undefined> = {}) {
  const values = {
    JWT_SECRET,
    ...overrides,
  };

  return {
    get: jest.fn((key: string) => values[key]),
  } as unknown as ConfigService;
}

describe('AuthService', () => {
  it('requires JWT_SECRET to come from configuration', () => {
    expect(() => getJwtSecret(createConfig({ JWT_SECRET: undefined }))).toThrow(
      'JWT_SECRET must be set',
    );
  });

  it('rejects unsupported caller-controlled JWT claims', async () => {
    const service = new AuthService(new JwtService(), createConfig());

    await expect(
      service.login({ signature: 'sig', key: 'key', role: 'admin' }, '10y'),
    ).rejects.toThrow(BadRequestException);
  });

  it('signs only the DRep signature claims used by registration', async () => {
    const service = new AuthService(new JwtService(), createConfig());

    const { token } = await service.login(
      { signature: '  sig  ', key: '  key  ' },
      '60s',
    );
    const decoded = await service.verifyJWT(token);

    expect(decoded).toMatchObject({ signature: 'sig', key: 'key' });
    expect(decoded.role).toBeUndefined();
    expect(decoded.userId).toBeUndefined();
  });

  it('rejects tokens issued before JWT_NOT_BEFORE', async () => {
    const issuedAt = Math.floor(Date.now() / 1000) - 60;
    const token = await new JwtService().signAsync(
      { signature: 'sig', key: 'key', iat: issuedAt },
      { secret: JWT_SECRET, expiresIn: '1h' },
    );
    const service = new AuthService(
      new JwtService(),
      createConfig({ JWT_NOT_BEFORE: String(issuedAt + 1) }),
    );

    await expect(service.verifyJWT(token)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

describe('AuthController', () => {
  it('does not expose an unauthenticated token minting endpoint', async () => {
    const controller = new AuthController();

    await expect(controller.login()).rejects.toThrow(UnauthorizedException);
  });
});

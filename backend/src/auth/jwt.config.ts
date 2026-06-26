import { ConfigService } from '@nestjs/config';

const MIN_JWT_SECRET_LENGTH = 32;

export function getJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');

  if (!secret || secret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be set and at least ${MIN_JWT_SECRET_LENGTH} characters long`,
    );
  }

  return secret;
}

export function getJwtNotBefore(configService: ConfigService): number | null {
  const tokenNotBefore = configService.get<string>('JWT_NOT_BEFORE');
  if (!tokenNotBefore) return null;

  const numericTimestamp = Number(tokenNotBefore);
  if (Number.isFinite(numericTimestamp)) return numericTimestamp;

  const parsedTimestamp = Date.parse(tokenNotBefore);
  if (!Number.isNaN(parsedTimestamp)) {
    return Math.floor(parsedTimestamp / 1000);
  }

  throw new Error('JWT_NOT_BEFORE must be a Unix timestamp or ISO date');
}

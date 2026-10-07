import { ConfigService } from '@nestjs/config';

export const JWT_SECRET_MIN_LENGTH = 32;

/**
 * Secret used to sign session tokens and login challenges, read from the
 * JWT_SECRET environment variable. The application does not start without
 * a secret of at least JWT_SECRET_MIN_LENGTH characters.
 */
export const getJwtSecret = (configService: ConfigService): string => {
  const secret = configService.get<string>('JWT_SECRET');
  if (typeof secret !== 'string' || secret.length < JWT_SECRET_MIN_LENGTH) {
    throw new Error(
      `JWT_SECRET must be set to a random string of at least ${JWT_SECRET_MIN_LENGTH} characters`,
    );
  }
  return secret;
};

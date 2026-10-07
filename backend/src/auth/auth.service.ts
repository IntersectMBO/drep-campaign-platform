import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LOGIN_PERIODS, LoginDto } from 'src/dto';
import { AuthPrincipal } from './auth.principal';
import {
  drepIdFromKeyHash,
  parseStakeAddress,
  verifyDataSignature,
  verifyStakeKeySignature,
} from './data-signature';
import { getJwtSecret } from './jwt-secret';
import { LoginChallenge, LoginChallenges } from './login-challenge';

const DEFAULT_LOGIN_PERIOD = LOGIN_PERIODS['24 hrs'];

type SessionClaims = {
  sub: string;
  drepId?: string;
};

@Injectable()
export class AuthService {
  private readonly challenges: LoginChallenges;

  constructor(
    private jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.challenges = new LoginChallenges(getJwtSecret(configService));
  }

  issueChallenge(): LoginChallenge {
    return this.challenges.issue();
  }

  /**
   * Issues a session token after checking that the wallet signed a fresh
   * challenge with the stake key of `stakeAddress` and, optionally, with its
   * DRep key. The token only carries identities proven by those signatures.
   */
  async login({ message, stakeAddress, stake, drep, expiry }: LoginDto) {
    const challenge = this.challenges.check(message);
    if (!challenge) {
      throw new UnauthorizedException(
        'Login message is invalid or has expired, please try again',
      );
    }
    if (!verifyStakeKeySignature(stake, message, stakeAddress)) {
      throw new UnauthorizedException(
        'Signature does not match the stake address',
      );
    }
    let drepId: string | undefined;
    if (drep) {
      const drepKeyHash = verifyDataSignature(drep, message);
      if (!drepKeyHash) {
        throw new UnauthorizedException('DRep signature could not be verified');
      }
      drepId = drepIdFromKeyHash(drepKeyHash);
    }
    this.challenges.markUsed(challenge);

    const claims: SessionClaims = { sub: stakeAddress.toLowerCase() };
    if (drepId) claims.drepId = drepId;
    const token = await this.jwtService.signAsync(claims, {
      expiresIn: LOGIN_PERIODS[expiry] ?? DEFAULT_LOGIN_PERIOD,
    });
    return { token, stakeAddress: claims.sub, drepId };
  }

  /** The caller identified by a session token, or null if it is not valid. */
  async verifyJWT(token: string): Promise<AuthPrincipal | null> {
    try {
      const claims = await this.jwtService.verifyAsync<SessionClaims>(token);
      if (typeof claims?.sub !== 'string' || !parseStakeAddress(claims.sub)) {
        return null;
      }
      const principal: AuthPrincipal = { stakeAddress: claims.sub };
      if (typeof claims.drepId === 'string') principal.drepId = claims.drepId;
      return principal;
    } catch {
      return null;
    }
  }
}

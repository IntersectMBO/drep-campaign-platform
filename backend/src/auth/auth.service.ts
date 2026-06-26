import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getJwtNotBefore, getJwtSecret } from './jwt.config';

type DrepTokenPayload = {
  signature: string;
  key: string;
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signJWT(payload: DrepTokenPayload, tte: number | string) {
    const accessSecret = getJwtSecret(this.configService);
    return this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: tte as string,
    });
  }

  async verifyJWT(token: string) {
    const accessSecret = getJwtSecret(this.configService);
    const decodedToken = await this.jwtService.verifyAsync(token, {
      secret: accessSecret,
    });

    const tokenNotBefore = getJwtNotBefore(this.configService);
    if (
      tokenNotBefore !== null &&
      typeof decodedToken.iat === 'number' &&
      decodedToken.iat < tokenNotBefore
    ) {
      throw new UnauthorizedException(
        'JWT was issued before the configured rotation timestamp',
      );
    }

    return decodedToken;
  }

  async login(payload: unknown, tte: number | string) {
    const token = await this.signJWT(this.getDrepTokenPayload(payload), tte);
    return { token };
  }

  async verifyLogin(token: string) {
    // should check if there is an existing drep signature in the db. Well this is for dreps who have a profile.
  }

  private getDrepTokenPayload(payload: unknown): DrepTokenPayload {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new BadRequestException('Invalid login payload');
    }

    const { signature, key, ...extraClaims } = payload as Record<string, any>;
    if (Object.keys(extraClaims).length > 0) {
      throw new BadRequestException('Unsupported login claims');
    }

    if (typeof signature !== 'string' || signature.trim().length === 0) {
      throw new BadRequestException('Missing DRep signature');
    }

    if (typeof key !== 'string' || key.trim().length === 0) {
      throw new BadRequestException('Missing DRep signature key');
    }

    return {
      signature: signature.trim(),
      key: key.trim(),
    };
  }
}

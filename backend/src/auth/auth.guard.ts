import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { IS_PUBLIC_KEY } from './auth.principal';

// Methods that only read data stay available without a session
const READ_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Requires a valid session token (`Authorization: Bearer <token>`) on every
 * state-changing request, unless the route is marked with @Public().
 * The verified caller is available to handlers through @AuthUser().
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') return true;
    const request = context.switchToHttp().getRequest();
    if (READ_METHODS.has(request.method)) return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const [scheme, token] = (request.headers?.authorization ?? '').split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Login required');
    }
    const principal = await this.authService.verifyJWT(token);
    if (!principal) {
      throw new UnauthorizedException('Session expired, please log in again');
    }
    request.user = principal;
    return true;
  }
}

import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';

/**
 * The verified caller of a request, taken from the session token.
 * `stakeAddress` is always present; `drepId` (CIP-105) only when the login
 * included a signature made with the wallet's DRep key.
 */
export type AuthPrincipal = {
  stakeAddress: string;
  drepId?: string;
};

export const IS_PUBLIC_KEY = 'isPublic';

/** Allows a state-changing route to be called without a session. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** Injects the verified caller set by the auth guard. */
export const AuthUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthPrincipal =>
    context.switchToHttp().getRequest().user,
);

/** DRep id of the caller, or 403 when the session has no DRep identity. */
export const requireDRepId = (principal?: AuthPrincipal): string => {
  if (!principal?.drepId) {
    throw new ForbiddenException(
      'Log in with your DRep key to manage a DRep profile',
    );
  }
  return principal.drepId;
};

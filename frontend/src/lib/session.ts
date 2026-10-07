import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import {
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
} from './localStorage';

export const SESSION_TOKEN_KEY = 'token';
// Dispatched on window when the API rejects the session
export const SESSION_EXPIRED_EVENT = 'session-expired';

type SessionClaims = {
  sub?: string;
  drepId?: string;
  exp?: number;
};

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return getItemFromLocalStorage(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Claims of the stored session, or null if there is no valid session. */
export function getSession() {
  const token = getSessionToken();
  if (!token) return null;
  try {
    const { sub, drepId, exp } = jwtDecode<SessionClaims>(token);
    if (!sub || !exp || exp < Date.now() / 1000) return null;
    return { stakeAddress: sub, drepId };
  } catch {
    return null;
  }
}

export function clearSession() {
  removeItemFromLocalStorage(SESSION_TOKEN_KEY);
  Cookies.remove(SESSION_TOKEN_KEY, { path: '/' });
}

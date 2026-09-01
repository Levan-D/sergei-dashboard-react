import { deleteCookie, getCookie, setCookie } from '@/lib/storage';

/** What POST /api/public/login and POST /api/token/refresh both return. */
export type LoginResponseType = {
  token: string;
  refresh_token: string;
  is_registered?: boolean;
};

/** The persisted session. Kept flat so it survives JSON round-tripping unchanged. */
export type SessionType = {
  accessToken: string;
  refreshToken: string;
  /** JWT `exp`, in seconds since epoch. */
  expiresAt: number;
  /** JWT `iat`, in seconds since epoch. */
  issuedAt: number;
  roles: string[];
};

type JwtPayloadType = {
  exp?: number;
  iat?: number;
  roles?: string[];
};

const COOKIE_NAME = 'user';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

/**
 * Decode a JWT payload without a dependency. Only the middle segment is read,
 * and the signature is never checked: that is the server's job, we just need
 * the expiry so the client knows when to refresh.
 */
export function decodeJwt(token: string): JwtPayloadType | null {
  const segment = token.split('.')[1];
  if (!segment) return null;
  try {
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
    return JSON.parse(json) as JwtPayloadType;
  } catch {
    return null;
  }
}

/** Build a session from a login or refresh response. Null when the token is unusable. */
export function sessionFromResponse(response: LoginResponseType): SessionType | null {
  if (!response?.token || !response?.refresh_token) return null;
  const payload = decodeJwt(response.token);
  if (!payload?.exp) return null;
  return {
    accessToken: response.token,
    refreshToken: response.refresh_token,
    expiresAt: payload.exp,
    issuedAt: payload.iat ?? Math.floor(Date.now() / 1000),
    roles: Array.isArray(payload.roles) ? payload.roles : [],
  };
}

export function readStoredSession(): SessionType | null {
  const raw = getCookie(COOKIE_NAME);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<SessionType>;
    if (!parsed.accessToken || !parsed.refreshToken || typeof parsed.expiresAt !== 'number') return null;
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      expiresAt: parsed.expiresAt,
      issuedAt: typeof parsed.issuedAt === 'number' ? parsed.issuedAt : 0,
      roles: Array.isArray(parsed.roles) ? parsed.roles : [],
    };
  } catch {
    return null;
  }
}

export function writeStoredSession(session: SessionType) {
  setCookie(COOKIE_NAME, JSON.stringify(session), { maxAge: COOKIE_MAX_AGE });
}

export function clearStoredSession() {
  deleteCookie(COOKIE_NAME);
}

/** Seconds until the access token expires. Negative once it has. */
export const secondsUntilExpiry = (session: SessionType) => session.expiresAt - Math.floor(Date.now() / 1000);

/** True while the token has enough life left to be worth sending. */
export const isSessionFresh = (session: SessionType, marginSeconds = 60) =>
  secondsUntilExpiry(session) > marginSeconds;

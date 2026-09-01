import { useEffect } from 'react';
import { useAppSelector } from '@/store';
import { secondsUntilExpiry } from '@/lib/auth/session';
import { ensureRefreshed } from '@/lib/auth/refresh';

/** Refresh once the token has less than this left. */
const REFRESH_MARGIN_SECONDS = 10 * 60;
const POLL_MS = 5 * 60 * 1000;

/**
 * Keeps a signed-in session alive ahead of expiry, so a tab left open does not
 * fail its next request. The 401 retry in the base query is the safety net;
 * this is what stops users seeing that path at all.
 *
 * Checks on mount, whenever the tab is focused or becomes visible again (a
 * laptop reopened after hours is the common case), and on a slow interval.
 */
export default function useTokenRefresh() {
  const session = useAppSelector((state) => state.auth.session);
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    const check = () => {
      if (secondsUntilExpiry(session) < REFRESH_MARGIN_SECONDS) void ensureRefreshed();
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') check();
    };

    check();
    const timer = window.setInterval(check, POLL_MS);
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [status, session]);
}

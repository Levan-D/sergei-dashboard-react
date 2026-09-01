import { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { ROUTING } from '@/lib/routing';
import { isSessionFresh } from '@/lib/auth/session';
import { ensureRefreshed } from '@/lib/auth/refresh';
import useTokenRefresh from '@/hooks/use-token-refresh';
import { sessionConfirmed, sessionEnded } from '@/store/authSlice';

function AuthSpinner() {
  return (
    <div className="admin flex min-h-dvh flex-col items-center justify-center bg-bg">
      <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-line border-t-accent" />
    </div>
  );
}

/**
 * Resolves the restored session before any admin route renders. A cookie only
 * proves a session existed, not that it is still good, so on boot we either
 * confirm a live token or spend one refresh on an expired one. Anything left
 * unresolved sends the user to login with the path they wanted.
 */
export default function AuthGate() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { session, status } = useAppSelector((state) => state.auth);
  const checking = useRef(false);
  useTokenRefresh();

  useEffect(() => {
    if (status !== 'unknown' || checking.current) return;
    if (!session) {
      dispatch(sessionEnded());
      return;
    }
    if (isSessionFresh(session)) {
      dispatch(sessionConfirmed());
      return;
    }

    checking.current = true;
    ensureRefreshed()
      .then((result) => {
        // A transient failure leaves the stored session in place rather than
        // signing the user out over a dropped connection.
        if (result === 'success') return;
        dispatch(result === 'auth_failure' ? sessionEnded() : sessionConfirmed());
      })
      .finally(() => {
        checking.current = false;
      });
  }, [status, session, dispatch]);

  if (status === 'unknown') return <AuthSpinner />;
  if (status === 'anonymous') {
    return <Navigate to={ROUTING.adminLogin} replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}

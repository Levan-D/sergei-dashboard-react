import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { ROUTING } from '@/lib/routing';
import { sessionEnded } from '@/store/authSlice';

/**
 * Ends the session locally. There is no server-side logout endpoint, so this
 * only dispatches: auth-middleware clears the cookie and wipes every cache off
 * `sessionEnded`, the same as it does when a token expires unrecoverably.
 */
export function useSignOut() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useCallback(() => {
    dispatch(sessionEnded());
    navigate(ROUTING.adminLogin, { replace: true });
  }, [dispatch, navigate]);
}

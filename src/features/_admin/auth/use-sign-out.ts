import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { ROUTING } from '@/lib/routing';
import { sessionEnded } from '@/store/authSlice';
import { adminApiSlice } from '@/lib/redux/api/admin-api';
import { autobrandApiSlice } from '@/lib/redux/api/landing-api/autobrand-api/autobrand-api-slice';
import { catalogApiSlice } from '@/lib/redux/api/landing-api/catalog-api/catalog-api-slice';

/**
 * Ends the session locally. There is no server-side logout endpoint, so this
 * clears the token and wipes every cache: without the reset, the next person to
 * sign in on this browser would briefly see the previous user's data.
 */
export function useSignOut() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useCallback(() => {
    dispatch(sessionEnded());
    dispatch(adminApiSlice.util.resetApiState());
    dispatch(autobrandApiSlice.util.resetApiState());
    dispatch(catalogApiSlice.util.resetApiState());
    navigate(ROUTING.adminLogin, { replace: true });
  }, [dispatch, navigate]);
}

import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * The landing scrolls the window, but the admin scrolls inside #admin-scroll,
 * so resetting only the window leaves admin route changes mid-page.
 */
export default function useScrollReset() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === 'POP') return;
    window.scrollTo(0, 0);
    document.getElementById('admin-scroll')?.scrollTo(0, 0);
  }, [pathname, navigationType]);
}

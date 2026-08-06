import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { setViewportWidth } from '@/store/screenSlice';

/**
 * Custom hook that tracks window dimensions and dispatches them to Redux store.
 * Uses debouncing to prevent excessive updates during resize, scroll, and touch events.
 */
export default function useScreenDimensions() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let resizeTimeoutId: ReturnType<typeof setTimeout>;

    const updateDimensions = () => {
      dispatch(setViewportWidth(window.innerWidth));
    };

    const handleResize = () => {
      clearTimeout(resizeTimeoutId);
      resizeTimeoutId = setTimeout(updateDimensions, 250);
    };

    updateDimensions();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeoutId);
    };
  }, [dispatch]);
}

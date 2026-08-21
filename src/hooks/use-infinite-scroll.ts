import { useEffect, useRef } from 'react';

type Args = {
  hasMore: boolean;
  isFetching: boolean;
  onLoadMore: () => void;
};

/**
 * The custom sentinel pattern from the main frontend's interactions feed:
 * observe a sentinel element, fire onLoadMore when any pixel of it becomes
 * visible, guarded so it never fires mid-fetch or past the last page.
 * Render the returned ref on a div under the list.
 */
export default function useInfiniteScroll({ hasMore, isFetching, onLoadMore }: Args) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || isFetching) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { root: null, rootMargin: '0px', threshold: 0 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, isFetching, onLoadMore]);

  return sentinelRef;
}

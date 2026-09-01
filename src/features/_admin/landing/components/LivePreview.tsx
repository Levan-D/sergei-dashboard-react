import { useEffect, useRef, useState } from 'react';
import { brand } from '@/lib/brand';
import { ROUTING } from '@/lib/routing';
import { useGetAdminSiteQuery } from '@/lib/redux/api/admin-api/site/site-queries';

/** Render the landing at a real desktop size, then scale it into the panel. */
const PREVIEW_WIDTH = 1280;
const PREVIEW_HEIGHT = 900;
/**
 * Stacked full width above the editor the preview grows with the panel, but it
 * is a glance, not the page, so it stops before it pushes the form off screen.
 */
const MAX_PREVIEW_HEIGHT = 320;
const MAX_SCALE = MAX_PREVIEW_HEIGHT / PREVIEW_HEIGHT;

/**
 * The real landing in an iframe rather than a mock of it, so the panel cannot
 * drift from the page it claims to show. It reflects saved state only: the
 * iframe is a separate app instance reading the public payload, so it reloads
 * once a save lands rather than tracking unsaved form edits.
 */
export function LivePreview() {
  const { data: site } = useGetAdminSiteQuery({ subdomain: brand.makeSlug });
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const skipFirst = useRef(true);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setScale(Math.min(el.clientWidth / PREVIEW_WIDTH, MAX_SCALE));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Every save writes its response into the site cache, so a new object here
  // means the landing has changed and the preview is now stale.
  useEffect(() => {
    if (!site) return;
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    try {
      frameRef.current?.contentWindow?.location.reload();
    } catch {
      /* nothing useful to do if the frame is not reachable */
    }
  }, [site]);

  const domain = site?.domain ?? `${brand.makeSlug}.motority.com`;

  return (
    <div className="sticky top-0 overflow-hidden rounded-card border border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2 text-[11px] font-semibold tracking-[.08em] text-ink-3 uppercase @mobile:px-4 @mobile:py-3">
        <div className="h-1.5 w-1.5 rounded-full bg-green" />
        Live Preview — {domain}
      </div>
      <div className="p-3 @mobile:p-4">
        <div
          ref={boxRef}
          className="relative mx-auto w-full overflow-hidden rounded-lg bg-black"
          style={{ maxWidth: PREVIEW_WIDTH * MAX_SCALE, height: Math.round(PREVIEW_HEIGHT * scale) }}
        >
          <iframe
            ref={frameRef}
            src={ROUTING.home}
            title="Landing preview"
            tabIndex={-1}
            className="pointer-events-none absolute top-0 left-0 border-0"
            style={{
              width: PREVIEW_WIDTH,
              height: PREVIEW_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
        <p className="mt-2.5 rounded-md bg-surface-2 px-2.5 py-2 text-[10px] text-ink-3">Changes apply after Save ↑</p>
      </div>
    </div>
  );
}

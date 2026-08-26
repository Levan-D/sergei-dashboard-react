import { useEffect, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { brand } from '@/lib/brand';
import { adminMediaUrl } from '@/lib/redux/api/site-types';
import { useGetPublicAutobrandQuery } from '@/lib/redux/api/landing-api/autobrand-api/autobrand-api-slice';

type ShellProps = { children: ReactNode };

function GateShell({ children }: ShellProps) {
  return (
    <div className="landing flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center">
      {children}
    </div>
  );
}

/**
 * Fetches the public brand payload before any landing chrome paints: spinner
 * while resolving, a dead-simple maintenance / unavailable screen when the
 * brand is down (enabled: false answers 404), the site otherwise. Admin routes
 * are deliberately outside the gate.
 */
export default function SiteGate() {
  const { data: site, isError, isFetching, refetch } = useGetPublicAutobrandQuery({ subdomain: brand.makeSlug });

  useEffect(() => {
    if (!site) return;
    if (site.make?.name) document.title = `${site.make.name} & Motority`;
    const faviconUrl = adminMediaUrl(site.brand_style?.favicon, 'small');
    if (!faviconUrl) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [site]);

  if (!site && !isError) {
    return (
      <GateShell>
        <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-line border-t-accent" />
      </GateShell>
    );
  }

  if (isError && !site) {
    return (
      <GateShell>
        <p className="t-h2">This page is unavailable</p>
        <p className="t-subhead text-ink-2">The brand site could not be loaded.</p>
        <button
          type="button"
          disabled={isFetching}
          onClick={refetch}
          className="t-button mt-2 cursor-pointer rounded-lg bg-accent px-6 py-2.5 tracking-[0.01em] text-white uppercase disabled:opacity-60"
        >
          Try again
        </button>
      </GateShell>
    );
  }

  if (site?.maintenance) {
    return (
      <GateShell>
        <p className="t-h2">Under maintenance</p>
        <p className="t-subhead text-ink-2">We&apos;ll be back soon.</p>
      </GateShell>
    );
  }

  return <Outlet />;
}

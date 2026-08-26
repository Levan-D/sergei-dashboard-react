import { useState } from 'react';
import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import Highlight from '@/components/landing/Highlight';
import { IconArrowRight } from '@/components/landing/icons';
import { cn } from '@/lib/cn';
import usePublicSite from '@/features/landing/use-public-site';

type Tab = 'About' | 'Facts' | 'Motority stats';

const shortLabels: Record<Tab, string> = {
  About: 'About',
  Facts: 'Facts',
  'Motority stats': 'Stats',
};

type PairType = { name: string; value: string };

type Props = { pairs: PairType[] };

function PairList({ pairs }: Props) {
  return (
    <div className="flex flex-col">
      {pairs.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 border-b border-line py-3 w960:py-4">
          <p className="t-body text-ink-2">{p.name}</p>
          <p className="t-body text-right font-medium">{p.value}</p>
        </div>
      ))}
    </div>
  );
}

const statPair = (name: string, value?: string | number | null): PairType[] => {
  if (value === null || value === undefined || value === '') return [];
  return [{ name, value: typeof value === 'number' ? value.toLocaleString('en-US') : value }];
};

export function BrandSection() {
  const [picked, setPicked] = useState<Tab | null>(null);
  const site = usePublicSite();
  const stats = site?.motority_stats;

  const about = (site?.about ?? '').split(/\n+/).filter((p) => p.trim());
  const facts = (site?.facts ?? []).filter((f) => f.name?.trim() && f.value?.trim());
  const statRows = [
    ...statPair('Total Logbooks', stats?.total_logbooks),
    ...statPair(
      'New This Month',
      stats?.new_this_month && stats.new_this_month > 0 ? `+${stats.new_this_month}` : stats?.new_this_month,
    ),
    ...statPair('Active Owners', stats?.active_owners),
    ...statPair('Top Model', stats?.top_model),
    ...statPair('Models', stats?.models_count),
    ...statPair('Generations', stats?.generations_count),
  ];

  const available: Tab[] = [
    ...(about.length ? (['About'] as const) : []),
    ...(facts.length ? (['Facts'] as const) : []),
    ...(statRows.length ? (['Motority stats'] as const) : []),
  ];

  if (!available.length) return <></>;

  const tab = picked && available.includes(picked) ? picked : available[0];

  return (
    <section className="bg-surface-2">
      <Container>
        <Highlight id="3b" size="lg" className="block">
          <div className="flex flex-col gap-6 w960:gap-10">
            <SectionTitle>Brand</SectionTitle>
            <div className="flex flex-col items-start gap-6 w960:flex-row w960:gap-16 w1280:gap-[calc(8.333%+26px)]">
              {available.length > 1 && (
                <div className="flex w-full shrink-0 overflow-hidden rounded-lg border border-line w960:block w960:w-[320px] w1280:w-[calc(33.333%-16px)]">
                  {available.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPicked(t)}
                      className={cn(
                        't-tab flex h-[42px] flex-1 cursor-pointer items-center justify-center border-r border-line px-2 text-center transition-colors last:border-r-0 w640:h-13 w960:h-16 w960:w-full w960:flex-none w960:justify-between w960:border-r-0 w960:border-b w960:px-4 w960:text-left w960:last:border-b-0',
                        tab === t ? 'bg-surface text-ink' : 'text-ink/60 hover:text-ink',
                      )}
                    >
                      <span className="w960:hidden">{shortLabels[t]}</span>
                      <span className="hidden w960:inline">{t}</span>
                      {tab === t && <IconArrowRight size={32} className="hidden shrink-0 w960:block" />}
                    </button>
                  ))}
                </div>
              )}
              <div className="w-full min-w-0 flex-1">
                {tab === 'About' && (
                  <div className="flex flex-col gap-4 w960:gap-6">
                    {about.map((p, i) => (
                      <p key={i} className="t-body">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
                {tab === 'Facts' && <PairList pairs={facts.map((f) => ({ name: f.name, value: f.value }))} />}
                {tab === 'Motority stats' && <PairList pairs={statRows} />}
              </div>
            </div>
          </div>
        </Highlight>
      </Container>
    </section>
  );
}

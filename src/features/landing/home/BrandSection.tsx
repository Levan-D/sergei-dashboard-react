import { useState } from 'react';
import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import { IconArrowRight } from '@/components/landing/icons';
import { cn } from '@/lib/cn';
import { brandAbout, brandFacts, brandStats } from '@/features/landing/data';

const tabs = ['About', 'Facts', 'Motority stats'] as const;
type Tab = (typeof tabs)[number];

const shortLabels: Record<Tab, string> = {
  About: 'About',
  Facts: 'Facts',
  'Motority stats': 'Stats',
};

type Props = { pairs: { name: string; value: string }[] };

function PairList({ pairs }: Props) {
  return (
    <div className="flex flex-col">
      {pairs.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 border-b border-line py-3 w960:py-4">
          <p className="t-body text-ink-2">{p.name}</p>
          <p className="t-body text-right font-medium">{p.value}</p>
        </div>
      ))}
    </div>
  );
}

export function BrandSection() {
  const [tab, setTab] = useState<Tab>('About');
  return (
    <section className="bg-surface-2">
      <Container className="flex flex-col gap-6 w960:gap-10">
        <SectionTitle>Brand</SectionTitle>
        <div className="flex flex-col items-start gap-6 w960:flex-row w960:gap-4 w1280:gap-[calc(8.333%+26px)]">
          <div className="flex w-full shrink-0 overflow-hidden rounded-lg border border-line w960:block w960:w-[320px] w1280:w-[calc(33.333%-16px)]">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  't-tab flex h-13 flex-1 cursor-pointer items-center justify-center border-r border-line px-2 text-center transition-colors last:border-r-0 w960:h-16 w960:w-full w960:flex-none w960:justify-between w960:border-r-0 w960:border-b w960:px-4 w960:text-left w960:last:border-b-0',
                  tab === t ? 'bg-surface text-ink' : 'text-ink/60 hover:text-ink',
                )}
              >
                <span className="w960:hidden">{shortLabels[t]}</span>
                <span className="hidden w960:inline">{t}</span>
                {tab === t && <IconArrowRight size={24} className="hidden shrink-0 w960:block" />}
              </button>
            ))}
          </div>
          <div className="w-full min-w-0 flex-1">
            {tab === 'About' && (
              <div className="flex flex-col gap-4 w960:gap-6">
                {brandAbout.map((p, i) => (
                  <p key={i} className="t-body">
                    {p}
                  </p>
                ))}
              </div>
            )}
            {tab === 'Facts' && <PairList pairs={brandFacts} />}
            {tab === 'Motority stats' && <PairList pairs={brandStats} />}
          </div>
        </div>
      </Container>
    </section>
  );
}

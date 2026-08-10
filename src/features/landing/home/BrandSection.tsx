import { useState } from 'react';
import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import { cn } from '@/lib/cn';
import { brandAbout, brandFacts, brandStats } from '@/features/landing/data';

const tabs = ['About', 'Facts', 'Motority stats'] as const;
type Tab = (typeof tabs)[number];

type Props = { pairs: { name: string; value: string }[] };

function PairList({ pairs }: Props) {
  return (
    <div className="flex max-w-[923px] flex-col">
      {pairs.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 border-b border-line py-3 w960:py-4">
          <span className="text-base text-ink-2 w960:text-xl">{p.name}</span>
          <span className="text-right text-base font-medium w960:text-xl">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function BrandSection() {
  const [tab, setTab] = useState<Tab>('About');
  return (
    <section className="bg-surface-2">
      <Container className="flex flex-col gap-6 w640:gap-10">
        <SectionTitle>Brand</SectionTitle>
        <div className="flex flex-col items-start gap-6 w640:flex-row w640:gap-10 w1280:gap-16 w1440:gap-[146px]">
          <div className="w-full shrink-0 overflow-hidden rounded-lg border border-line w640:w-[260px] w960:w-[320px] w1280:w-[420px] w1440:w-[517px]">
            {tabs.map((t) => (
              <div
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex h-14 cursor-pointer items-center justify-between border-b border-line px-4 text-lg font-semibold tracking-[0.01em] uppercase transition-colors duration-150 last:border-b-0 w960:h-16 w960:text-xl w1440:text-2xl',
                  tab === t ? 'bg-surface text-ink' : 'text-ink/60 hover:text-ink',
                )}
              >
                {t}
                {tab === t && <span className="text-2xl">→</span>}
              </div>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            {tab === 'About' && (
              <div className="flex max-w-[923px] flex-col gap-6">
                {brandAbout.map((p, i) => (
                  <p key={i} className="text-base leading-[1.2] w640:text-lg w960:text-xl w960:leading-[1.2]">
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

import { Fragment } from 'react';
import Container from '@/components/landing/Container';
import { cn } from '@/lib/cn';

type Props = { items: { value: string; label: string }[] };

export function StatsStrip({ items }: Props) {
  return (
    <section className="landing-dark border-t border-white/10 bg-black">
      <Container
        noPadding="y"
        className="grid grid-cols-[1fr_1px_1fr] gap-x-6 gap-y-6 py-7 w1280:flex w1280:flex-wrap w1280:items-center w1280:py-10"
      >
        {items.map((s, i) => (
          <Fragment key={s.label}>
            {i > 0 && (
              <div
                className={cn(
                  'bg-white/20',
                  i % 2 === 1 ? 'w-px self-stretch w1280:h-[61px] w1280:self-auto' : 'col-span-3 h-px w-full',
                  'w1280:h-[61px] w1280:w-px w1280:shrink-0',
                )}
              />
            )}
            <div className="flex min-w-0 flex-col gap-1 w1280:min-w-[150px] w1280:flex-1 w1280:gap-2">
              <p className="t-card-name text-white w1280:text-[32px]">{s.value}</p>
              <p className="t-stat-label tracking-[0.05em] text-white/60 uppercase w1280:text-[16px] w1280:font-medium w1280:tracking-normal w1280:text-white/80">
                {s.label}
              </p>
            </div>
          </Fragment>
        ))}
      </Container>
    </section>
  );
}

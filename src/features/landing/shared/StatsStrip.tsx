import { Fragment } from 'react';
import Container from '@/components/landing/Container';

type Props = { items: { value: string; label: string }[] };

export function StatsStrip({ items }: Props) {
  return (
    <section className="landing-dark border-t border-white/10 bg-black">
      <Container noPadding="y" className="flex flex-wrap items-center gap-x-10 gap-y-5 py-7 w1280:gap-x-6 w1280:py-10">
        {items.map((s, i) => (
          <Fragment key={s.label}>
            {i > 0 && <div className="hidden h-[61px] w-px shrink-0 bg-white/20 w1280:block" />}
            <div className="flex min-w-[150px] flex-1 flex-col gap-1 w1280:gap-2">
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

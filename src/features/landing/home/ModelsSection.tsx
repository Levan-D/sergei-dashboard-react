import { useState } from 'react';
import { Link } from 'react-router-dom';
import { landingModelPath } from '@/lib/routing';
import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import PillChip from '@/components/landing/PillChip';
import Button from '@/components/landing/Button';
import { cn } from '@/lib/cn';
import { landingModels, bodyTypeFilters, seriesFilters, decadeFilters } from '@/features/landing/data';

type Props = {
  label: string;
  options: string[];
  active: string;
  onPick: (v: string) => void;
};

function FilterGroup({ label, options, active, onPick }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-base leading-[1.1] font-medium tracking-[0.01em] text-ink/80 w640:text-lg w960:text-xl">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <PillChip key={o} label={o} active={active === o} onClick={() => onPick(o)} />
        ))}
      </div>
    </div>
  );
}

const pages = ['1', '2', '3', '…', '7'];

export function ModelsSection() {
  const [bodyType, setBodyType] = useState('All');
  const [series, setSeries] = useState('All');
  const [decade, setDecade] = useState('All');

  return (
    <section className="bg-bg">
      <Container className="flex flex-col gap-6 w640:gap-10">
        <SectionTitle>Models</SectionTitle>

        <div className="flex flex-col gap-4">
          <FilterGroup label="Body type" options={bodyTypeFilters} active={bodyType} onPick={setBodyType} />
          <div className="h-px w-full bg-line" />
          <FilterGroup label="Series" options={seriesFilters} active={series} onPick={setSeries} />
          <div className="h-px w-full bg-line" />
          <FilterGroup label="Decade" options={decadeFilters} active={decade} onPick={setDecade} />
        </div>

        <div className="flex flex-wrap gap-4 w1440:gap-6">
          {landingModels.map((m, i) => (
            <Link
              key={i}
              to={landingModelPath(m.slug)}
              className="block w-[calc(50%-8px)] cursor-pointer overflow-hidden rounded-lg border border-line transition-colors hover:bg-[#ebebeb] w640:w-[calc(33.333%-11px)] w1440:w-[calc(33.333%-16px)]"
            >
              <div
                className="flex h-[110px] items-center justify-center text-4xl w640:h-[140px] w640:text-5xl w960:h-[180px] w1280:h-[220px] w1280:text-6xl w1440:h-[280px]"
                style={{ background: m.image.bg }}
              >
                {m.image.emoji}
              </div>
              <div className="flex flex-col gap-1 p-3 w640:gap-2 w640:p-4 w1440:p-6">
                <p className="text-[10px] text-accent w640:text-xs w1440:text-sm">
                  {m.tags.map((t, ti) => (
                    <span key={t}>
                      {ti > 0 && <span> / </span>}
                      <span className="uppercase">{t}</span>
                    </span>
                  ))}
                </p>
                <p className="text-base leading-[1.2] font-semibold w640:text-lg w1280:text-xl w1440:text-2xl">
                  {m.name}
                </p>
                <p className="text-sm font-medium w640:text-base w1440:text-xl">{m.years}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <Button variant="secondary" className="w-full bg-[#d4d4d8]/40 text-black hover:bg-[#d4d4d8]/60">
            See more
          </Button>
          <div className="flex items-center gap-2 w640:gap-4">
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-xl text-ink/40 hover:bg-surface-2 w640:h-12 w640:w-12">
              ‹
            </button>
            {pages.map((p, i) => (
              <button
                key={i}
                className={cn(
                  'flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-sm font-medium w640:h-12 w640:w-12 w640:text-base',
                  p === '1' ? 'bg-[#d4d4d8]/40 text-black' : 'border-2 border-[#d4d4d8] text-black hover:bg-surface-2',
                )}
              >
                {p}
              </button>
            ))}
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-xl text-ink hover:bg-surface-2 w640:h-12 w640:w-12">
              ›
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { landingModelPath } from '@/lib/routing';
import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import PillChip from '@/components/landing/PillChip';
import Carousel from '@/components/landing/Carousel';
import useModelsPerPage from '@/hooks/use-models-per-page';
import { cn } from '@/lib/cn';
import { landingModels, bodyTypeFilters, seriesFilters, decadeFilters } from '@/features/landing/data';

const pages = ['1', '2', '3', '…', '7'];

type Props = {
  label: string;
  options: string[];
  active: string;
  onPick: (v: string) => void;
};

function FilterGroup({ label, options, active, onPick }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="t-label text-ink/80">{label}</p>
      <Carousel trackClassName="gap-2 w1280:gap-2" scrollAmount={240}>
        {options.map((o) => (
          <PillChip key={o} label={o} active={active === o} onClick={() => onPick(o)} />
        ))}
      </Carousel>
    </div>
  );
}

export function ModelsSection() {
  const [bodyType, setBodyType] = useState('All');
  const [series, setSeries] = useState('All');
  const [decade, setDecade] = useState('All');
  const perPage = useModelsPerPage();

  return (
    <section id="models" className="scroll-mt-16 bg-bg w1280:scroll-mt-20">
      <Container>
        <SectionTitle className="mb-6 w640:mb-10">Models</SectionTitle>

        <div className="mb-6 flex flex-col gap-3 w1280:gap-4">
          <FilterGroup label="Body type" options={bodyTypeFilters} active={bodyType} onPick={setBodyType} />
          <div className="h-px w-full bg-line" />
          <FilterGroup label="Series" options={seriesFilters} active={series} onPick={setSeries} />
          <div className="h-px w-full bg-line" />
          <FilterGroup label="Decade" options={decadeFilters} active={decade} onPick={setDecade} />
        </div>

        <div className="flex flex-wrap gap-4 w1440:gap-6">
          {landingModels.slice(0, perPage).map((m, i) => {
            const cardCls =
              'block w-full cursor-pointer overflow-hidden rounded-lg border border-line transition-colors hover:bg-[#ebebeb]';
            const widthCls =
              'min-[450px]:w-[calc(50%-8px)] min-[800px]:w-[calc(33.333%-11px)] w1440:w-[calc(33.333%-16px)]';
            const inner = (
              <>
                <div
                  className="flex h-[240px] items-center justify-center text-4xl w640:text-5xl w1280:h-[280px] w1280:text-6xl"
                  style={{ background: m.image.bg }}
                >
                  {m.image.emoji}
                </div>
                <div className="flex flex-col gap-1 p-3 w640:gap-4 w640:p-4 w1440:p-6">
                  <p className="t-eyebrow text-accent">
                    {m.tags.map((t, ti) => (
                      <span key={t}>
                        {ti > 0 && <span> / </span>}
                        <span className="uppercase">{t}</span>
                      </span>
                    ))}
                  </p>
                  <p className="t-card-name">{m.name}</p>
                  <p className="t-card-years">{m.years}</p>
                </div>
              </>
            );
            return (
              <Link key={i} to={landingModelPath(m.slug)} className={`${cardCls} ${widthCls}`}>
                {inner}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 block w960:mt-[30px]">
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex items-center gap-2 w640:gap-4">
              <button
                type="button"
                aria-label="Previous page"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-xl text-ink/40 hover:bg-surface-2 w640:h-12 w640:w-12"
              >
                ‹
              </button>
              {pages.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    'flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-sm font-medium w640:h-12 w640:w-12 w640:text-base',
                    p === '1'
                      ? 'bg-[#d4d4d8]/40 text-black'
                      : 'border-2 border-[#d4d4d8] text-black hover:bg-surface-2',
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-xl text-ink hover:bg-surface-2 w640:h-12 w640:w-12"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { Link, useParams } from 'react-router-dom';
import { landingGenPath } from '@/lib/routing';
import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import SelectField from '@/components/landing/SelectField';
import { IconSort } from '@/components/landing/icons';
import { landingGens } from '@/features/landing/data';

export function GenerationsSection() {
  const { model = 'm4' } = useParams();
  return (
    <section className="bg-bg">
      <Container className="flex flex-col gap-10">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle>Generations</SectionTitle>
          <button
            type="button"
            aria-label="Sort generations"
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-line-2 text-ink transition-colors hover:bg-surface-2"
          >
            <IconSort size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 w960:flex-row">
            <SelectField
              label="Sort by"
              options={['Most recent', 'Oldest first', 'Most popular']}
              className="w-full w960:flex-1 w1280:w-[340px] w1280:grow-0"
            />
            <SelectField
              label="Body type"
              options={['All', 'Coupe', 'Convertible']}
              className="w-full w960:flex-1 w1280:w-[340px] w1280:grow-0"
            />
          </div>
          <div className="flex flex-wrap gap-4 w1440:gap-6">
            {landingGens.map((g) => (
              <Link
                key={g.slug}
                to={landingGenPath(model, g.slug)}
                className="block w-full cursor-pointer overflow-hidden rounded-lg border border-line transition-colors hover:bg-[#ebebeb] min-[450px]:w-[calc(50%-8px)] w1440:w-[calc(50%-12px)]"
              >
                <div
                  className="flex h-[240px] items-center justify-center text-4xl w640:text-5xl w1280:h-[280px] w1280:text-6xl"
                  style={{ background: g.image.bg }}
                >
                  {g.image.emoji}
                </div>
                <div className="flex flex-col gap-1 p-3 w640:gap-4 w640:p-4 w1440:p-6">
                  <p className="t-spec-label text-accent uppercase">{g.body}</p>
                  <p className="t-card-name">{g.name}</p>
                  <p className="t-card-years">{g.years}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

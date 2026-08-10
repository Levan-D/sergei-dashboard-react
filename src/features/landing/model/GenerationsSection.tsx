import { Link, useParams } from 'react-router-dom';
import { landingGenPath } from '@/lib/routing';
import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import Select from '@/components/_admin/forms/Select';
import { landingGens } from '@/features/landing/data';

export function GenerationsSection() {
  const { model = 'm4' } = useParams();
  return (
    <section className="bg-bg">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle>Generations</SectionTitle>
          <div className="flex flex-wrap gap-4">
            <div className="flex w-[200px] flex-col gap-1.5">
              <label className="t-stat-label text-ink-2 uppercase">Sort by</label>
              <Select options={['Most recent', 'Oldest first', 'Most popular']} />
            </div>
            <div className="flex w-[200px] flex-col gap-1.5">
              <label className="t-stat-label text-ink-2 uppercase">Body type</label>
              <Select options={['All', 'Coupe', 'Convertible']} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {landingGens.map((g) => (
            <Link
              key={g.slug}
              to={landingGenPath(model, g.slug)}
              className="block w-full cursor-pointer overflow-hidden rounded-lg border border-line transition-colors hover:bg-[#ebebeb] w960:w-[calc(50%-12px)]"
            >
              <div
                className="flex h-[240px] items-center justify-center text-6xl w960:h-[320px]"
                style={{ background: g.image.bg }}
              >
                {g.image.emoji}
              </div>
              <div className="flex flex-col gap-2 p-6">
                <p className="t-eyebrow text-accent uppercase">{g.body}</p>
                <p className="t-card-name">{g.name}</p>
                <p className="t-card-years">{g.years}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

import { useNavigate, useParams } from 'react-router-dom';
import { landingGenPath } from '@/lib/routing';
import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import Select from '@/components/_admin/forms/Select';
import { landingGens } from '@/features/landing/data';

export function GenerationsSection() {
  const navigate = useNavigate();
  const { model = 'm4' } = useParams();
  return (
    <section className="bg-bg">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle>Generations</SectionTitle>
          <div className="flex flex-wrap gap-4">
            <div className="flex w-[200px] flex-col gap-1.5">
              <label className="text-xs text-ink-2 uppercase">Sort by</label>
              <Select options={['Most recent', 'Oldest first', 'Most popular']} />
            </div>
            <div className="flex w-[200px] flex-col gap-1.5">
              <label className="text-xs text-ink-2 uppercase">Body type</label>
              <Select options={['All', 'Coupe', 'Convertible']} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {landingGens.map((g) => (
            <div
              key={g.slug}
              onClick={() => navigate(landingGenPath(model, g.slug))}
              className="w-full cursor-pointer overflow-hidden rounded-lg border border-line transition-colors duration-150 hover:border-line-2 w960:w-[calc(50%-12px)]"
            >
              <div
                className="flex h-[240px] items-center justify-center text-6xl w960:h-[320px]"
                style={{ background: g.image.bg }}
              >
                {g.image.emoji}
              </div>
              <div className="flex flex-col gap-2 p-6">
                <div className="text-sm text-accent uppercase">{g.body}</div>
                <div className="text-2xl leading-[1.2] font-semibold">{g.name}</div>
                <div className="text-xl font-medium">{g.years}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

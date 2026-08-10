import Container from '@/components/landing/Container';

type Props = { items: { value: string; label: string }[] };

export function StatsStrip({ items }: Props) {
  return (
    <section className="landing-dark border-t border-white/10">
      <Container noPadding="y" className="flex flex-wrap gap-x-10 gap-y-5 py-7">
        {items.map((s) => (
          <div key={s.label} className="min-w-[150px] flex-1">
            <p className="t-card-name text-white">{s.value}</p>
            <p className="t-stat-label mt-1 tracking-[0.05em] text-white/60 uppercase">{s.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}

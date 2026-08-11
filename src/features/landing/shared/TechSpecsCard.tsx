import { techSpecs } from '@/features/landing/data';

type Props = { title: string };

export function TechSpecsCard({ title }: Props) {
  return (
    <aside className="w-full shrink-0 w1440:w-[464px]">
      <p className="t-h3">{title}</p>
      <div className="mt-4 flex flex-col gap-2 border-b border-line pb-4 w1280:mt-6">
        <p className="t-card-years font-semibold text-accent">{techSpecs.linkLabel}</p>
        <p className="t-spec-label text-ink/80">{techSpecs.sub}</p>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {techSpecs.rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-6">
            <p className="t-spec-label text-ink/80 uppercase">{r.label}</p>
            <p className="t-spec-value text-right uppercase">{r.value}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

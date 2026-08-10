import { techSpecs } from '@/features/landing/data';

type Props = { title: string };

export function TechSpecsCard({ title }: Props) {
  return (
    <aside className="w-full shrink-0 w1440:w-[430px]">
      <p className="t-wordmark">{title}</p>
      <div className="mt-4 flex flex-col gap-1 border-b border-line pb-4">
        <p className="t-button cursor-pointer font-semibold text-accent hover:underline">{techSpecs.linkLabel}</p>
        <p className="t-lb-meta text-ink-2">{techSpecs.sub}</p>
      </div>
      <div className="flex flex-col">
        {techSpecs.rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-6 border-b border-line py-3">
            <p className="t-body text-ink-2 uppercase">{r.label}</p>
            <p className="t-body text-right font-medium uppercase">{r.value}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

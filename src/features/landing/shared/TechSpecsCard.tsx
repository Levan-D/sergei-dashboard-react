import { techSpecs } from '@/features/landing/data';

type Props = { title: string };

export function TechSpecsCard({ title }: Props) {
  return (
    <aside className="w-full shrink-0 w1440:w-[430px]">
      <div className="text-sm font-bold tracking-[0.05em] uppercase">{title}</div>
      <div className="mt-4 flex flex-col gap-1 border-b border-line pb-4">
        <span className="cursor-pointer text-base font-semibold text-accent hover:underline">
          {techSpecs.linkLabel}
        </span>
        <span className="text-sm text-ink-2">{techSpecs.sub}</span>
      </div>
      <div className="flex flex-col">
        {techSpecs.rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-6 border-b border-line py-3">
            <span className="text-sm text-ink-2 uppercase">{r.label}</span>
            <span className="text-right text-sm font-medium uppercase">{r.value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

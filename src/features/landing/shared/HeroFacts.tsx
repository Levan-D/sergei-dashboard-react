import { Fragment } from 'react';

type Props = { items: { label: string; value: string }[] };

export function HeroFacts({ items }: Props) {
  return (
    <div className="flex gap-3 border-y border-white/20 py-[15px] w1280:gap-6">
      {items.map((f, i) => (
        <Fragment key={f.label + i}>
          {i > 0 && <div className="w-px shrink-0 self-stretch bg-white/20" />}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="t-body truncate text-white/80">{f.label}</p>
            <p className="t-card-name truncate text-white">{f.value}</p>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

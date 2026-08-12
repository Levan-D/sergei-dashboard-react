import { Fragment } from 'react';

type Props = { items: { label: string; value: string }[] };

export function HeroFacts({ items }: Props) {
  return (
    <div className="border-y border-white/20">
      <div className="flex [scrollbar-width:none] gap-3 overflow-x-auto py-[15px] [-ms-overflow-style:none] w1280:gap-6 [&::-webkit-scrollbar]:hidden">
        {items.map((f, i) => (
          <Fragment key={f.label + i}>
            {i > 0 && <div className="w-px shrink-0 self-stretch bg-white/20" />}
            <div className="flex min-w-[170px] flex-1 flex-col gap-2">
              <p className="t-body whitespace-nowrap text-white/80">{f.label}</p>
              <p className="t-card-name whitespace-nowrap text-white">{f.value}</p>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

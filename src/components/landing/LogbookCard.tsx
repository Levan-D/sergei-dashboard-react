import type { OwnerLogbook } from '@/features/landing/data';

type Props = { logbook: OwnerLogbook };

export default function LogbookCard({ logbook }: Props) {
  return (
    <div className="w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-lg bg-[#333333] transition-transform hover:-translate-y-0.5 w640:w-[320px] w960:w-[420px]">
      <div
        className="flex h-[240px] items-center justify-center text-5xl w960:text-6xl w1280:h-[280px]"
        style={{ background: logbook.image.bg }}
      >
        {logbook.image.emoji}
      </div>
      <div className="flex flex-col gap-4 p-4 w640:p-6">
        <div className="flex flex-col gap-2">
          <p className="t-lb-name text-white">{logbook.car}</p>
          <p className="t-lb-meta text-white/60">{logbook.meta}</p>
        </div>
        <div className="flex gap-2">
          {logbook.stats.map((s) => (
            <div key={s.label} className="flex flex-1 flex-col gap-1.5">
              <p className="t-stat-label text-white/60 uppercase">{s.label}</p>
              <p className="t-lb-stat-val text-white">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="h-px bg-white/20" />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f3f6] text-[11px] font-bold text-[#1e1e24]">
            {logbook.name
              .split(' ')
              .map((w) => w[0])
              .join('')}
          </div>
          <p className="t-lb-owner text-white">{logbook.name}</p>
        </div>
      </div>
    </div>
  );
}

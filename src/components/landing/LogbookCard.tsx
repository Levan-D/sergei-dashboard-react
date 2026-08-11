import type { OwnerLogbook } from '@/features/landing/data';

type Props = { logbook: OwnerLogbook };

export default function LogbookCard({ logbook }: Props) {
  return (
    <div className="w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-lg bg-[#333333] transition-transform hover:-translate-y-0.5 w640:w-[320px] w960:w-[360px] w1280:w-[384px] w1440:w-[420px]">
      <div
        className="flex h-[220px] items-center justify-center text-5xl w640:h-[240px] w960:h-[280px] w960:text-6xl"
        style={{ background: logbook.image.bg }}
      >
        {logbook.image.emoji}
      </div>
      <div className="flex flex-col gap-3 p-4 w1280:gap-4 w1280:p-6">
        <div className="flex flex-col gap-2">
          <p className="t-lb-name text-white">{logbook.car}</p>
          <p className="t-lb-meta text-white/60">{logbook.meta}</p>
        </div>
        <div className="flex gap-2">
          {logbook.stats.map((s) => (
            <div key={s.label} className="flex flex-1 flex-col gap-2">
              <p className="t-stat-label text-white/60 uppercase">{s.label}</p>
              <p className="t-lb-stat-val text-white">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="h-px bg-white/20" />
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f3f3f6] text-[11px] font-bold text-[#1e1e24] w640:h-7 w640:w-7 w960:h-8 w960:w-8">
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

export function LivePreview() {
  return (
    <div className="sticky top-0 overflow-hidden rounded-card border border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3 text-[11px] font-semibold tracking-[.08em] text-ink-3 uppercase">
        <div className="h-1.5 w-1.5 rounded-full bg-green" />
        Live Preview — bmw.motority.com
      </div>
      <div className="p-4">
        <div className="overflow-hidden rounded-lg bg-black">
          <div
            className="relative flex h-[100px] items-end p-3"
            style={{ background: 'linear-gradient(135deg,#0a0a1a,#1a1a3e,#0f2460)' }}
          >
            <div className="text-[7px] leading-[1.4] font-extrabold tracking-[.5px] text-white">
              THE ULTIMATE
              <br />
              DRIVING MACHINE
              <br />
              <span className="text-[5px] font-normal opacity-70">Over a century of precision engineering</span>
            </div>
          </div>
          <div className="px-2.5 py-2">
            <div className="mb-[5px] text-[6px] font-bold text-white">MODELS</div>
            <div className="mb-[7px] flex gap-[3px]">
              <div
                className="rounded-lg px-[5px] py-0.5 text-[5px]"
                style={{ background: '#1e3a5f', color: '#60a5fa' }}
              >
                All
              </div>
              <div
                className="rounded-lg border px-[5px] py-0.5 text-[5px]"
                style={{ borderColor: '#333', color: '#888' }}
              >
                Coupe
              </div>
              <div
                className="rounded-lg border px-[5px] py-0.5 text-[5px]"
                style={{ borderColor: '#333', color: '#888' }}
              >
                Sedan
              </div>
            </div>
            <div className="mt-1.5 grid grid-cols-3 gap-[5px]">
              {[
                { code: 'M4', name: 'BMW M4', year: '2021–Present' },
                { code: 'M3', name: 'BMW M3', year: '2020–Present' },
                { code: 'X5', name: 'BMW X5', year: '2018–Present' },
              ].map((m) => (
                <div key={m.code} className="overflow-hidden rounded-[3px]" style={{ background: '#1a1a1a' }}>
                  <div
                    className="flex h-6 items-center justify-center text-[5px] font-bold"
                    style={{ background: 'linear-gradient(135deg,#1e3a5f,#2d6a4f)', color: 'rgba(255,255,255,.4)' }}
                  >
                    {m.code}
                  </div>
                  <div className="px-1 py-[3px]">
                    <div className="text-[5px] font-bold text-white">{m.name}</div>
                    <div className="text-[4px]" style={{ color: '#888' }}>
                      {m.year}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-2.5 py-1.5" style={{ borderTop: '1px solid #1a1a1a' }}>
            <div className="mb-1 text-[5px] font-bold text-white">REAL OWNERS</div>
            <div className="grid grid-cols-2 gap-[3px]">
              {['BMW M4 Competition', 'BMW X5 G05'].map((n) => (
                <div key={n} className="flex h-[22px] items-end rounded-[3px] p-[3px]" style={{ background: '#111' }}>
                  <div className="text-[4px]" style={{ color: '#aaa' }}>
                    {n}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2.5 rounded-md bg-surface-2 px-2.5 py-2 text-[10px] text-ink-3">
          Changes apply after Save ↑
        </div>
      </div>
    </div>
  );
}

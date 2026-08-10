import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';

const linkColumn = ['Official website', 'Explore models', 'Configurator', 'Find a dealer'];

export default function Footer() {
  return (
    <footer className="landing-dark">
      <Container noPadding="y" className="pt-10">
        <div className="flex flex-wrap items-start gap-10 pb-16 w1280:gap-6 w1440:pb-[100px]">
          <div className="flex w-full max-w-[340px] flex-col gap-5">
            <div className="flex items-center gap-4 w1280:gap-6">
              <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-white/40 text-[13px] font-bold text-white">
                BMW
              </div>
              <p className="font-barlow text-base font-medium tracking-[0.01em] text-white uppercase">
                BMW &amp; Motority
              </p>
            </div>
            <p className="text-base leading-[1.25] tracking-[0.01em] text-white/70 uppercase">
              The Ultimate Driving Machine. On Motority since 2025
            </p>
          </div>
          {[0, 1].map((col) => (
            <div key={col} className="flex min-w-[200px] flex-col gap-4 w1280:w-[342px]">
              {linkColumn.map((l) => (
                <p
                  key={l}
                  className="cursor-pointer text-sm tracking-[0.01em] text-white/70 uppercase transition-colors hover:text-white"
                >
                  {l}
                </p>
              ))}
            </div>
          ))}
          <Button variant="secondary" className="w-full w640:w-auto w1280:ml-auto w1280:w-[342px]">
            Join the community
          </Button>
        </div>
        <div className="border-t border-white/20 py-6">
          <p className="text-[10px] tracking-[0.01em] text-white/80">
            2026 BMW BRAND PAGE ON MOTORITY. ALL RIGHTS RESERVED
          </p>
        </div>
      </Container>
    </footer>
  );
}

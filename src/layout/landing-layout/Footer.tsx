import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';

const linkColumn = ['Official website', 'Explore models', 'Configurator', 'Find a dealer'];

export default function Footer() {
  return (
    <footer className="landing-dark -mt-0.5">
      <Container noPadding="y" className="pt-10">
        <div className="flex flex-col items-start gap-5 pb-[60px] w640:flex-row w640:flex-wrap w640:gap-6 w640:pb-[120px] w960:gap-10 w1280:gap-6">
          <div className="flex w-full max-w-[340px] flex-col gap-5">
            <div className="flex items-center gap-4 w1280:gap-6">
              <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-white/40 text-[13px] font-bold text-white">
                BMW
              </div>
              <p className="font-barlow text-base font-medium tracking-[0.01em] text-white uppercase">
                BMW &amp; Motority
              </p>
            </div>
            <p className="t-footer-tag text-white/70">The Ultimate Driving Machine. On Motority since 2025</p>
          </div>
          <div className="flex min-w-[200px] flex-col gap-4 w1280:w-[342px]">
            {linkColumn.map((l) => (
              <p key={l} className="t-footer-link cursor-pointer text-white/70 transition-colors hover:text-white">
                {l}
              </p>
            ))}
          </div>
          <Button variant="secondary" className="w-full w960:ml-auto w960:w-auto w1280:w-[342px]">
            Join the community
          </Button>
        </div>
        <div className="border-t border-white/20 py-[22px]">
          <p className="t-caption text-white/80">2026 BMW BRAND PAGE ON MOTORITY. ALL RIGHTS RESERVED</p>
        </div>
      </Container>
    </footer>
  );
}

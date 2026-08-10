import { useNavigate } from 'react-router-dom';
import { ROUTING } from '@/lib/routing';
import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';

const navLinks = ['Explore models', 'Configurator', 'Find a dealer'];

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-black/30">
      <Container noPadding="y" className="flex h-16 items-center justify-between w640:h-20">
        <div
          className="flex cursor-pointer items-center gap-3 w640:gap-4 w1280:gap-6"
          onClick={() => navigate(ROUTING.home)}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-[11px] font-bold text-white w640:h-[54px] w640:w-[54px] w640:text-[13px]">
            BMW
          </div>
          <div className="font-barlow text-sm font-medium tracking-[0.01em] text-white/70 uppercase w640:text-base">
            BMW &amp; Motority
          </div>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 w1280:flex">
            {navLinks.map((l) => (
              <span
                key={l}
                className="cursor-pointer font-barlow text-base font-medium tracking-[0.01em] text-white/70 uppercase transition-colors duration-150 hover:text-white"
              >
                {l}
              </span>
            ))}
          </nav>
          <Button className="h-10 px-4 text-sm w640:h-12 w640:px-6 w640:text-base">OFFICIAL WEBSITE</Button>
        </div>
      </Container>
    </header>
  );
}

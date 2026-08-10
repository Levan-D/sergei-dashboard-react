import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTING } from '@/lib/routing';
import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';
import MobileMenu from '@/layout/landing-layout/MobileMenu';
import { IconBurger } from '@/components/landing/icons';

const navLinks = ['Explore models', 'Configurator', 'Find a dealer'];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-black/30">
      <Container noPadding="y" className="flex h-16 items-center justify-between w1280:h-20">
        <Link to={ROUTING.home} className="flex cursor-pointer items-center gap-3 w640:gap-4 w1280:gap-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-[11px] font-bold text-white w1280:h-[54px] w1280:w-[54px] w1280:text-[13px]">
            BMW
          </div>
          <p className="font-barlow text-sm font-medium tracking-[0.01em] text-white/70 uppercase w1280:text-base">
            BMW &amp; Motority
          </p>
        </Link>
        <div className="flex items-center gap-3 w640:gap-4 w1280:gap-6">
          <nav className="hidden items-center gap-6 w1280:flex">
            {navLinks.map((l) => (
              <p
                key={l}
                className="cursor-pointer font-barlow text-base font-medium tracking-[0.01em] text-white/70 uppercase transition-colors hover:text-white"
              >
                {l}
              </p>
            ))}
          </nav>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-surface text-ink transition-colors hover:bg-surface-2 w1280:hidden"
          >
            <IconBurger size={20} />
          </button>
          <Button className="hidden px-4 text-sm w640:px-6 w640:text-base w960:inline-flex">OFFICIAL WEBSITE</Button>
        </div>
      </Container>
      <MobileMenu open={menuOpen} links={navLinks} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

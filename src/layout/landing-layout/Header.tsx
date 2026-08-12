import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTING } from '@/lib/routing';
import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';
import Highlight from '@/components/landing/Highlight';
import MobileMenu from '@/layout/landing-layout/MobileMenu';
import { IconBurger } from '@/components/landing/icons';
import { scrollToId } from '@/lib/scroll';
import { highlightsToggle, useHighlightsEnabled } from '@/components/landing/highlights';
import { cn } from '@/lib/cn';

const navLinks = ['Explore models', 'Configurator', 'Find a dealer'];
const deadNavLinks = [
  { id: '1r', label: 'Configurator' },
  { id: '2r', label: 'Find a dealer' },
] as const;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const highlightsOn = useHighlightsEnabled();

  const onWordmarkClick = () => {
    if (location.pathname === ROUTING.home) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.requestAnimationFrame(() => window.scrollTo({ top: 0 }));
    }
  };

  const goToModels = () => {
    if (location.pathname === ROUTING.home) {
      scrollToId('models');
    } else {
      navigate(ROUTING.home);
      window.setTimeout(() => scrollToId('models'), 120);
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-black/30">
      <Container noPadding="y" className="flex h-16 items-center justify-between w1280:h-20">
        <Link
          to={ROUTING.home}
          onClick={onWordmarkClick}
          className="flex cursor-pointer items-center gap-3 w640:gap-4 w1280:gap-6"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-[11px] font-bold text-white w1280:h-[54px] w1280:w-[54px] w1280:text-[13px]">
            BMW
          </div>
          <p className="t-wordmark text-white/70">BMW &amp; Motority</p>
        </Link>
        <div className="flex items-center gap-3 w640:gap-4 w1280:gap-6">
          <nav className="hidden items-center gap-6 w1280:flex">
            <p
              onClick={goToModels}
              className="t-wordmark cursor-pointer text-white/70 transition-colors hover:text-white"
            >
              Explore models
            </p>
            {deadNavLinks.map((l) => (
              <Highlight key={l.id} id={l.id}>
                <p className="t-wordmark cursor-pointer text-white/70 transition-colors hover:text-white">{l.label}</p>
              </Highlight>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => highlightsToggle.toggle()}
            className="hidden h-10 w-[168px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/40 px-3 text-white/70 transition-colors hover:bg-white/10 w960:inline-flex w1280:h-12"
          >
            <span className={cn('h-2 w-2 shrink-0 rounded-full', highlightsOn ? 'bg-[#ef4444]' : 'bg-white/40')} />
            <span className="t-wordmark">{highlightsOn ? 'Hide highlights' : 'Show highlights'}</span>
          </button>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-surface text-ink transition-colors hover:bg-surface-2 w1280:hidden"
          >
            <IconBurger size={20} />
          </button>
          <Button
            href="https://motority.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden px-4 w960:inline-flex w1280:px-6"
          >
            OFFICIAL WEBSITE
          </Button>
        </div>
      </Container>
      <MobileMenu open={menuOpen} links={navLinks} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

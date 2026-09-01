import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTING } from '@/lib/routing';
import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';
import MobileMenu from '@/layout/landing-layout/MobileMenu';
import { IconBurger } from '@/components/landing/icons';
import { scrollToId } from '@/lib/scroll';
import { brand } from '@/lib/brand';
import usePublicSite from '@/features/landing/use-public-site';
import { adminMediaUrl } from '@/lib/redux/api/site-types';

const navLinks = ['Explore models', 'Configurator', 'Find a dealer'];
const secondaryNavLinks = ['Configurator', 'Find a dealer'];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const site = usePublicSite();
  const brandName = site?.make?.name ?? brand.name;
  const logoUrl = adminMediaUrl(site?.brand_style?.logo, 'small');

  const onWordmarkClick = () => {
    if (location.pathname === ROUTING.home) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/40 text-[11px] font-bold text-white w1280:h-[54px] w1280:w-[54px] w1280:text-[13px]">
            {logoUrl ? <img src={logoUrl} alt={brandName} className="h-full w-full object-contain" /> : brandName}
          </div>
          <p className="t-wordmark text-white/70">{brandName} &amp; Motority</p>
        </Link>
        <div className="flex items-center gap-3 w640:gap-4 w1280:gap-6">
          <nav className="hidden items-center gap-6 w1280:flex">
            <p
              onClick={goToModels}
              className="t-wordmark cursor-pointer text-white/70 transition-colors hover:text-white"
            >
              Explore models
            </p>
            {secondaryNavLinks.map((label) => (
              <p key={label} className="t-wordmark cursor-pointer text-white/70 transition-colors hover:text-white">
                {label}
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

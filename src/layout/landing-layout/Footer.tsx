import { useLocation, useNavigate } from 'react-router-dom';
import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';
import Highlight from '@/components/landing/Highlight';
import { ROUTING } from '@/lib/routing';
import { scrollToId } from '@/lib/scroll';
import { brand } from '@/lib/brand';
import usePublicSite from '@/features/landing/use-public-site';
import { adminMediaUrl } from '@/lib/redux/api/site-types';

const deadLinks = [
  { id: '1r', label: 'Configurator' },
  { id: '2r', label: 'Find a dealer' },
] as const;

const linkClass = 't-footer-link cursor-pointer text-white/70 transition-colors hover:text-white';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const site = usePublicSite();
  const brandName = site?.make?.name ?? brand.name;
  const logoUrl = adminMediaUrl(site?.brand_style?.logo, 'small');
  const joinHref = site?.vendor_channel?.slug ? `https://motority.com/${site.vendor_channel.slug}` : undefined;

  const goToModels = () => {
    if (location.pathname === ROUTING.home) {
      scrollToId('models');
    } else {
      navigate(ROUTING.home);
      window.setTimeout(() => scrollToId('models'), 120);
    }
  };

  return (
    <footer className="landing-dark -mt-0.5">
      <Container noPadding="y" className="pt-10">
        <div className="flex flex-col items-start gap-5 pb-[60px] w640:flex-row w640:flex-wrap w640:gap-6 w640:pb-[120px] w960:gap-10 w1280:gap-6">
          <div className="flex w-full max-w-[340px] flex-col gap-5">
            <div className="flex items-center gap-4 w1280:gap-6">
              <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/40 text-[13px] font-bold text-white">
                {logoUrl ? <img src={logoUrl} alt={brandName} className="h-full w-full object-contain" /> : brandName}
              </div>
              <p className="font-barlow text-base font-medium tracking-[0.01em] text-white uppercase">
                {brandName} &amp; Motority
              </p>
            </div>
            <p className="t-footer-tag text-white/70">The Ultimate Driving Machine. On Motority since 2025</p>
          </div>
          <div className="flex min-w-[200px] flex-col items-start gap-4 w1280:w-[342px]">
            <a href="https://motority.com/" target="_blank" rel="noopener noreferrer" className={linkClass}>
              Official website
            </a>
            <p onClick={goToModels} className={linkClass}>
              Explore models
            </p>
            {deadLinks.map((l) => (
              <Highlight key={l.id} id={l.id}>
                <p className={linkClass}>{l.label}</p>
              </Highlight>
            ))}
          </div>
          {joinHref && (
            <Highlight id="2b" className="w-full w960:ml-auto w960:w-auto w1280:w-[342px]">
              <Button
                variant="secondary"
                href={joinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                Join the community
              </Button>
            </Highlight>
          )}
        </div>
        <div className="border-t border-white/20 py-[23.5px]">
          <p className="t-caption text-white/80">2026 {brandName.toUpperCase()} BRAND PAGE ON MOTORITY. ALL RIGHTS RESERVED</p>
        </div>
      </Container>
    </footer>
  );
}

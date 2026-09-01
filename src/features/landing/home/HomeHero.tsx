import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';
import { HeroSlideshow } from '@/features/landing/shared/HeroSlideshow';
import usePublicSite from '@/features/landing/use-public-site';
import { adminMediaFileUrl, adminMediaUrl } from '@/lib/redux/api/site-types';
import { heroImages } from '@/features/landing/data';
import { scrollToId } from '@/lib/scroll';

const text = (value?: string | null) => value?.trim() || undefined;

export function HomeHero() {
  const site = usePublicSite();
  const hero = site?.hero;

  const imageUrl = adminMediaUrl(hero?.image, 'big');
  const videoUrl = adminMediaFileUrl(hero?.video);
  const posterUrl = adminMediaUrl(hero?.video_thumbnail, 'big');
  const slideUrls = (hero?.slides ?? [])
    .map((s) => adminMediaUrl(s.media, 'big'))
    .filter((url): url is string => !!url);

  const heroType = hero?.type ?? 'image';
  const showVideo = heroType === 'video' && !!videoUrl;
  const showSlides = heroType === 'carousel' && slideUrls.length > 0;
  const imageBg = imageUrl ? `url("${imageUrl}") center / cover no-repeat` : heroImages.home.bg;

  const headline = text(hero?.headline);
  const subheadline = text(hero?.subheadline);

  const channelUrl = site?.vendor_channel?.slug ? `https://motority.com/${site.vendor_channel.slug}` : undefined;
  const primaryText = text(hero?.cta_primary?.text);
  const primaryUrl = text(hero?.cta_primary?.url);
  const secondaryText = text(hero?.cta_secondary?.text);
  const secondaryUrl = text(hero?.cta_secondary?.url) ?? channelUrl;
  const showSecondary = !!secondaryText && !!secondaryUrl;

  return (
    <section className="relative flex min-h-[720px] items-end w1440:min-h-[800px] w1600:min-h-[900px] w1920:min-h-[940px]">
      {showVideo ? (
        <video
          src={videoUrl ?? undefined}
          poster={posterUrl ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : showSlides ? (
        <HeroSlideshow
          slides={slideUrls.map((url) => `url("${url}") center / cover no-repeat`)}
          intervalMs={hero?.autoplay === false ? null : (hero?.slide_duration_seconds ?? 5) * 1000}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: imageBg }} />
      )}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 to-transparent to-45%" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/50 to-transparent to-40%" />
      <Container noPadding="y" className="pointer-events-none relative pb-10 w1440:pb-20">
        <div className="pointer-events-auto flex max-w-[624px] flex-col gap-12">
          {(headline || subheadline) && (
            <div className="flex flex-col gap-6 self-start">
              {headline && <h1 className="t-h1 text-white">{headline}</h1>}
              {subheadline && <p className="t-lead max-w-[585px] text-white">{subheadline}</p>}
            </div>
          )}
          {(primaryText || showSecondary) && (
            <div className="flex flex-col gap-4 w640:flex-row w640:flex-wrap w960:gap-6">
              {primaryText &&
                (primaryUrl ? (
                  <Button
                    href={primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full w640:w-auto w640:flex-1 w960:flex-none"
                  >
                    {primaryText}
                  </Button>
                ) : (
                  <Button onClick={() => scrollToId('models')} className="w-full w640:w-auto w640:flex-1 w960:flex-none">
                    {primaryText}
                  </Button>
                ))}
              {showSecondary && (
                <Button
                  variant="secondary"
                  href={secondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full w640:flex-1 w960:w-auto w960:flex-none"
                >
                  {secondaryText}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

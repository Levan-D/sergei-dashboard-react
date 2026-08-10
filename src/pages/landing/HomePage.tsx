import { HomeHero } from '@/features/landing/home/HomeHero';
import { BrandSection } from '@/features/landing/home/BrandSection';
import { ModelsSection } from '@/features/landing/home/ModelsSection';
import { RealOwnersSection } from '@/features/landing/shared/RealOwnersSection';

export default function HomePage() {
  return (
    <div>
      <HomeHero />
      <BrandSection />
      <ModelsSection />
      <RealOwnersSection />
    </div>
  );
}

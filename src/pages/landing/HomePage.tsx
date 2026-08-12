import { HomeHero } from '@/features/landing/home/HomeHero';
import { BrandSection } from '@/features/landing/home/BrandSection';
import { ModelsSection } from '@/features/landing/home/ModelsSection';
import { RealOwnersSection } from '@/features/landing/shared/RealOwnersSection';
import Highlight from '@/components/landing/Highlight';

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      <HomeHero />
      <BrandSection />
      <ModelsSection />
      <RealOwnersSection />
    </div>
  );
}

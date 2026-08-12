import { HomeHero } from '@/features/landing/home/HomeHero';
import { BrandSection } from '@/features/landing/home/BrandSection';
import { ModelsSection } from '@/features/landing/home/ModelsSection';
import { RealOwnersSection } from '@/features/landing/shared/RealOwnersSection';
import Highlight from '@/components/landing/Highlight';

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      <HomeHero />
      <Highlight id="3b" size="lg" className="block w-full">
        <BrandSection />
      </Highlight>
      <ModelsSection />
      <RealOwnersSection />
    </div>
  );
}

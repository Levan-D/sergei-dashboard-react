import { ModelHero } from '@/features/landing/model/ModelHero';
import { StatsStrip } from '@/features/landing/shared/StatsStrip';
import { ModelOverviewSection } from '@/features/landing/model/ModelOverviewSection';
import { GenerationsSection } from '@/features/landing/model/GenerationsSection';
import { GalleryStrip } from '@/features/landing/shared/GalleryStrip';
import { RealOwnersSection } from '@/features/landing/shared/RealOwnersSection';
import { OwnersStoriesSection } from '@/features/landing/shared/OwnersStoriesSection';
import { modelStatsStrip } from '@/features/landing/data';

export default function ModelPage() {
  return (
    <div className="overflow-x-clip">
      <ModelHero />
      <StatsStrip items={modelStatsStrip} />
      <ModelOverviewSection />
      <GenerationsSection />
      <GalleryStrip />
      <RealOwnersSection />
      <OwnersStoriesSection />
    </div>
  );
}

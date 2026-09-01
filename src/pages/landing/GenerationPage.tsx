import { GenHero } from '@/features/landing/gen/GenHero';
import { StatsStrip } from '@/features/landing/shared/StatsStrip';
import { GenOverviewSection } from '@/features/landing/gen/GenOverviewSection';
import { ModificationsSection } from '@/features/landing/gen/ModificationsSection';
import { GalleryStrip } from '@/features/landing/shared/GalleryStrip';
import { RealOwnersSection } from '@/features/landing/shared/RealOwnersSection';
import { OwnersStoriesSection } from '@/features/landing/shared/OwnersStoriesSection';
import { genStatsStrip } from '@/features/landing/data';

export default function GenerationPage() {
  return (
    <div className="overflow-x-clip">
      <GenHero />
      <StatsStrip items={genStatsStrip} />
      <GenOverviewSection />
      <ModificationsSection />
      <GalleryStrip />
      <RealOwnersSection />
      <OwnersStoriesSection />
    </div>
  );
}

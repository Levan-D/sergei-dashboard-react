import { GenHero } from '@/features/landing/gen/GenHero';
import { StatsStrip } from '@/features/landing/shared/StatsStrip';
import { GenOverviewSection } from '@/features/landing/gen/GenOverviewSection';
import { ModificationsSection } from '@/features/landing/gen/ModificationsSection';
import { GalleryStrip } from '@/features/landing/shared/GalleryStrip';
import { RealOwnersSection } from '@/features/landing/shared/RealOwnersSection';
import { OwnersStoriesSection } from '@/features/landing/shared/OwnersStoriesSection';
import Highlight from '@/components/landing/Highlight';
import { genStatsStrip } from '@/features/landing/data';

export default function GenerationPage() {
  return (
    <div className="overflow-x-clip">
      <GenHero />
      <Highlight id="9r" size="lg" className="block">
        <StatsStrip items={genStatsStrip} />
      </Highlight>
      <GenOverviewSection />
      <ModificationsSection />
      <Highlight id="7b" size="lg" className="block">
        <GalleryStrip />
      </Highlight>
      <RealOwnersSection />
      <OwnersStoriesSection />
    </div>
  );
}

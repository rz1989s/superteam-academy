import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturedCourses } from '@/components/landing/featured-courses';
import { HowItWorks } from '@/components/landing/how-it-works';
import { TracksOverview } from '@/components/landing/tracks-overview';
import { GamificationPreview } from '@/components/landing/gamification-preview';
import { SocialProof } from '@/components/landing/social-proof';
import { CtaBanner } from '@/components/landing/cta-banner';
import { getOrganizationJsonLd } from '@/lib/utils/json-ld';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('landing');

  return {
    title: t('hero_title'),
    description: t('hero_subtitle'),
  };
}

/** rectorspace-signature gold section divider, constrained to the content width. */
function SectionDivider() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="border-t-2 border-gold/60" />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getOrganizationJsonLd()),
        }}
      />
      <HeroSection />
      <SectionDivider />
      <FeaturedCourses />
      <HowItWorks />
      <TracksOverview />
      <GamificationPreview />
      <SocialProof />
      <SectionDivider />
      <CtaBanner />
    </>
  );
}

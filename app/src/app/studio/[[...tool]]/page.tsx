'use client';

import { notFound } from 'next/navigation';
import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity/sanity.config';
import { isDemoMode } from '@/lib/demo';

export default function StudioPage() {
  // The live Sanity CMS needs project credentials and is not part of the
  // public demo. Hide it so a direct /studio load 404s cleanly instead of
  // mounting the editor against missing config.
  if (isDemoMode()) notFound();

  return <NextStudio config={config} />;
}

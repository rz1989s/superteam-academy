import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Started',
  description:
    'Set up your RECTOR Academy profile and choose your personalized Solana learning path.',
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

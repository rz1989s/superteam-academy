import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Sidebar, SidebarMobileContent } from '../sidebar';

// Render the sidebar in isolation: stub the i18n + routing plumbing and pin the
// XP hook to the seeded demo identity (Level 8 / 6,400 XP). The hook itself is
// covered by its own tests; here we assert the sidebar *reads from it* rather
// than from a hardcoded placeholder.
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  usePathname: () => '/courses/nft-201',
}));

vi.mock('@/lib/hooks/use-xp', () => ({
  useXp: () => ({
    xp: 6400,
    level: 8,
    progress: 0,
    toNextLevel: 1700,
    levelTitle: 'Master',
    isLoading: false,
  }),
}));

describe('Sidebar XP widget', () => {
  it('shows the store-derived level and total XP, not the old hardcoded placeholder', () => {
    const { container } = render(<Sidebar />);
    expect(container.textContent).toContain('6,400'); // total XP from the user store
    expect(container.textContent).toContain('level 8'); // seeded level (key passthrough mock)
    expect(container.textContent).not.toContain('2,450'); // old MOCK_XP currentXP
    expect(container.textContent).not.toContain('5,000'); // old MOCK_XP requiredXP
    expect(container.textContent).not.toContain('level 7'); // old MOCK_XP level
  });

  it('mobile sidebar content reads the same store source', () => {
    const { container } = render(<SidebarMobileContent />);
    expect(container.textContent).toContain('6,400');
    expect(container.textContent).toContain('level 8');
    expect(container.textContent).not.toContain('2,450');
  });
});

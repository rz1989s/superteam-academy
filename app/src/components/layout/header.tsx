'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { isDemoMode } from '@/lib/demo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { MobileNav } from '@/components/layout/mobile-nav';
import { SignInMenu } from '@/components/auth/sign-in-menu';
import { WalletConnectButton } from '@/components/layout/wallet-connect-button';
import { GraduationCap } from 'lucide-react';

interface NavItem {
  href: string;
  labelKey: 'courses' | 'leaderboard' | 'community';
}

const navItems: NavItem[] = [
  { href: '/courses', labelKey: 'courses' },
  { href: '/leaderboard', labelKey: 'leaderboard' },
  { href: '/community', labelKey: 'community' },
];

function HeaderNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'text-foreground after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gold after:content-[""]'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const t = useTranslations('nav');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="mr-6 flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="RECTOR Academy home"
        >
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="hidden font-bold text-lg sm:inline-block">
            RECTOR Academy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <HeaderNavLink
              key={item.href}
              href={item.href}
              label={t(item.labelKey)}
            />
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          {!isDemoMode() && <SignInMenu />}
          <WalletConnectButton />
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </header>
  );
}

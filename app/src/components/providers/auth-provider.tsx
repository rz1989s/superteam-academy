'use client';

import { SessionProvider } from 'next-auth/react';
import { isDemoMode } from '@/lib/demo';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // In demo mode there is no OAuth backend and no NEXTAUTH_SECRET, so a live
  // /api/auth/session fetch 500s ("server configuration") and dirties the
  // console. Passing an explicit empty session makes SessionProvider treat the
  // learner as unauthenticated WITHOUT ever hitting the network (next-auth
  // keeps its cached session null, so every internal _getSession path
  // early-returns). The provider must stay mounted — three components still
  // call useSession() (sign-in menu, settings account links, landing hero) and
  // would crash in a production build without the context.
  if (isDemoMode()) {
    return (
      <SessionProvider session={null} refetchOnWindowFocus={false}>
        {children}
      </SessionProvider>
    );
  }

  return <SessionProvider>{children}</SessionProvider>;
}

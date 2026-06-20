'use client';

import { useEffect, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import { HELIUS_RPC } from '@/lib/solana/constants';
import { isDemoMode } from '@/lib/demo';
import { DemoWalletAdapter, DemoWalletName } from '@/lib/demo/wallet-adapter';

/**
 * In demo mode, auto-select and connect the read-only demo wallet so every
 * useWallet() consumer behaves as a signed-in learner with zero interaction.
 */
function DemoAutoConnect() {
  const { select, wallet, connect, connected, connecting } = useWallet();

  useEffect(() => {
    if (!wallet) {
      select(DemoWalletName);
    }
  }, [wallet, select]);

  useEffect(() => {
    if (wallet?.adapter.name === DemoWalletName && !connected && !connecting) {
      connect().catch(() => {
        // benign in demo mode — the adapter never fails to "connect"
      });
    }
  }, [wallet, connected, connecting, connect]);

  return null;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => HELIUS_RPC, []);
  const demo = isDemoMode();
  const wallets = useMemo(() => (demo ? [new DemoWalletAdapter()] : []), [demo]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        {demo && <DemoAutoConnect />}
        {children}
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

import {
  BaseMessageSignerWalletAdapter,
  WalletReadyState,
  type WalletName,
} from '@solana/wallet-adapter-base';
import {
  PublicKey,
  type Transaction,
  type VersionedTransaction,
} from '@solana/web3.js';
import { DEMO_WALLET } from './seed';

export const DemoWalletName = 'Demo' as WalletName<'Demo'>;

/**
 * Read-only, auto-connecting wallet adapter for the public demo. Reports a
 * fixed demo learner pubkey as "connected" so every useWallet() consumer
 * lights up without a real wallet. Cannot sign — all transaction-producing
 * controls are hidden in demo mode (see Phase 5 demo-gating).
 */
export class DemoWalletAdapter extends BaseMessageSignerWalletAdapter {
  name = DemoWalletName;
  url = 'https://rectorspace.com';
  // Minimal inline SVG icon (avoids a network/asset dependency).
  icon =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=';
  readonly supportedTransactionVersions = null;

  private _publicKey: PublicKey | null = null;
  private _connecting = false;

  get readyState(): WalletReadyState {
    return WalletReadyState.Loadable;
  }

  get publicKey(): PublicKey | null {
    return this._publicKey;
  }

  get connecting(): boolean {
    return this._connecting;
  }

  async connect(): Promise<void> {
    if (this._publicKey) return;
    this._connecting = true;
    this._publicKey = new PublicKey(DEMO_WALLET);
    this._connecting = false;
    // Defer the emit by a microtask. wallet-adapter-react attaches its
    // 'connect' listener in a PARENT effect, which React runs AFTER our child
    // auto-connect effect — a synchronous emit would fire before the listener
    // exists and be lost (leaving `connected` false and the effect looping).
    await Promise.resolve();
    this.emit('connect', this._publicKey);
  }

  async disconnect(): Promise<void> {
    this._publicKey = null;
    this.emit('disconnect');
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(
    _transaction: T,
  ): Promise<T> {
    throw new Error('Demo mode — signing is disabled');
  }

  async signMessage(_message: Uint8Array): Promise<Uint8Array> {
    throw new Error('Demo mode — signing is disabled');
  }
}

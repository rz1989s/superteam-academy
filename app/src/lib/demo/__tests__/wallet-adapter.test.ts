import { describe, it, expect } from 'vitest';
import { DemoWalletAdapter, DemoWalletName } from '../wallet-adapter';
import { DEMO_WALLET } from '../seed';

describe('DemoWalletAdapter', () => {
  it('connects to the fixed demo wallet pubkey', async () => {
    const adapter = new DemoWalletAdapter();
    expect(adapter.name).toBe(DemoWalletName);
    expect(adapter.publicKey).toBeNull();
    expect(adapter.connected).toBe(false);

    await adapter.connect();

    expect(adapter.publicKey?.toBase58()).toBe(DEMO_WALLET);
    expect(adapter.connected).toBe(true);
  });

  it('disconnects', async () => {
    const adapter = new DemoWalletAdapter();
    await adapter.connect();
    await adapter.disconnect();
    expect(adapter.publicKey).toBeNull();
    expect(adapter.connected).toBe(false);
  });

  it('refuses to sign messages (demo mode)', async () => {
    const adapter = new DemoWalletAdapter();
    await adapter.connect();
    await expect(adapter.signMessage(new Uint8Array([1]))).rejects.toThrow();
  });
});

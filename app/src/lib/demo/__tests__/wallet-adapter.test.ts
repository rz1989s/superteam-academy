import { describe, it, expect, vi } from 'vitest';
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

  it("emits 'connect' to a listener registered before connect() resolves", async () => {
    // Regression: the emit must reach a pre-registered listener. wallet-adapter-react
    // attaches its 'connect' listener in a parent effect that runs after our child
    // auto-connect effect, so the emit is deferred a microtask rather than fired
    // synchronously inside connect().
    const adapter = new DemoWalletAdapter();
    const onConnect = vi.fn();
    adapter.on('connect', onConnect);

    await adapter.connect();

    expect(onConnect).toHaveBeenCalledTimes(1);
    expect(onConnect.mock.calls[0]![0]?.toBase58()).toBe(DEMO_WALLET);
  });

  it('refuses to sign messages (demo mode)', async () => {
    const adapter = new DemoWalletAdapter();
    await adapter.connect();
    await expect(adapter.signMessage(new Uint8Array([1]))).rejects.toThrow();
  });
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import { GET } from '../route';
import { DEMO_WALLET, DEMO_PROFILE } from '@/lib/demo/seed';

describe('GET /api/profile/[wallet] (demo mode)', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('returns the seed profile for the demo wallet', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true');
    const res = await GET(new Request('http://x'), {
      params: Promise.resolve({ wallet: DEMO_WALLET }),
    });
    const body = await res.json();
    expect(body.wallet).toBe(DEMO_WALLET);
    expect(body.xp).toBe(DEMO_PROFILE.xp);
    expect(body.level).toBe(DEMO_PROFILE.level);
    expect(body.levelTitle).toBe(DEMO_PROFILE.levelTitle);
  });

  it('still rejects an invalid wallet in demo mode', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true');
    const res = await GET(new Request('http://x'), {
      params: Promise.resolve({ wallet: 'not-a-pubkey' }),
    });
    expect(res.status).toBe(400);
  });
});

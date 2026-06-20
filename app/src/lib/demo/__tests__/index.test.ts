import { describe, it, expect, afterEach, vi } from 'vitest';
import { isDemoMode } from '../index';

describe('isDemoMode', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is true when NEXT_PUBLIC_DEMO_MODE === "true"', () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true');
    expect(isDemoMode()).toBe(true);
  });

  it('is false when the flag is unset', () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', '');
    expect(isDemoMode()).toBe(false);
  });

  it('is false for any value other than "true"', () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', '1');
    expect(isDemoMode()).toBe(false);
  });
});

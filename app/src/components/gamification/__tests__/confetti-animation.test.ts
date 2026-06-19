import { describe, it, expect } from 'vitest';
import { COLORS } from '../confetti-animation';

describe('confetti palette', () => {
  it('uses only the five RECTOR brand hexes (cream/gold/sky/leaf/clay)', () => {
    expect([...COLORS].sort()).toEqual(
      ['#FFF7E1', '#F9C846', '#41CFFF', '#A8E063', '#E58C2E'].sort(),
    );
  });

  it('contains no metallic or off-palette confetti colors', () => {
    const joined = COLORS.join(',');
    expect(joined).not.toMatch(
      /FFD700|4ECDC4|45B7D1|96CEB4|DDA0DD|98D8C8|FF8A5C|A8E6CF|FF6B6B|FFEAA7/i,
    );
  });
});

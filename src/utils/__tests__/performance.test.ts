import { describe, expect, it } from 'vitest';
import {
  getAnimationLevel,
  getDotGridConfig,
  shouldEnableSmoothScroll,
} from '../performance';

describe('performance', () => {
  it('在移动或减少动态时返回轻量动画等级', () => {
    expect(
      getAnimationLevel({
        isCompactScreen: true,
        isCoarsePointer: false,
        prefersReducedMotion: false,
      }),
    ).toBe('lite');

    expect(
      getAnimationLevel({
        isCompactScreen: false,
        isCoarsePointer: false,
        prefersReducedMotion: true,
      }),
    ).toBe('lite');
  });

  it('在桌面精细指针环境返回完整动画等级', () => {
    expect(
      getAnimationLevel({
        isCompactScreen: false,
        isCoarsePointer: false,
        prefersReducedMotion: false,
      }),
    ).toBe('full');
  });

  it('根据动画等级生成不同点阵配置', () => {
    expect(getDotGridConfig('full').spacing).toBeLessThan(getDotGridConfig('lite').spacing);
  });

  it('仅在完整动画等级下启用平滑滚动', () => {
    expect(shouldEnableSmoothScroll('full')).toBe(true);
    expect(shouldEnableSmoothScroll('lite')).toBe(false);
  });
});

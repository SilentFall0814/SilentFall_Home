export type ViewportProfile = {
  isCompactScreen: boolean;
  isCoarsePointer: boolean;
  prefersReducedMotion: boolean;
};

export type AnimationLevel = "full" | "lite";

export function getAnimationLevel(profile: ViewportProfile): AnimationLevel {
  if (
    profile.isCompactScreen ||
    profile.isCoarsePointer ||
    profile.prefersReducedMotion
  ) {
    return "lite";
  }

  return "full";
}

export function shouldEnableSmoothScroll(level: AnimationLevel) {
  return level === "full";
}

export function getDotGridConfig(level: AnimationLevel) {
  if (level === "full") {
    return {
      spacing: 28,
      heightRatio: 1.3,
      alphaSteps: 50,
    };
  }

  return {
    spacing: 40,
    heightRatio: 1.05,
    alphaSteps: 24,
  };
}

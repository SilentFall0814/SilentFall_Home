import { useEffect, useState } from "react";

export function useViewportProfile() {
  const [profile, setProfile] = useState(() => {
    if (typeof window === "undefined") {
      return {
        isCompactScreen: false,
        isCoarsePointer: false,
        prefersReducedMotion: false,
      };
    }

    return {
      isCompactScreen: window.matchMedia("(max-width: 640px)").matches,
      isCoarsePointer: window.matchMedia("(pointer: coarse)").matches,
      prefersReducedMotion: window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches,
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const compactMedia = window.matchMedia("(max-width: 640px)");
    const coarseMedia = window.matchMedia("(pointer: coarse)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateProfile = () => {
      setProfile({
        isCompactScreen: compactMedia.matches,
        isCoarsePointer: coarseMedia.matches,
        prefersReducedMotion: motionMedia.matches,
      });
    };

    updateProfile();
    compactMedia.addEventListener("change", updateProfile);
    coarseMedia.addEventListener("change", updateProfile);
    motionMedia.addEventListener("change", updateProfile);

    return () => {
      compactMedia.removeEventListener("change", updateProfile);
      coarseMedia.removeEventListener("change", updateProfile);
      motionMedia.removeEventListener("change", updateProfile);
    };
  }, []);

  return profile;
}

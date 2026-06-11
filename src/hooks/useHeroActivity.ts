import { useEffect, useState } from 'react';

export function useHeroActivity() {
  const [isHeroActive, setIsHeroActive] = useState(true);

  useEffect(() => {
    const updateHeroActivity = () => {
      setIsHeroActive(window.scrollY < window.innerHeight * 0.9);
    };

    updateHeroActivity();
    window.addEventListener('scroll', updateHeroActivity, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateHeroActivity);
    };
  }, []);

  return isHeroActive;
}

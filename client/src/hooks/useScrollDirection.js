import { useEffect, useRef, useState } from 'react';

const DEFAULT_THRESHOLD = 4;

const useScrollDirection = (threshold = DEFAULT_THRESHOLD) => {
  const [scrollDirection, setScrollDirection] = useState('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < threshold) {
        return;
      }

      setScrollDirection(delta > 0 ? 'down' : 'up');
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', updateScrollDirection, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [threshold]);

  return scrollDirection;
};

export default useScrollDirection;

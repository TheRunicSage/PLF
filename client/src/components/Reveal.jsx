import { useEffect, useMemo, useRef, useState } from 'react';

import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js';
import useScrollDirection from '../hooks/useScrollDirection.js';

const Reveal = ({
  as: Component = 'div',
  children,
  className = '',
  direction = 'up',
  distance = 18,
  duration = 600,
  delay = 0,
  once = false,
  threshold = 0.2,
  rootMargin = '0px 0px -8% 0px',
  retractOnScrollUp = true,
}) => {
  const nodeRef = useRef(null);
  const hasRevealedRef = useRef(false);
  const scrollDirectionRef = useRef('down');
  const scrollDirection = useScrollDirection();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  const style = useMemo(
    () => ({
      '--reveal-distance': `${Math.max(0, distance)}px`,
      '--reveal-duration': `${Math.max(0, duration)}ms`,
      '--reveal-delay': `${Math.max(0, delay)}ms`,
    }),
    [delay, distance, duration]
  );

  useEffect(() => {
    scrollDirectionRef.current = scrollDirection;
  }, [scrollDirection]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return undefined;
    }

    const node = nodeRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasRevealedRef.current = true;
          setIsVisible(true);

          if (once) {
            observer.unobserve(entry.target);
          }

          return;
        }

        if (!hasRevealedRef.current || once || !retractOnScrollUp) {
          return;
        }

        const exitedBelowViewport = entry.boundingClientRect.top >= window.innerHeight;

        if (scrollDirectionRef.current === 'up' && exitedBelowViewport) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once, prefersReducedMotion, retractOnScrollUp, rootMargin, threshold]);

  return (
    <Component
      ref={nodeRef}
      className={`reveal reveal--${direction} ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </Component>
  );
};

export default Reveal;

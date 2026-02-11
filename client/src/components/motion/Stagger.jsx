import { Children } from 'react';
import { motion } from 'framer-motion';

import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';
import { motionTokens } from './motionTokens.js';

const Stagger = ({
  children,
  className = '',
  delayChildren = 0,
  revealOnView = true,
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const childArray = Children.toArray(children);

  if (reducedMotion) {
    return <div className={className}>{childArray}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={revealOnView ? undefined : 'show'}
      whileInView={revealOnView ? 'show' : undefined}
      viewport={{ once: true, margin: '-8% 0px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: motionTokens.stagger,
            delayChildren,
          },
        },
      }}
    >
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: motionTokens.distance.tight },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                duration: motionTokens.duration.base,
                ease: motionTokens.ease,
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Stagger;

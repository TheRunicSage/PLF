import { motion } from 'framer-motion';

import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';
import { motionTokens } from './motionTokens.js';

const Reveal = ({ children, className = '', delay = 0, distance = 'base' }) => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reducedMotion ? 0 : motionTokens.distance[distance] }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{
        duration: reducedMotion ? 0.25 : motionTokens.duration.base,
        delay,
        ease: motionTokens.ease,
      }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;

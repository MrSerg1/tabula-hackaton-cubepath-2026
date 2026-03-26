import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './FloatingCartBubble.module.css';

const PARTICLE_COUNT = 12;
const PARTICLE_LIFETIME_MS = 760;
const PARTICLE_COLORS = ['#fdba74', '#fb923c', '#f97316', '#ffedd5', '#fde68a'];

function createParticle(index) {
  const baseAngle = (Math.PI * 2 * index) / PARTICLE_COUNT;
  const angle = baseAngle + (Math.random() - 0.5) * 0.32;
  const distance = 24 + Math.random() * 20;

  return {
    id: `${index}-${Math.random().toString(36).slice(2, 8)}`,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: 4 + Math.random() * 4,
    rotate: (Math.random() - 0.5) * 180,
    delay: Math.random() * 0.05,
    color: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
  };
}

export function FloatingCartBubble({ itemCount = 0, onClick }) {
  const [bursts, setBursts] = useState([]);
  const previousCountRef = useRef(itemCount);
  const burstIdRef = useRef(0);
  const cleanupTimersRef = useRef(new Set());

  useEffect(() => {
    return () => {
      cleanupTimersRef.current.forEach((timerId) => clearTimeout(timerId));
      cleanupTimersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (itemCount <= previousCountRef.current) {
      previousCountRef.current = itemCount;
      return;
    }

    const burstId = burstIdRef.current++;

    setBursts((currentBursts) => [
      ...currentBursts,
      {
        id: burstId,
        particles: Array.from({ length: PARTICLE_COUNT }, (_, index) => createParticle(index)),
      },
    ]);

    const timerId = window.setTimeout(() => {
      setBursts((currentBursts) => currentBursts.filter((burst) => burst.id !== burstId));
      cleanupTimersRef.current.delete(timerId);
    }, PARTICLE_LIFETIME_MS);

    cleanupTimersRef.current.add(timerId);
    previousCountRef.current = itemCount;
  }, [itemCount]);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={styles.floatingCart}
      aria-label={`Abrir carrito con ${itemCount} productos`}
      animate={
        bursts.length > 0
          ? {
              scale: [1, 1.08, 0.96, 1],
              rotate: [0, -5, 4, 0],
            }
          : { scale: 1, rotate: 0 }
      }
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.particleLayer} aria-hidden="true">
        <AnimatePresence>
          {bursts.map((burst) => (
            <motion.div
              key={burst.id}
              className={styles.particleBurst}
              initial={{ opacity: 1, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <motion.span
                className={styles.particleGlow}
                initial={{ scale: 0.35, opacity: 0.55 }}
                animate={{ scale: 1.7, opacity: 0 }}
                transition={{ duration: 0.42, ease: 'easeOut' }}
              />

              {burst.particles.map((particle) => (
                <motion.span
                  key={particle.id}
                  className={styles.particle}
                  style={{
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    background: particle.color,
                  }}
                  initial={{ x: 0, y: 0, scale: 0.3, opacity: 0 }}
                  animate={{
                    x: particle.x,
                    y: particle.y,
                    scale: [0.3, 1, 0.22],
                    opacity: [0, 0.95, 0],
                    rotate: particle.rotate,
                  }}
                  transition={{
                    duration: 0.66,
                    delay: particle.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 11h16a1 1 0 0 1 1 1v.5c0 1.5 -2.517 5.573 -4 6.5v1a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-1c-1.687 -1.054 -4 -5 -4 -6.5v-.5a1 1 0 0 1 1 -1" />
        <path d="M12 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
        <path d="M16 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
        <path d="M8 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
      </svg>
      <span className={styles.badge}>{itemCount}</span>
    </motion.button>
  );
}

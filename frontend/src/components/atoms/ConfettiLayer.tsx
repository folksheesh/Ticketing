import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ConfettiLayerProps {
  /** Number of confetti pieces */
  count?: number;
  /** Whether this is a burst (one-time) or ambient (continuous drift) */
  mode?: 'ambient' | 'burst';
  className?: string;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
  duration: number;
  shape: 'circle' | 'square' | 'triangle';
}

const CONFETTI_COLORS = [
  'var(--color-denso-red)',
  'var(--color-denso-red-light)',
  'var(--color-denso-blue)',
  'var(--color-denso-blue-light)',
  'var(--color-denso-sky)',
  'var(--color-denso-sky-light)',
];

/**
 * Lightweight CSS/SVG-based confetti particles.
 * - "ambient" mode: gentle continuous drift at low density
 * - "burst" mode: one-time celebratory burst (for ticket confirmation)
 * Respects prefers-reduced-motion: falls back to static/hidden.
 */
export function ConfettiLayer({
  count = 20,
  mode = 'ambient',
  className = '',
}: ConfettiLayerProps) {
  const prefersReduced = useReducedMotion();

  const pieces = useMemo<ConfettiPiece[]>(() => {
    const shapes: ConfettiPiece['shape'][] = ['circle', 'square', 'triangle'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: mode === 'burst' ? 40 + Math.random() * 20 : Math.random() * 100,
      size: 4 + Math.random() * 6,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      rotation: Math.random() * 360,
      delay: mode === 'burst' ? Math.random() * 0.5 : Math.random() * 5,
      duration: mode === 'burst' ? 1.5 + Math.random() * 1.5 : 5 + Math.random() * 8,
      shape: shapes[i % 3],
    }));
  }, [count, mode]);

  // Don't render anything for reduced motion users
  if (prefersReduced) return null;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: mode === 'burst' ? `${piece.y}%` : `-5%`,
            width: piece.size,
            height: piece.size,
          }}
          initial={
            mode === 'burst'
              ? { opacity: 1, scale: 0, y: 0 }
              : { opacity: 0.7, y: 0 }
          }
          animate={
            mode === 'burst'
              ? {
                  opacity: [1, 1, 0],
                  scale: [0, 1, 0.5],
                  y: [0, -80 - Math.random() * 120, 200 + Math.random() * 300],
                  x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 300],
                  rotate: [0, piece.rotation + 360 * (Math.random() > 0.5 ? 1 : -1)],
                }
              : {
                  y: ['0vh', '110vh'],
                  x: [0, (Math.random() - 0.5) * 40],
                  rotate: [piece.rotation, piece.rotation + 720],
                  opacity: [0.6, 0.4, 0],
                }
          }
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: mode === 'burst' ? 'easeOut' : 'linear',
            repeat: mode === 'ambient' ? Infinity : 0,
          }}
        >
          <ConfettiShape shape={piece.shape} color={piece.color} size={piece.size} />
        </motion.div>
      ))}
    </div>
  );
}

function ConfettiShape({
  shape,
  color,
  size,
}: {
  shape: ConfettiPiece['shape'];
  color: string;
  size: number;
}) {
  if (shape === 'circle') {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
    );
  }

  if (shape === 'square') {
    return (
      <div
        style={{
          width: size,
          height: size * 0.6,
          borderRadius: 1,
          backgroundColor: color,
        }}
      />
    );
  }

  // triangle
  return (
    <svg width={size} height={size} viewBox="0 0 10 10">
      <polygon points="5,0 10,10 0,10" fill={color} />
    </svg>
  );
}

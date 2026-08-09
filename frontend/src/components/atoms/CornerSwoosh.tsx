import { motion, useReducedMotion } from 'framer-motion';

interface CornerSwooshProps {
  /** Position of the swoosh */
  position: 'top-right' | 'bottom-left';
  /** Size in px */
  size?: number;
  className?: string;
}

/**
 * Diagonal gradient shape mimicking the poster's corner swoosh elements.
 * Uses the red → blue → deep navy gradient.
 * Animated clip-path reveal on load.
 */
export function CornerSwoosh({
  position,
  size = 400,
  className = '',
}: CornerSwooshProps) {
  const prefersReduced = useReducedMotion();

  const isTopRight = position === 'top-right';

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        ...(isTopRight
          ? { top: 0, right: 0 }
          : { bottom: 0, left: 0 }),
        zIndex: 0,
      }}
      initial={prefersReduced ? { opacity: 0.7 } : { opacity: 0, scale: 0.7 }}
      animate={prefersReduced ? { opacity: 0.7 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient
            id={`swoosh-grad-${position}`}
            x1={isTopRight ? '100%' : '0%'}
            y1={isTopRight ? '0%' : '100%'}
            x2={isTopRight ? '0%' : '100%'}
            y2={isTopRight ? '100%' : '0%'}
          >
            <stop offset="0%" stopColor="var(--color-denso-red)" stopOpacity="0.85" />
            <stop offset="55%" stopColor="var(--color-denso-blue)" stopOpacity="0.65" />
            <stop offset="100%" stopColor="var(--color-denso-navy-deep)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient
            id={`swoosh-grad-inner-${position}`}
            x1={isTopRight ? '100%' : '0%'}
            y1={isTopRight ? '0%' : '100%'}
            x2={isTopRight ? '20%' : '80%'}
            y2={isTopRight ? '80%' : '20%'}
          >
            <stop offset="0%" stopColor="var(--color-denso-red-light)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-denso-blue)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Main swoosh shape */}
        {isTopRight ? (
          <>
            <path
              d={`M ${size} 0 L ${size} ${size * 0.7} Q ${size * 0.85} ${size * 0.5} ${size * 0.3} ${size * 0.15} Q ${size * 0.5} ${size * 0.05} ${size * 0.6} 0 Z`}
              fill={`url(#swoosh-grad-${position})`}
            />
            {/* Inner accent shape */}
            <path
              d={`M ${size} 0 L ${size} ${size * 0.45} Q ${size * 0.9} ${size * 0.3} ${size * 0.55} ${size * 0.08} Q ${size * 0.7} ${size * 0.02} ${size * 0.78} 0 Z`}
              fill={`url(#swoosh-grad-inner-${position})`}
            />
          </>
        ) : (
          <>
            <path
              d={`M 0 ${size} L 0 ${size * 0.3} Q ${size * 0.15} ${size * 0.5} ${size * 0.7} ${size * 0.85} Q ${size * 0.5} ${size * 0.95} ${size * 0.4} ${size} Z`}
              fill={`url(#swoosh-grad-${position})`}
            />
            {/* Inner accent shape */}
            <path
              d={`M 0 ${size} L 0 ${size * 0.55} Q ${size * 0.1} ${size * 0.7} ${size * 0.45} ${size * 0.92} Q ${size * 0.3} ${size * 0.98} ${size * 0.22} ${size} Z`}
              fill={`url(#swoosh-grad-inner-${position})`}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}

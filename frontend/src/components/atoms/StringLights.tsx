import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface StringLightsProps {
  /** Total width of the string */
  width?: number;
  /** Number of bulbs */
  bulbCount?: number;
  /** Height of the SVG */
  height?: number;
  /** Droop of the wire */
  droop?: number;
  className?: string;
}

/**
 * Thin strand of warm-glow dots strung between anchor points.
 * Staggered twinkle per bulb (independent timers, not unison).
 * Night-market ambience without being distracting.
 * Respects prefers-reduced-motion.
 */
export function StringLights({
  width = 800,
  bulbCount = 16,
  height = 50,
  droop = 0.3,
  className = '',
}: StringLightsProps) {
  const prefersReduced = useReducedMotion();

  const { wirePath, bulbs } = useMemo(() => {
    const padX = 15;
    const wireY0 = 8;
    const maxDroop = height * droop;

    // Build wire path
    const points: { x: number; y: number }[] = [];
    const segCount = 50;
    for (let i = 0; i <= segCount; i++) {
      const t = i / segCount;
      const x = padX + t * (width - 2 * padX);
      const y = wireY0 + 4 * maxDroop * t * (1 - t);
      points.push({ x, y });
    }

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }

    // Bulb positions
    const bulbItems = [];
    for (let i = 0; i < bulbCount; i++) {
      const t = (i + 1) / (bulbCount + 1);
      const x = padX + t * (width - 2 * padX);
      const y = wireY0 + 4 * maxDroop * t * (1 - t);
      bulbItems.push({ x, y: y + 3, index: i });
    }

    return { wirePath: path, bulbs: bulbItems };
  }, [width, bulbCount, height, droop]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      aria-hidden="true"
    >
      {/* Wire */}
      <path
        d={wirePath}
        stroke="var(--color-denso-slate-pale)"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />

      {/* Bulbs with warm glow */}
      {bulbs.map((bulb) => (
        <g key={bulb.index}>
          {/* Glow halo */}
          <motion.circle
            cx={bulb.x}
            cy={bulb.y}
            r={6}
            fill="#FFF7E0"
            opacity={0.3}
            style={{ transformOrigin: `${bulb.x}px ${bulb.y}px` }}
            animate={
              prefersReduced
                ? {}
                : {
                    opacity: [0.15, 0.35, 0.15],
                    scale: [0.85, 1.15, 0.85],
                  }
            }
            transition={{
              duration: 2.5 + (bulb.index % 4) * 0.7,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: bulb.index * 0.3,
            }}
          />
          {/* Bulb body */}
          <motion.circle
            cx={bulb.x}
            cy={bulb.y}
            r={2.5}
            fill="#FFEEBB"
            animate={
              prefersReduced
                ? {}
                : {
                    opacity: [0.6, 1, 0.6],
                  }
            }
            transition={{
              duration: 2.5 + (bulb.index % 4) * 0.7,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: bulb.index * 0.3,
            }}
          />
          {/* Tiny connector line */}
          <line
            x1={bulb.x}
            y1={bulb.y - 4.5}
            x2={bulb.x}
            y2={bulb.y - 2.5}
            stroke="var(--color-denso-slate-pale)"
            strokeWidth="0.5"
            opacity="0.4"
          />
        </g>
      ))}
    </svg>
  );
}

import { useRef, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface BuntingGarlandProps {
  /** Total width of the garland SVG */
  width?: number;
  /** Number of triangle pennants */
  flagCount?: number;
  /** How much the rope droops (0–1 scale of height) */
  droop?: number;
  /** Overall height */
  height?: number;
  className?: string;
}

/**
 * Triangular bunting / flag garland on a drooping catenary-style rope.
 * Red / white / blue alternating pennants.
 * Gentle sway animation on load, respects prefers-reduced-motion.
 */
export function BuntingGarland({
  width = 800,
  flagCount = 12,
  droop = 0.35,
  height = 80,
  className = '',
}: BuntingGarlandProps) {
  const prefersReduced = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);

  // Color cycle: red → white → blue → repeat
  const colors = [
    'var(--color-denso-red)',
    'var(--color-denso-white)',
    'var(--color-denso-blue)',
  ];

  // Generate the catenary rope path and flag positions
  const { ropePath, flags } = useMemo(() => {
    const padX = 20;
    const ropeY0 = 10; // top anchor Y
    const maxDroop = height * droop;
    const points: { x: number; y: number }[] = [];
    const segCount = 60;

    for (let i = 0; i <= segCount; i++) {
      const t = i / segCount;
      const x = padX + t * (width - 2 * padX);
      // Parabolic droop (approximates catenary for visual purposes)
      const y = ropeY0 + 4 * maxDroop * t * (1 - t);
      points.push({ x, y });
    }

    // Build SVG path
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }

    // Flag positions (evenly spaced along the rope)
    const flagItems = [];
    const flagW = (width - 2 * padX) / (flagCount + 1) * 0.6;
    for (let i = 0; i < flagCount; i++) {
      const t = (i + 1) / (flagCount + 1);
      const x = padX + t * (width - 2 * padX);
      const y = ropeY0 + 4 * maxDroop * t * (1 - t);
      const color = colors[i % 3];
      const flagH = flagW * 1.3;
      flagItems.push({ x, y, w: flagW, h: flagH, color, index: i });
    }

    return { ropePath: path, flags: flagItems };
  }, [width, flagCount, droop, height, colors]);

  return (
    <motion.svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      aria-hidden="true"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Rope */}
      <path
        d={ropePath}
        stroke="var(--color-denso-slate-pale)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Flags */}
      {flags.map((flag) => (
        <motion.polygon
          key={flag.index}
          points={`${flag.x - flag.w / 2},${flag.y} ${flag.x + flag.w / 2},${flag.y} ${flag.x},${flag.y + flag.h}`}
          fill={flag.color}
          stroke={flag.color === 'var(--color-denso-white)' ? 'var(--color-denso-slate-pale)' : 'none'}
          strokeWidth="0.5"
          style={{ transformOrigin: `${flag.x}px ${flag.y}px` }}
          animate={
            prefersReduced
              ? {}
              : {
                  rotate: [0, 1.5, 0, -1.5, 0],
                }
          }
          transition={{
            duration: 3 + (flag.index % 3) * 0.5,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: flag.index * 0.15,
          }}
        />
      ))}

      {/* Rope anchor dots */}
      <circle cx={20} cy={10} r="3" fill="var(--color-denso-slate-pale)" />
      <circle cx={width - 20} cy={10} r="3" fill="var(--color-denso-slate-pale)" />
    </motion.svg>
  );
}

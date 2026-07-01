import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

interface FloatingShapeProps {
  className?: string;
  variant?: 'circle' | 'blob' | 'ring' | 'dot';
  color?: string;
  size?: number;
  delay?: number;
  duration?: number;
  opacity?: number;
}

export function FloatingShape({
  className,
  variant = 'circle',
  color = 'rgba(56, 189, 248, 0.15)',
  size = 200,
  delay = 0,
  duration = 6,
  opacity = 0.5,
}: FloatingShapeProps) {
  const shapeStyles: Record<string, string> = {
    circle: 'rounded-full',
    blob: 'blob',
    ring: 'rounded-full border-2 bg-transparent',
    dot: 'rounded-full',
  };

  return (
    <motion.div
      className={cn(
        'absolute pointer-events-none select-none',
        shapeStyles[variant],
        className
      )}
      style={{
        width: variant === 'dot' ? size / 4 : size,
        height: variant === 'dot' ? size / 4 : size,
        background: variant === 'ring' ? 'transparent' : color,
        borderColor: variant === 'ring' ? color : undefined,
        borderWidth: variant === 'ring' ? 2 : undefined,
        opacity,
      }}
      animate={{
        y: [0, -20, -10, 0],
        x: [0, 10, -5, 0],
        rotate: [0, 5, -3, 0],
        scale: [1, 1.05, 0.98, 1],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    />
  );
}

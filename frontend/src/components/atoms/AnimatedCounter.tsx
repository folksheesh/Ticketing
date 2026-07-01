import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/cn';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  duration?: number;
  formatFn?: (n: number) => string;
}

export function AnimatedCounter({
  value,
  className,
  duration = 2,
  formatFn,
}: AnimatedCounterProps) {
  const springValue = useSpring(0, { duration: duration * 1000 });
  const displayValue = useTransform(springValue, (latest) => {
    const rounded = Math.round(latest);
    return formatFn ? formatFn(rounded) : rounded.toString();
  });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    const unsubscribe = displayValue.on('change', (latest) => {
      setDisplay(latest);
    });
    return unsubscribe;
  }, [displayValue]);

  return (
    <motion.span className={cn('tabular-nums', className)}>
      {display}
    </motion.span>
  );
}

/* ===== Flip Counter (for countdown) ===== */
interface FlipDigitProps {
  value: number;
  label: string;
}

export function FlipDigit({ value, label }: FlipDigitProps) {
  const prevValueRef = useRef(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setFlip(true);
      const timeout = setTimeout(() => setFlip(false), 300);
      prevValueRef.current = value;
      return () => clearTimeout(timeout);
    }
  }, [value]);

  const displayValue = value.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className={cn(
          'relative rounded-[1.5rem] overflow-hidden',
          'bg-white/10 backdrop-blur-xl border border-white/20',
          'px-5 py-4 md:px-8 md:py-6 min-w-[76px] md:min-w-[110px]',
          'flex items-center justify-center',
          'shadow-[0_8px_32px_rgba(0,0,0,0.12)]'
        )}
        animate={flip ? { rotateX: [0, -15, 0], scale: [1, 1.05, 1], y: [0, -5, 0] } : {}}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Glossy Top Highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-[1.5rem]" />
        
        <span className="relative z-10 text-4xl md:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tabular-nums drop-shadow-md">
          {displayValue}
        </span>
      </motion.div>
      <span className="text-xs md:text-sm font-sans font-bold text-white/70 uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}

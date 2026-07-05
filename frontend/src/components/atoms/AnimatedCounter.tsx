import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/cn';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  duration?: number;
  formatFn?: (n: number) => string;
}

export function AnimatedCounter({ value, className, duration = 2, formatFn }: AnimatedCounterProps) {
  const springValue = useSpring(0, { duration: duration * 1000 });
  const displayValue = useTransform(springValue, (latest) => {
    const rounded = Math.round(latest);
    return formatFn ? formatFn(rounded) : rounded.toString();
  });
  const [display, setDisplay] = useState('0');

  useEffect(() => { springValue.set(value); }, [value, springValue]);
  useEffect(() => {
    const unsub = displayValue.on('change', setDisplay);
    return unsub;
  }, [displayValue]);

  return <motion.span className={cn('tabular-nums', className)}>{display}</motion.span>;
}

/* ===== Flip counter — renders on Denso-red background ===== */
interface FlipDigitProps {
  value: number;
  label: string;
}

export function FlipDigit({ value, label }: FlipDigitProps) {
  const prevRef = useRef(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setFlip(true);
      const t = setTimeout(() => setFlip(false), 300);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  const display = value.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-2.5">
      <motion.div
        className="relative rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          background: 'rgba(255,255,255,0.18)',
          border: '1px solid rgba(255,255,255,0.28)',
          backdropFilter: 'blur(8px)',
          minWidth: '68px',
          padding: '12px 16px',
        }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore — md breakpoint handled via inline style override below
        animate={flip ? { rotateX: [0, -8, 0], scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Shine */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ background: 'linear-gradient(135deg, transparent 40%, white 50%, transparent 60%)' }}
        />
        <span
          className="font-display font-bold tabular-nums text-white"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', lineHeight: 1 }}
        >
          {display}
        </span>
      </motion.div>
      <span
        className="font-sans font-medium uppercase tracking-widest"
        style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)' }}
      >
        {label}
      </span>
    </div>
  );
}

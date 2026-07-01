import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  variant?: 'primary' | 'sky' | 'amber' | 'custom';
  from?: string;
  to?: string;
}

export function GradientText({
  children,
  className,
  as: Component = 'span',
  variant = 'amber',
  from,
  to,
}: GradientTextProps) {
  const gradientClass =
    variant === 'primary' ? 'text-gradient' :
    variant === 'sky'     ? 'text-gradient-sky' :
    variant === 'amber'   ? 'text-gradient-amber' :
    '';

  const customStyle =
    variant === 'custom' && from && to
      ? {
          background: `linear-gradient(135deg, ${from}, ${to})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }
      : undefined;

  return (
    <Component className={cn(gradientClass, className)} style={customStyle}>
      {children}
    </Component>
  );
}

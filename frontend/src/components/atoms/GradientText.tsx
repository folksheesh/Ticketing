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
  variant = 'primary',
  from,
  to,
}: GradientTextProps) {
  // All gradient variants use the Denso red palette
  const gradientClass =
    variant === 'custom' ? '' : 'text-gradient';

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

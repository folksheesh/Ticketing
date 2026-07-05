import { useCallback, useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/cn';

interface RippleButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

/* All styles defined as plain objects — no Tailwind color classes */
function getVariantStyle(variant: string): CSSProperties {
  switch (variant) {
    case 'primary':
      return {
        background: '#DC0032',
        color: '#FFFFFF',
        boxShadow: '0 4px 16px rgba(220,0,50,0.30)',
        border: 'none',
      };
    case 'secondary':
      return {
        background: '#4A565E',
        color: '#FFFFFF',
        border: 'none',
      };
    case 'outline':
      return {
        background: 'transparent',
        color: '#DC0032',
        border: '2px solid #DC0032',
      };
    case 'ghost':
    default:
      return {
        background: 'transparent',
        color: '#6B7882',
        border: '1px solid transparent',
      };
  }
}

const sizeStyles: Record<string, string> = {
  sm:  'px-4 py-2 text-sm rounded-lg gap-1.5',
  md:  'px-6 py-3 text-base rounded-xl gap-2',
  lg:  'px-8 py-4 text-base rounded-xl gap-2.5',
  xl:  'px-10 py-5 text-lg rounded-2xl gap-3',
};

export function RippleButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  className,
  style,
  onClick,
  disabled,
  ...props
}: RippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      const button = buttonRef.current;
      if (button) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const sz = Math.max(rect.width, rect.height);
        ripple.style.width  = ripple.style.height = `${sz}px`;
        ripple.style.left   = `${e.clientX - rect.left - sz / 2}px`;
        ripple.style.top    = `${e.clientY - rect.top  - sz / 2}px`;
        ripple.className    = 'ripple';
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }

      onClick?.(e as never);
    },
    [onClick, disabled, loading]
  );

  const variantStyle = getVariantStyle(variant);

  return (
    <motion.button
      ref={buttonRef}
      whileHover={disabled || loading ? undefined : { scale: 1.02, y: -2 }}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'ripple-container relative inline-flex items-center justify-center',
        'font-semibold transition-all duration-200 cursor-pointer select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      style={{ ...variantStyle, ...style }}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left'  && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </motion.button>
  );
}

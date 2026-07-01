import { useCallback, useRef, type ReactNode } from 'react';
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

const variantStyles = {
  primary:
    'bg-gradient-to-r from-denso-amber to-denso-amber-deep text-denso-navy-dark font-bold shadow-[0_4px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.5)]',
  secondary:
    'bg-denso-navy text-white hover:bg-denso-navy-dark shadow-button',
  outline:
    'border-2 border-denso-navy text-denso-navy hover:bg-denso-navy hover:text-white',
  ghost:
    'text-denso-slate-light hover:bg-denso-gray-50 hover:text-denso-slate',
};

const sizeStyles = {
  sm:  'px-4 py-2 text-sm rounded-lg gap-1.5',
  md:  'px-6 py-3 text-base rounded-xl gap-2',
  lg:  'px-8 py-4 text-lg rounded-xl gap-2.5',
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
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top  = `${e.clientY - rect.top - size / 2}px`;
        ripple.className = 'ripple';
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }

      onClick?.(e as never);
    },
    [onClick, disabled, loading]
  );

  return (
    <motion.button
      ref={buttonRef}
      whileHover={disabled || loading ? undefined : { scale: 1.02, y: -2 }}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'ripple-container relative inline-flex items-center justify-center',
        'font-semibold font-display transition-all duration-300 cursor-pointer select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-denso-amber',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left'  && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </motion.button>
  );
}

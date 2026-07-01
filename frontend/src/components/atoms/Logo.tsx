import { cn } from '../../lib/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  onDark?: boolean;
}

export function Logo({ className, size = 'md', variant = 'full', onDark = false }: LogoProps) {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  return (
    <div
      className={cn('flex items-center gap-2.5', className)}
      aria-label="Denso Family Gathering 2026"
    >
      {/* Denso-inspired arc mark */}
      <div className={cn('relative flex-shrink-0', sizes[size], 'aspect-square')}>
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" aria-hidden="true">
          {/* Navy base circle */}
          <circle cx="24" cy="24" r="20" fill="#0054A6" />
          {/* White outer arc */}
          <path
            d="M24 6C14.06 6 6 14.06 6 24s8.06 18 18 18"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          {/* Amber inner arc — the signature */}
          <path
            d="M24 13c-6.07 0-11 4.93-11 11s4.93 11 11 11"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Center dot */}
          <circle cx="24" cy="24" r="3" fill="white" />
          {/* Amber accent arc */}
          <path
            d="M31 10a15 15 0 0 1 7 14"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display font-bold tracking-tight',
              size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : 'text-2xl',
              onDark ? 'text-white' : 'text-denso-navy'
            )}
          >
            DENSO
          </span>
          <span
            className={cn(
              'font-sans font-medium tracking-wide',
              size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm',
              onDark ? 'text-denso-amber' : 'text-denso-gray-500'
            )}
          >
            Family Gathering
          </span>
        </div>
      )}
    </div>
  );
}

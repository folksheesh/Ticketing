interface WaveDividerProps {
  /** Color of the wave. Defaults to royal blue. */
  color?: string;
  /** Flip vertically (place at top of section instead of bottom) */
  flip?: boolean;
  /** Height of the wave in px */
  height?: number;
  className?: string;
}

/**
 * SVG wave shape section divider — matches the poster's bottom wave band.
 * Use between sections to create visual rhythm.
 */
export function WaveDivider({
  color = 'var(--color-denso-blue)',
  flip = false,
  height = 60,
  className = '',
}: WaveDividerProps) {
  return (
    <div
      className={`w-full overflow-hidden leading-[0] ${className}`}
      style={{
        transform: flip ? 'rotate(180deg)' : undefined,
        height,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <path
          d="M0,40 C240,100 480,0 720,60 C960,120 1200,20 1440,80 L1440,120 L0,120 Z"
          fill={color}
        />
        {/* Subtle second wave layer for depth */}
        <path
          d="M0,60 C200,20 400,90 720,40 C1040,0 1240,80 1440,50 L1440,120 L0,120 Z"
          fill={color}
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

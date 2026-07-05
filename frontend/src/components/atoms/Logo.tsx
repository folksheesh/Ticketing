import { cn } from '../../lib/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  /**
   * onDark — renders the wordmark in white.
   * Use this on red / dark backgrounds.
   * Default (false) renders in Denso red #DC0032.
   */
  onDark?: boolean;
}

const sizeMap = {
  sm: { h: 30, w: 110 },
  md: { h: 40, w: 148 },
  lg: { h: 54, w: 200 },
};

/**
 * Denso wordmark reproduced as inline SVG.
 *
 * "DENSO"            — bold italic condensed sans
 * "Crafting the Core"— regular upright sans, same colour
 *
 * onDark=false  → colour #DC0032  (red on white / light bg)
 * onDark=true   → colour #FFFFFF  (white on red / dark bg)
 *
 * To swap in the real PNG later:
 *   1. Drop denso-logo-red.png  into src/assets/
 *   2. Drop denso-logo-white.png into src/assets/
 *   3. Replace the <svg> with:
 *        <img src={onDark ? whiteUrl : redUrl} alt="Denso" style={{ height: sizeMap[size].h }} />
 */
export function Logo({ className, size = 'md', onDark = false }: LogoProps) {
  const { h, w } = sizeMap[size];
  const color = onDark ? '#FFFFFF' : '#DC0032';

  return (
    <div
      className={cn('inline-flex items-center flex-shrink-0', className)}
      aria-label="Denso — Crafting the Core"
    >
      <svg
        width={w}
        height={h}
        viewBox="0 0 200 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        style={{ display: 'block' }}
      >
        {/*
          DENSO — bold condensed italic.
          Nunito Black Italic (loaded via Google Fonts) is the closest
          free match to the real typeface's rounded strokes and weight.
          Falls back to Impact / Arial Narrow for users without web fonts.
        */}
        <text
          x="0"
          y="36"
          fill={color}
          fontFamily="'Nunito', 'Franklin Gothic Heavy', Impact, 'Arial Narrow', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="40"
          letterSpacing="-0.5"
        >
          DENSO
        </text>

        {/* Crafting the Core — regular weight, tighter */}
        <text
          x="2"
          y="50"
          fill={color}
          fontFamily="'DM Sans', 'Arial', Helvetica, sans-serif"
          fontWeight="400"
          fontStyle="normal"
          fontSize="13"
          letterSpacing="0.15"
        >
          Crafting the Core
        </text>
      </svg>
    </div>
  );
}

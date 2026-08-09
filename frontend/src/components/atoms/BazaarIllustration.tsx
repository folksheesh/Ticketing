export function BazaarIllustration({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 800 1200" 
      preserveAspectRatio="xMidYMid slice" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* ── Semi-transparent Watermark Tent ── */}
        <g id="reg-tent">
          {/* Main Tent Body */}
          <path d="M70 200 L330 200 L310 340 L90 340 Z" fill="white" fillOpacity="0.03" />
          {/* Stripes */}
          <path d="M110 200 L140 200 L130 340 L100 340 Z" fill="white" fillOpacity="0.06" />
          <path d="M190 200 L210 200 L205 340 L195 340 Z" fill="white" fillOpacity="0.06" />
          <path d="M260 200 L290 200 L300 340 L270 340 Z" fill="white" fillOpacity="0.06" />
          {/* Entrance */}
          <path d="M160 340 L200 240 L240 340 Z" fill="white" fillOpacity="0.02" />
          {/* Roof Base */}
          <path d="M200 50 L350 200 L50 200 Z" fill="white" fillOpacity="0.1" />
          {/* Roof Stripes */}
          <path d="M200 50 L250 200 L150 200 Z" fill="white" fillOpacity="0.08" />
          <path d="M200 50 L310 200 L280 200 Z" fill="white" fillOpacity="0.08" />
          <path d="M200 50 L120 200 L90 200 Z" fill="white" fillOpacity="0.08" />
          {/* Awning */}
          <path d="M50 200 Q75 220 100 200 Q125 220 150 200 Q175 220 200 200 Q225 220 250 200 Q275 220 300 200 Q325 220 350 200" fill="white" fillOpacity="0.1" />
          <path d="M90 200 Q105 215 120 200" fill="white" fillOpacity="0.08" />
          <path d="M150 200 Q175 220 200 200 Q225 220 250 200" fill="white" fillOpacity="0.08" />
          <path d="M280 200 Q295 215 310 200" fill="white" fillOpacity="0.08" />
          {/* Top Pole & Flag */}
          <rect x="198" y="20" width="4" height="40" fill="white" fillOpacity="0.15" />
          <path d="M202 25 L250 35 L202 45 Z" fill="white" fillOpacity="0.12" />
        </g>

        {/* ── Music Notes ── */}
        <g id="music-note-1" fill="white" opacity="0.08">
          <path d="M20 40 A 10 10 0 1 1 0 40 A 10 10 0 1 1 20 40 M 18 40 L 18 0 L 40 10 L 40 15 L 22 7 L 22 40" />
        </g>
        <g id="music-note-2" fill="white" opacity="0.06">
          <path d="M15 30 A 8 8 0 1 1 0 30 A 8 8 0 1 1 15 30 M 13 30 L 13 0 L 25 5 L 25 10 L 17 6 L 17 30" />
        </g>

        {/* ── Food & Drink Icons ── */}
        <g id="icon-drink" fill="white" opacity="0.08">
          <path d="M5 10 L35 10 L30 50 L10 50 Z" />
          <rect x="3" y="5" width="34" height="5" rx="2" />
          <line x1="20" y1="5" x2="28" y2="-15" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g id="icon-icecream" fill="white" opacity="0.07">
          <path d="M10 20 L30 20 L20 55 Z" />
          <circle cx="20" cy="12" r="13" />
          <circle cx="10" cy="20" r="6" />
          <circle cx="30" cy="20" r="6" />
        </g>
      </defs>

      {/* Background base */}
      <rect width="800" height="1200" fill="var(--color-denso-blue-dark)" />
      
      {/* Subtle Light glows */}
      <circle cx="400" cy="1100" r="500" fill="var(--color-denso-red)" opacity="0.25" filter="blur(120px)" />
      <circle cx="100" cy="200" r="400" fill="var(--color-denso-blue)" opacity="0.4" filter="blur(100px)" />
      
      {/* ── Buntings / Flags hanging from top (Kept subtle) ── */}
      <path d="M-50 100 Q150 250 400 150 Q600 50 850 150" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <path d="M-50 300 Q200 450 450 300 Q650 200 850 300" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
      
      {/* Flag triangles row 1 */}
      <g fill="var(--color-denso-red)" opacity="0.2">
        <polygon points="50,155 70,210 90,165" />
        <polygon points="250,195 270,250 290,195" />
        <polygon points="550,110 570,160 590,120" />
        <polygon points="750,140 770,190 790,150" />
      </g>
      <g fill="var(--color-denso-sky)" opacity="0.2">
        <polygon points="150,190 170,240 190,190" />
        <polygon points="350,165 370,220 390,160" />
        <polygon points="450,120 470,170 490,110" />
        <polygon points="650,110 670,160 690,120" />
      </g>

      {/* ── Tents at the bottom (Watermark style) ── */}
      {/* Left Back Tent */}
      <use href="#reg-tent" transform="translate(30, 950) scale(0.65) translate(-200, -350)" />
      {/* Right Back Tent */}
      <use href="#reg-tent" transform="translate(730, 900) scale(0.75) translate(-200, -350)" />
      {/* Center Front Tent */}
      <use href="#reg-tent" transform="translate(400, 1080) scale(1.1) translate(-200, -350)" />

      {/* ── Spaced out floating elements (Notes, Drinks, Ice Cream) ── */}
      
      {/* Top Left Area */}
      <use href="#music-note-2" transform="translate(120, 300) rotate(15) scale(2.2)" />
      <use href="#icon-icecream" transform="translate(250, 200) rotate(-20) scale(1.5)" />

      {/* Top Right Area */}
      <use href="#music-note-1" transform="translate(680, 250) rotate(-15) scale(2)" />
      <use href="#icon-drink" transform="translate(550, 320) rotate(20) scale(1.8)" />

      {/* Mid Left Area */}
      <use href="#music-note-1" transform="translate(50, 500) rotate(-10) scale(1.6)" />
      <use href="#icon-drink" transform="translate(80, 700) rotate(15) scale(1.5)" />

      {/* Mid Right Area */}
      <use href="#music-note-2" transform="translate(720, 480) rotate(-15) scale(2.5)" />
      <use href="#icon-icecream" transform="translate(650, 650) rotate(25) scale(1.8)" />
      
      {/* Extra floating notes */}
      <use href="#music-note-1" transform="translate(380, 250) rotate(10) scale(1.5)" />
      <use href="#music-note-2" transform="translate(750, 750) rotate(-5) scale(1.8)" />

      {/* ── Confetti & Stars ── */}
      <circle cx="300" cy="200" r="4" fill="white" opacity="0.2" />
      <circle cx="500" cy="400" r="6" fill="white" opacity="0.15" />
      <circle cx="200" cy="750" r="5" fill="white" opacity="0.15" />
      <circle cx="700" cy="600" r="4" fill="white" opacity="0.2" />
      <circle cx="650" cy="250" r="5" fill="white" opacity="0.15" />
      <circle cx="100" cy="650" r="4" fill="white" opacity="0.1" />
      
      {/* Light bursts */}
      <path d="M100 100 L110 80 L120 100 L140 110 L120 120 L110 140 L100 120 L80 110 Z" fill="white" opacity="0.05" />
      <path d="M600 800 L610 780 L620 800 L640 810 L620 820 L610 840 L600 820 L580 810 Z" fill="white" opacity="0.08" />
      <path d="M300 950 L305 935 L310 950 L325 955 L310 960 L305 975 L300 960 L285 955 Z" fill="white" opacity="0.06" />
    </svg>
  );
}

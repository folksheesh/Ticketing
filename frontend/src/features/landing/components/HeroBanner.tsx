import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router';
import { RippleButton } from '../../../components/atoms/RippleButton';
import { CornerSwoosh } from '../../../components/atoms/CornerSwoosh';
import { BuntingGarland } from '../../../components/atoms/BuntingGarland';
import { ConfettiLayer } from '../../../components/atoms/ConfettiLayer';
import { WaveDivider } from '../../../components/atoms/WaveDivider';
import { ROUTES } from '../../../constants/routes';
import { EVENT_CONFIG } from '../../../constants/event';

/* ── Stagger config ── */
const stagger = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export function HeroBanner() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax for skyline — subtle Y shift
  const skylineY = useTransform(scrollYProgress, [0, 1], [0, 60]);


  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, var(--color-denso-sky-light) 0%, var(--color-denso-white) 55%)',
      }}
      aria-label="Hero banner"
    >
      {/* Corner swoosh — top-right */}
      <CornerSwoosh position="top-right" size={450} />

      {/* Corner swoosh — bottom-left */}
      <CornerSwoosh position="bottom-left" size={350} />

      {/* Ambient confetti */}
      <ConfettiLayer count={15} mode="ambient" />

      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-denso-sky) 0.5px, transparent 0.5px)',
          backgroundSize: '36px 36px',
          opacity: 0.12,
        }}
      />


      {/* Skyline silhouette — pale sky blue, parallax */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ y: prefersReduced ? 0 : skylineY }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 200"
          fill="none"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '160px', display: 'block' }}
        >
          {/* City skyline silhouette */}
          <path
            d="M0,200 L0,150 L40,150 L40,100 L55,100 L55,80 L70,80 L70,100 L90,100 L90,140 L120,140 L120,90 L130,70 L140,90 L140,60 L155,40 L170,60 L170,90 L185,90 L185,130 L220,130 L220,80 L235,60 L250,80 L250,110 L270,110 L270,70 L280,50 L290,70 L290,110 L320,110 L320,140 L360,140 L360,100 L375,80 L390,100 L390,60 L400,40 L410,60 L410,100 L440,100 L440,130 L480,130 L480,90 L495,70 L510,90 L510,120 L550,120 L550,80 L560,65 L570,80 L570,120 L600,120 L600,150 L650,150 L650,110 L665,90 L680,110 L680,70 L695,45 L710,70 L710,110 L740,110 L740,140 L780,140 L780,100 L800,80 L820,100 L820,130 L860,130 L860,90 L875,65 L890,90 L890,60 L900,35 L910,60 L910,90 L940,90 L940,120 L970,120 L970,140 L1010,140 L1010,100 L1025,75 L1040,100 L1040,130 L1080,130 L1080,80 L1095,55 L1110,80 L1110,120 L1140,120 L1140,150 L1180,150 L1180,110 L1200,90 L1220,110 L1220,70 L1230,50 L1240,70 L1240,110 L1280,110 L1280,140 L1320,140 L1320,100 L1340,80 L1360,100 L1360,130 L1400,130 L1400,150 L1440,150 L1440,200 Z"
            fill="var(--color-denso-sky)"
            opacity="0.25"
          />
          {/* Decorative circles */}
          <circle cx="300" cy="60" r="30" stroke="var(--color-denso-sky)" strokeWidth="1" fill="none" opacity="0.3" />
          <circle cx="900" cy="45" r="20" stroke="var(--color-denso-sky)" strokeWidth="0.8" fill="none" opacity="0.25" />
          <circle cx="1200" cy="70" r="25" stroke="var(--color-denso-sky-dark)" strokeWidth="0.8" fill="none" opacity="0.2" />
        </svg>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: copy ── */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            {/* Ribbon badge */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-display font-semibold uppercase tracking-widest"
                style={{
                  background: 'var(--color-denso-blue-pale)',
                  color: 'var(--color-denso-blue)',
                  border: '1px solid var(--color-denso-blue)',
                  borderColor: 'rgba(30, 63, 143, 0.2)',
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-denso-red)' }} />
                DENSO Indonesia Group
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUp} transition={{ duration: 0.6, delay: 0.12 }}>
              <h1 className="font-display font-extrabold tracking-tight" style={{ lineHeight: 1.05 }}>
                {/* DENSOnesia */}
                <span
                  className="block"
                  style={{
                    fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
                    color: 'var(--color-denso-blue)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.05em',
                  }}
                >
                  DENSOnesia
                </span>
                {/* BAZZAR — the massive display word */}
                <span
                  className="block"
                  style={{
                    fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                    color: 'var(--color-denso-red)',
                    fontFamily: 'var(--font-hero)',
                    letterSpacing: '-0.02em',
                    lineHeight: 0.95,
                  }}
                >
                  BAZZAR
                </span>
                {/* Pesta Rakyat — script tagline */}
                <span
                  className="block mt-1"
                  style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
                    color: 'var(--color-denso-blue)',
                    fontFamily: 'var(--font-script)',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                  }}
                >
                  Pesta Rakyat
                </span>
              </h1>
            </motion.div>

            {/* Sub-headline */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg font-display font-bold"
              style={{ color: 'var(--color-denso-blue)' }}
            >
              Family Gathering 2026
            </motion.p>

            {/* Tagline */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="font-sans font-light leading-relaxed max-w-md"
              style={{ fontSize: '1.05rem', color: 'var(--color-denso-slate-mid)' }}
            >
              Satu hari penuh kebersamaan bersama keluarga Denso.{' '}
              <span className="font-semibold" style={{ color: 'var(--color-denso-slate)' }}>
                15.000 karyawan
              </span>{' '}
              dan keluarga mereka, satu perayaan bersama.
            </motion.p>

            {/* Date pill */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.36 }}
            >
              <span
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-display font-bold text-white"
                style={{
                  background: 'linear-gradient(90deg, var(--color-denso-blue) 0%, var(--color-denso-blue-dark) 100%)',
                  boxShadow: '0 4px 16px rgba(30, 63, 143, 0.3)',
                }}
              >
                <Calendar className="w-4 h-4" />
                13 September 2026
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.44 }}
              className="flex flex-col sm:flex-row items-start gap-3 pt-2"
            >
              <Link to={ROUTES.REGISTER}>
                <RippleButton size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                  Daftar Sekarang
                </RippleButton>
              </Link>
              <a href="#schedule">
                <RippleButton variant="outline" size="lg">
                  Lihat Jadwal
                </RippleButton>
              </a>
            </motion.div>

            {/* Venue strip */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.52 }}
              className="flex items-center gap-2 font-sans text-sm pt-2"
              style={{ color: 'var(--color-denso-slate-mid)' }}
            >
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-denso-blue)' }} />
              <span>{EVENT_CONFIG.venue.name}, {EVENT_CONFIG.venue.city}</span>
            </motion.div>
          </motion.div>

          {/* ── Right: decorative motif ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="relative w-[460px] h-[460px]">
              {/* Background radial */}
              <div
                className="absolute inset-[8%] rounded-full"
                style={{
                  background: 'radial-gradient(circle at 40% 40%, rgba(30, 63, 143, 0.08) 0%, rgba(169, 201, 236, 0.06) 50%, transparent 100%)',
                }}
              />

              <svg viewBox="0 0 460 460" fill="none" className="absolute inset-0 w-full h-full">
                {/* Outer dashed ring */}
                <circle cx="230" cy="230" r="210" stroke="var(--color-denso-sky)" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="6 10" />

                {/* Large blue arc — 270° sweep */}
                <motion.path
                  d="M230 24 A206 206 0 1 1 24 230"
                  stroke="var(--color-denso-blue)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
                />

                {/* Mid red arc — 200° sweep */}
                <motion.path
                  d="M230 68 A162 162 0 1 1 95 340"
                  stroke="var(--color-denso-red)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.75 }}
                />

                {/* Inner sky blue arc — 160° sweep */}
                <motion.path
                  d="M230 115 A115 115 0 1 1 125 325"
                  stroke="var(--color-denso-sky)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.0 }}
                />

                {/* Inner ring */}
                <motion.circle
                  cx="230" cy="230" r="58"
                  stroke="var(--color-denso-sky)"
                  strokeWidth="1.5"
                  strokeOpacity="0.25"
                  fill="none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                  style={{ transformOrigin: '230px 230px' }}
                />

                {/* Center dot — blue */}
                <motion.circle
                  cx="230" cy="230" r="10"
                  fill="var(--color-denso-blue)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 1.5 }}
                  style={{ transformOrigin: '230px 230px' }}
                />

                {/* Arc endpoint dots */}
                <motion.circle cx="230" cy="24" r="6" fill="var(--color-denso-blue)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} />
                <motion.circle cx="24" cy="230" r="5" fill="var(--color-denso-red)" fillOpacity="0.5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }} />
              </svg>

              {/* Center badge */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center text-center gap-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                <span
                  className="font-display font-extrabold tabular-nums"
                  style={{ fontSize: '3.75rem', lineHeight: 1, color: 'var(--color-denso-blue)' }}
                >
                  15K
                </span>
                <span
                  className="font-sans font-medium uppercase tracking-wide text-xs"
                  style={{ color: 'var(--color-denso-slate-mid)' }}
                >
                  Karyawan &amp; Keluarga
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <WaveDivider color="var(--color-denso-blue)" height={50} />
      </div>
    </section>
  );
}

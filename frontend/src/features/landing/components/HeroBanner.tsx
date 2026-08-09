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

      {/* Bunting garland across the top */}
      <div className="absolute top-16 left-0 right-0 pointer-events-none z-10" aria-hidden="true">
        <BuntingGarland width={1600} flagCount={18} droop={0.4} height={70} />
      </div>

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
              Satu hari penuh kebersamaan bersama keluarga besar DENSO.{' '}
              <span className="font-semibold" style={{ color: 'var(--color-denso-slate)' }}>
                Nikmati hiburan, bazar UMKM, dan ragam aktivitas seru
              </span>{' '}
              dalam satu perayaan tak terlupakan.
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
            className="hidden lg:flex items-center justify-center relative"
            aria-hidden="true"
          >
            {/* Floating elements animation wrapper */}
            <motion.div
              animate={prefersReduced ? {} : { y: [-12, 12, -12] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-[400px] h-[480px] flex items-center justify-center"
            >
              
              {/* Back Ticket (Blue) */}
              <motion.div 
                className="absolute inset-0 rounded-[2rem]"
                style={{
                  background: 'linear-gradient(135deg, var(--color-denso-blue) 0%, var(--color-denso-blue-dark) 100%)',
                  transform: 'rotate(8deg) translateX(24px) translateY(12px)',
                  boxShadow: '0 20px 40px rgba(30,63,143,0.2)'
                }}
              />
              
              {/* Front Ticket (White) */}
              <div 
                className="relative bg-white rounded-[2rem] overflow-hidden flex flex-col z-10 w-[340px] h-[450px]"
                style={{
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(30,63,143,0.05)',
                  transform: 'rotate(-4deg)'
                }}
              >
                {/* Ticket Header */}
                <div 
                  className="h-[140px] relative overflow-hidden flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-denso-red)' }}
                >
                  <div className="absolute -right-4 -bottom-4 opacity-20" aria-hidden="true">
                    <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
                  </div>
                  <h3 className="text-white font-display font-extrabold text-3xl tracking-[0.2em] uppercase relative z-10 pl-2">
                    VIP PASS
                  </h3>
                </div>
                
                {/* Ticket Body */}
                <div 
                  className="p-8 flex-1 flex flex-col relative bg-white"
                  style={{
                    backgroundImage: 'radial-gradient(circle, var(--color-denso-slate-pale) 1.5px, transparent 1.5px)',
                    backgroundSize: '16px 16px'
                  }}
                >
                  <div className="mb-auto">
                    <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--color-denso-slate-soft)' }}>Event</p>
                    <p className="font-display font-extrabold text-[26px] leading-[1.1]" style={{ color: 'var(--color-denso-slate-dark)' }}>
                      DENSOnesia<br/>Bazzar
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-3.5">
                       <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--color-denso-blue-pale)' }}>
                         <Calendar className="w-5 h-5" style={{ color: 'var(--color-denso-blue)' }} />
                       </div>
                       <div>
                         <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-denso-slate-soft)' }}>Tanggal</p>
                         <p className="font-bold text-sm" style={{ color: 'var(--color-denso-slate-dark)' }}>13 Sept 2026</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3.5">
                       <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--color-denso-red-pale)' }}>
                         <MapPin className="w-5 h-5" style={{ color: 'var(--color-denso-red)' }} />
                       </div>
                       <div>
                         <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-denso-slate-soft)' }}>Lokasi</p>
                         <p className="font-bold text-sm line-clamp-1" style={{ color: 'var(--color-denso-slate-dark)' }}>Buperta Cibubur</p>
                       </div>
                     </div>
                  </div>
                  
                  {/* Barcode line */}
                  <div className="pt-6 flex justify-between items-center border-t-[2.5px] border-dashed" style={{ borderColor: 'var(--color-denso-slate-mist)' }}>
                     <div className="flex gap-[4px] h-10 opacity-70">
                        <div className="w-1 h-full rounded-full" style={{ background: 'var(--color-denso-slate-dark)' }} />
                        <div className="w-[3px] h-full rounded-full" style={{ background: 'var(--color-denso-slate-dark)' }} />
                        <div className="w-[7px] h-full rounded-full" style={{ background: 'var(--color-denso-slate-dark)' }} />
                        <div className="w-1 h-full rounded-full" style={{ background: 'var(--color-denso-slate-dark)' }} />
                        <div className="w-[6px] h-full rounded-full" style={{ background: 'var(--color-denso-slate-dark)' }} />
                        <div className="w-[2px] h-full rounded-full" style={{ background: 'var(--color-denso-slate-dark)' }} />
                        <div className="w-[5px] h-full rounded-full" style={{ background: 'var(--color-denso-slate-dark)' }} />
                        <div className="w-[3px] h-full rounded-full" style={{ background: 'var(--color-denso-slate-dark)' }} />
                        <div className="w-[8px] h-full rounded-full" style={{ background: 'var(--color-denso-slate-dark)' }} />
                        <div className="w-1 h-full rounded-full" style={{ background: 'var(--color-denso-slate-dark)' }} />
                     </div>
                     <p className="font-mono text-xs font-bold tracking-widest" style={{ color: 'var(--color-denso-slate-soft)' }}>#DENSO-26</p>
                  </div>
                </div>
                
                {/* Side cutouts (the ticket perforations) */}
                <div 
                  className="absolute left-0 top-[140px] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-inner" 
                  style={{ background: 'var(--color-denso-sky-light)' }} 
                />
                <div 
                  className="absolute right-0 top-[140px] translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-inner" 
                  style={{ background: 'var(--color-denso-sky-light)' }} 
                />
              </div>

              {/* Decorative floating shapes around the ticket */}
              <motion.div 
                className="absolute -top-6 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-60 z-0"
                style={{ background: 'var(--color-denso-red)' }}
                animate={prefersReduced ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full blur-[50px] opacity-50 z-0"
                style={{ background: 'var(--color-denso-blue)' }}
                animate={prefersReduced ? {} : { scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              />
              
            </motion.div>
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

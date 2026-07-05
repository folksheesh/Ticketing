import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { RippleButton } from '../../../components/atoms/RippleButton';
import { staggerContainer, fadeInUp, fadeInRight } from '../../../lib/animations';
import { ROUTES } from '../../../constants/routes';
import { EVENT_CONFIG } from '../../../constants/event';

export function HeroBanner() {
  const dateStr = EVENT_CONFIG.date.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-white"
      aria-label="Hero banner"
    >
      {/* Very subtle dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, #4A565E18 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Red corner accent — top-right */}
      <div
        className="absolute top-0 right-0 w-[420px] h-[420px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle at top right, rgba(220,0,50,0.07) 0%, transparent 65%)',
        }}
      />

      {/* Soft fade to white at the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #fff, transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: copy ── */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-7"
          >
            {/* Headline */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.5, delay: 0.08 }}>
              <h1 className="font-display font-extrabold tracking-tight" style={{ lineHeight: 1.08 }}>
                <span
                  className="block"
                  style={{ fontSize: 'clamp(2.6rem, 7vw, 5.25rem)', color: '#4A565E' }}
                >
                  Family
                </span>
                <span
                  className="block"
                  style={{ fontSize: 'clamp(3rem, 8.5vw, 6.25rem)', color: '#DC0032' }}
                >
                  Gathering
                </span>
                <span
                  className="block"
                  style={{ fontSize: 'clamp(2.6rem, 7vw, 5.25rem)', color: '#4A565E' }}
                >
                  2026
                </span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="font-sans font-light leading-relaxed max-w-md"
              style={{ fontSize: '1.1rem', color: '#6B7882' }}
            >
              Satu hari penuh kebersamaan bersama keluarga Denso.{' '}
              <span className="font-semibold" style={{ color: '#4A565E' }}>
                15.000 karyawan
              </span>{' '}
              dan keluarga mereka, satu perayaan bersama.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-col sm:flex-row items-start gap-3 pt-1"
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

            {/* Date / venue strip */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="flex flex-col sm:flex-row gap-5 pt-4"
              style={{ borderTop: '1px solid #4A565E18' }}
            >
              <div className="flex items-center gap-2 font-sans text-sm" style={{ color: '#6B7882' }}>
                <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: '#DC0032' }} />
                <span className="capitalize">{dateStr}</span>
              </div>
              <div className="flex items-center gap-2 font-sans text-sm" style={{ color: '#6B7882' }}>
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#DC0032' }} />
                <span>{EVENT_CONFIG.venue.name}, {EVENT_CONFIG.venue.city}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: arc motif ── */}
          <motion.div
            variants={fadeInRight}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="relative w-[460px] h-[460px]">
              {/* Background circle */}
              <div
                className="absolute inset-[12%] rounded-full"
                style={{ background: 'radial-gradient(circle at 40% 40%, rgba(220,0,50,0.05) 0%, rgba(74,86,94,0.03) 70%, transparent 100%)' }}
              />

              <svg viewBox="0 0 460 460" fill="none" className="absolute inset-0 w-full h-full">
                {/* Outer dashed ring */}
                <circle cx="230" cy="230" r="210" stroke="#4A565E" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="6 10" />

                {/* Large red arc — 270° sweep */}
                <motion.path
                  d="M230 24 A206 206 0 1 1 24 230"
                  stroke="#DC0032"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
                />

                {/* Mid slate arc — 200° sweep */}
                <motion.path
                  d="M230 68 A162 162 0 1 1 95 340"
                  stroke="#4A565E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.65 }}
                />

                {/* Inner red arc — 160° sweep */}
                <motion.path
                  d="M230 115 A115 115 0 1 1 125 325"
                  stroke="#DC0032"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.85 }}
                />

                {/* Inner ring */}
                <motion.circle
                  cx="230" cy="230" r="58"
                  stroke="#4A565E"
                  strokeWidth="1.5"
                  strokeOpacity="0.15"
                  fill="none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  style={{ transformOrigin: '230px 230px' }}
                />

                {/* Center dot — red */}
                <motion.circle
                  cx="230" cy="230" r="10"
                  fill="#DC0032"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 1.4 }}
                  style={{ transformOrigin: '230px 230px' }}
                />

                {/* Arc endpoint dots */}
                <motion.circle cx="230" cy="24"  r="6" fill="#DC0032"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} />
                <motion.circle cx="24"  cy="230" r="5" fill="#4A565E" fillOpacity="0.35"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} />
              </svg>

              {/* Center badge */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center text-center gap-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                <span
                  className="font-display font-extrabold tabular-nums"
                  style={{ fontSize: '3.75rem', lineHeight: 1, color: '#4A565E' }}
                >
                  15K
                </span>
                <span
                  className="font-sans font-medium uppercase tracking-wide text-xs"
                  style={{ color: '#6B7882' }}
                >
                  Karyawan &amp; Keluarga
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

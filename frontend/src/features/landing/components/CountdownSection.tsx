import { motion } from 'framer-motion';
import { FlipDigit } from '../../../components/atoms/AnimatedCounter';
import { useCountdown } from '../../../hooks/useCountdown';
import { useIntersection } from '../../../hooks/useIntersection';
import { fadeInUp, staggerContainer } from '../../../lib/animations';
import { EVENT_CONFIG } from '../../../constants/event';
import { CalendarDays } from 'lucide-react';

export function CountdownSection() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(EVENT_CONFIG.date);
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden bg-denso-navy-dark"
      aria-label="Event countdown"
    >
      {/* ── Immersive Gradient Background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-denso-navy via-denso-navy-dark to-[#001f40]" />
      
      {/* ── Aesthetic Glowing Shapes ── */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-denso-amber/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-denso-info/20 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Subtle Geometric Grid ── */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate={isVisible ? 'animate' : 'initial'}
        className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center"
      >
        {/* Label */}
        <motion.div variants={fadeInUp} className="flex flex-col items-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-denso-amber/10 border border-denso-amber/20">
            <CalendarDays className="w-4 h-4 text-denso-amber" />
            <span className="text-xs font-display font-bold uppercase tracking-[0.15em] text-denso-amber">
              Tandai Kalendermu
            </span>
          </div>
          <h2 className="font-display font-extrabold text-white text-5xl md:text-7xl tracking-tight">
            Dimulai dalam…
          </h2>
          <p className="font-sans text-lg md:text-xl text-denso-gray-300 font-light max-w-2xl mx-auto mt-2">
            Persiapkan diri Anda untuk hari penuh kebahagiaan pada{' '}
            <span className="font-medium text-white">
              {EVENT_CONFIG.date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>
        </motion.div>

        {/* Countdown Grid */}
        <motion.div variants={fadeInUp}>
          {isExpired ? (
            <div className="inline-block bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] transform hover:scale-105 transition-transform duration-500">
              <p className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-denso-amber to-denso-amber-pale">
                🎉 Acara Telah Dimulai!
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
              <FlipDigit value={days} label="Hari" />
              <span className="hidden md:block text-4xl md:text-6xl font-light text-white/30 -mt-10 select-none">:</span>
              <FlipDigit value={hours} label="Jam" />
              <span className="hidden md:block text-4xl md:text-6xl font-light text-white/30 -mt-10 select-none">:</span>
              <FlipDigit value={minutes} label="Menit" />
              <span className="hidden md:block text-4xl md:text-6xl font-light text-white/30 -mt-10 select-none">:</span>
              <FlipDigit value={seconds} label="Detik" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

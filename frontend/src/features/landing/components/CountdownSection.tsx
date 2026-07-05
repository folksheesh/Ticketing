import { motion } from 'framer-motion';
import { FlipDigit } from '../../../components/atoms/AnimatedCounter';
import { useCountdown } from '../../../hooks/useCountdown';
import { useIntersection } from '../../../hooks/useIntersection';
import { fadeInUp, staggerContainer } from '../../../lib/animations';
import { EVENT_CONFIG } from '../../../constants/event';

export function CountdownSection() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(EVENT_CONFIG.date);
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="relative section-padding overflow-hidden"
      style={{ background: '#DC0032' }}
      aria-label="Event countdown"
    >
      {/* Decorative arc rings — white, very subtle */}
      <div className="absolute right-0 top-0 w-[380px] h-[380px] pointer-events-none opacity-[0.08]" aria-hidden="true">
        <svg viewBox="0 0 380 380" fill="none" className="w-full h-full">
          <circle cx="380" cy="0" r="150" stroke="white" strokeWidth="1.5" />
          <circle cx="380" cy="0" r="250" stroke="white" strokeWidth="1" />
          <circle cx="380" cy="0" r="350" stroke="white" strokeWidth="0.7" />
        </svg>
      </div>
      <div className="absolute left-0 bottom-0 w-[280px] h-[280px] pointer-events-none opacity-[0.07]" aria-hidden="true">
        <svg viewBox="0 0 280 280" fill="none" className="w-full h-full">
          <circle cx="0" cy="280" r="110" stroke="white" strokeWidth="1.5" />
          <circle cx="0" cy="280" r="210" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate={isVisible ? 'animate' : 'initial'}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Label */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.6 }} className="space-y-3 mb-12">
          <p className="text-xs font-display font-semibold uppercase tracking-widest text-white/70">
            Tandai Kalendermu
          </p>
          <h2
            className="font-display font-extrabold text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            Dimulai dalam…
          </h2>
          <p className="font-sans text-white/75 capitalize">
            {EVENT_CONFIG.date.toLocaleDateString('id-ID', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </motion.div>

        {/* Countdown digits */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.6, delay: 0.2 }}>
          {isExpired ? (
            <div className="bg-white/15 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
              <p className="text-2xl font-display font-bold text-white">🎉 Acara Telah Dimulai!</p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-8">
              <FlipDigit value={days}    label="Hari" />
              <span className="text-3xl md:text-5xl font-light text-white/40 -mt-8 select-none">:</span>
              <FlipDigit value={hours}   label="Jam" />
              <span className="text-3xl md:text-5xl font-light text-white/40 -mt-8 select-none">:</span>
              <FlipDigit value={minutes} label="Menit" />
              <span className="text-3xl md:text-5xl font-light text-white/40 -mt-8 select-none">:</span>
              <FlipDigit value={seconds} label="Detik" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

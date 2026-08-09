import { motion } from 'framer-motion';
import { FlipDigit } from '../../../components/atoms/AnimatedCounter';
import { useCountdown } from '../../../hooks/useCountdown';
import { EVENT_CONFIG } from '../../../constants/event';

export function CountdownSection() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(EVENT_CONFIG.date);

  return (
    <section
      className="relative section-padding overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--color-denso-blue) 0%, var(--color-denso-navy-deep) 100%)',
      }}
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

      {/* Red accent dots */}
      <div className="absolute top-12 left-[15%] w-3 h-3 rounded-full opacity-30 pointer-events-none" style={{ background: 'var(--color-denso-red)' }} aria-hidden="true" />
      <div className="absolute bottom-16 right-[20%] w-2 h-2 rounded-full opacity-25 pointer-events-none" style={{ background: 'var(--color-denso-red-light)' }} aria-hidden="true" />

      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          initial: {},
          animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
        }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Label */}
        <motion.div
          variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6 }}
          className="space-y-3 mb-12"
        >
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
        <motion.div
          variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isExpired ? (
            <div
              className="rounded-3xl p-8 backdrop-blur-sm"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
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

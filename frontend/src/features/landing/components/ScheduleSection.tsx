import { motion } from 'framer-motion';
import {
  DoorOpen, Mic2, Gamepad2, UtensilsCrossed,
  Music, Gift, Package, PartyPopper, type LucideIcon,
} from 'lucide-react';
import { SCHEDULE } from '../../../constants/event';

const iconMap: Record<string, LucideIcon> = {
  DoorOpen, Mic2, Gamepad2, UtensilsCrossed, Music, Gift, Package, PartyPopper,
};

/* Key moments get the red treatment, others get blue */
const HIGHLIGHTED = new Set(['07.30 – 08.30', '08.30 – 09.00', '14.00 – 14.45', '14.45 – 16.00']);

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function ScheduleSection() {
  return (
    <section
      id="schedule"
      className="relative section-padding"
      style={{ background: 'var(--color-denso-sky-light)', backgroundImage: 'linear-gradient(180deg, var(--color-denso-sky-light) 0%, var(--color-denso-white) 100%)' }}
      aria-label="Event schedule"
    >
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.08 }}
        >
          {/* Header */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 space-y-3"
          >
            <p
              className="text-xs font-display font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-denso-blue)' }}
            >
              Rundown Acara
            </p>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--color-denso-slate)' }}
            >
              Jadwal{' '}
              <span style={{ color: 'var(--color-denso-red)' }}>Hari-H</span>
            </h2>
            <p className="font-sans" style={{ color: 'var(--color-denso-slate-mid)' }}>
              Satu hari penuh kegiatan seru, makan bersama, dan hadiah menarik.
            </p>
          </motion.div>

          {/* Timeline list */}
          <div className="relative">
            {/* Spine — animated draw */}
            <motion.div
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: '4.75rem',
                background: 'linear-gradient(to bottom, var(--color-denso-red) 0%, var(--color-denso-blue) 60%, var(--color-denso-blue-dark) 100%)',
                opacity: 0.25,
                transformOrigin: 'top',
              }}
              aria-hidden="true"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            />

            <div className="space-y-3">
              {SCHEDULE.map((item, index) => {
                const Icon = iconMap[item.icon] || DoorOpen;
                const hl = HIGHLIGHTED.has(item.time);

                return (
                  <motion.div
                    key={item.time}
                    variants={fadeUp}
                    transition={{ duration: 0.4, delay: index * 0.06 + 0.1 }}
                    className="relative flex items-center gap-4"
                  >
                    {/* Time label */}
                    <div className="w-[4.25rem] flex-shrink-0 text-right">
                      <span
                        className="font-display font-bold text-sm tabular-nums"
                        style={{ color: hl ? 'var(--color-denso-red)' : 'var(--color-denso-blue)' }}
                      >
                        {item.time}
                      </span>
                    </div>

                    {/* Dot */}
                    <div
                      className="relative z-10 flex-shrink-0 rounded-full flex items-center justify-center"
                      style={{
                        width: hl ? '2.25rem' : '2rem',
                        height: hl ? '2.25rem' : '2rem',
                        background: hl ? 'var(--color-denso-red)' : 'var(--color-denso-white)',
                        border: hl ? 'none' : '2px solid rgba(30, 63, 143, 0.15)',
                        boxShadow: hl
                          ? '0 2px 12px rgba(228, 33, 31, 0.3)'
                          : '0 1px 6px rgba(30, 63, 143, 0.1)',
                        marginLeft: '0.35rem',
                      }}
                    >
                      <Icon
                        style={{
                          width: hl ? '1rem' : '0.9rem',
                          height: hl ? '1rem' : '0.9rem',
                          color: hl ? 'var(--color-denso-white)' : 'var(--color-denso-blue)',
                          opacity: hl ? 1 : 0.6,
                        }}
                      />
                    </div>

                    {/* Card */}
                    <motion.div
                      className="flex-1 p-4 rounded-2xl border transition-all duration-300"
                      style={{
                        background: hl ? 'var(--color-denso-white)' : 'rgba(255,255,255,0.65)',
                        borderColor: hl ? 'rgba(228, 33, 31, 0.1)' : 'rgba(30, 63, 143, 0.08)',
                        boxShadow: hl ? '0 2px 14px rgba(30, 63, 143, 0.08)' : 'none',
                      }}
                      whileHover={{ x: 3 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <p
                        className="font-display font-semibold text-sm"
                        style={{ color: 'var(--color-denso-slate)' }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="font-sans text-xs mt-0.5 leading-relaxed"
                        style={{ color: 'var(--color-denso-slate-mid)' }}
                      >
                        {item.description}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

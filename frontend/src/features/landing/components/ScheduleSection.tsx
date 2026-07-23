import { motion } from 'framer-motion';
import {
  DoorOpen, Mic2, Gamepad2, UtensilsCrossed,
  Music, Gift, Package, PartyPopper, type LucideIcon,
} from 'lucide-react';
import { useIntersection } from '../../../hooks/useIntersection';
import { fadeInUp, staggerContainer } from '../../../lib/animations';
import { SCHEDULE } from '../../../constants/event';

const iconMap: Record<string, LucideIcon> = {
  DoorOpen, Mic2, Gamepad2, UtensilsCrossed, Music, Gift, Package, PartyPopper,
};

/* Key moments get the red treatment */
const HIGHLIGHTED = new Set(['07.30 – 08.30', '08.30 – 09.00', '14.00 – 14.45', '14.45 – 16.00']);

export function ScheduleSection() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.08 });

  return (
    <section
      ref={ref}
      id="schedule"
      className="relative section-padding"
      style={{ background: '#F5F7F8' }}
      aria-label="Event schedule"
    >
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isVisible ? 'animate' : 'initial'}
        >
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 space-y-3"
          >
            <p
              className="text-xs font-display font-semibold uppercase tracking-widest"
              style={{ color: '#DC0032' }}
            >
              Rundown Acara
            </p>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: '#4A565E' }}
            >
              Jadwal{' '}
              <span style={{ color: '#DC0032' }}>Hari-H</span>
            </h2>
            <p className="font-sans" style={{ color: '#6B7882' }}>
              Satu hari penuh kegiatan seru, makan bersama, dan hadiah menarik.
            </p>
          </motion.div>

          {/* Timeline list */}
          <div className="relative">
            {/* Spine */}
            <div
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: '4.75rem',
                background: 'linear-gradient(to bottom, #DC0032 0%, #4A565E 60%, #4A565E 100%)',
                opacity: 0.18,
              }}
              aria-hidden="true"
            />

            <div className="space-y-3">
              {SCHEDULE.map((item, index) => {
                const Icon = iconMap[item.icon] || DoorOpen;
                const hl = HIGHLIGHTED.has(item.time);

                return (
                  <motion.div
                    key={item.time}
                    variants={fadeInUp}
                    transition={{ duration: 0.4, delay: index * 0.06 + 0.1 }}
                    className="relative flex items-center gap-4"
                  >
                    {/* Time label */}
                    <div className="w-[4.25rem] flex-shrink-0 text-right">
                      <span
                        className="font-display font-bold text-sm tabular-nums"
                        style={{ color: hl ? '#DC0032' : '#4A565E' }}
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
                        background: hl ? '#DC0032' : '#FFFFFF',
                        border: hl ? 'none' : '2px solid #4A565E20',
                        boxShadow: hl ? '0 2px 12px rgba(220,0,50,0.3)' : '0 1px 6px rgba(74,86,94,0.1)',
                        marginLeft: '0.35rem',
                      }}
                    >
                      <Icon
                        style={{
                          width: hl ? '1rem' : '0.9rem',
                          height: hl ? '1rem' : '0.9rem',
                          color: hl ? '#FFFFFF' : '#DC003260',
                        }}
                      />
                    </div>

                    {/* Card */}
                    <motion.div
                      className="flex-1 p-4 rounded-2xl border transition-all duration-300"
                      style={{
                        background: hl ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                        borderColor: hl ? '#DC003218' : '#4A565E12',
                        boxShadow: hl ? '0 2px 14px rgba(74,86,94,0.08)' : 'none',
                      }}
                      whileHover={{ x: 3 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <p
                        className="font-display font-semibold text-sm"
                        style={{ color: '#4A565E' }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="font-sans text-xs mt-0.5 leading-relaxed"
                        style={{ color: '#6B7882' }}
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

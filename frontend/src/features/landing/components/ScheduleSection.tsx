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
            className="text-center mb-16 space-y-3"
          >
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-denso-slate)' }}
            >
              Rundown <span style={{ color: 'var(--color-denso-red)' }}>Acara</span>
            </h2>
          </motion.div>

          {/* Timeline list */}
          <div className="relative max-w-5xl mx-auto">
            {/* Center Spine — Desktop */}
            <motion.div
              className="absolute top-0 bottom-0 w-1 hidden md:block"
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(to bottom, var(--color-denso-red) 0%, var(--color-denso-blue) 60%, var(--color-denso-blue-dark) 100%)',
                opacity: 0.15,
                transformOrigin: 'top',
              }}
              aria-hidden="true"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            />
            
            {/* Left Spine — Mobile */}
            <motion.div
              className="absolute top-0 bottom-0 w-1 md:hidden"
              style={{
                left: '2rem',
                background: 'linear-gradient(to bottom, var(--color-denso-red) 0%, var(--color-denso-blue) 60%, var(--color-denso-blue-dark) 100%)',
                opacity: 0.15,
                transformOrigin: 'top',
              }}
              aria-hidden="true"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            />

            <div className="space-y-8 md:space-y-12">
              {SCHEDULE.map((item, index) => {
                const Icon = iconMap[item.icon] || DoorOpen;
                const hl = HIGHLIGHTED.has(item.time);
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={item.time}
                    initial={{ opacity: 0, x: isEven ? -60 : 60, y: 30 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.7, type: 'spring', bounce: 0.4, delay: 0.1 }}
                    className={`relative flex flex-col md:flex-row items-center gap-6 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Time Label */}
                    <div className={`md:w-1/2 flex ${isEven ? 'md:justify-end' : 'md:justify-start'} w-full pl-20 md:pl-0`}>
                      <span
                        className="font-display font-bold text-lg md:text-xl tabular-nums px-5 py-2 rounded-full shadow-sm"
                        style={{ 
                          color: hl ? 'var(--color-denso-red)' : 'var(--color-denso-blue)',
                          background: hl ? 'var(--color-denso-red-pale)' : 'var(--color-denso-blue-pale)',
                          border: hl ? '1px solid rgba(228, 33, 31, 0.2)' : '1px solid rgba(30, 63, 143, 0.15)'
                        }}
                      >
                        {item.time}
                      </span>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-8 md:static md:left-auto flex-shrink-0 z-10 transform -translate-x-1/2 md:translate-x-0">
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', duration: 0.8, delay: 0.3 }}
                        className="rounded-full flex items-center justify-center bg-white"
                        style={{
                          width: hl ? '3.5rem' : '3rem',
                          height: hl ? '3.5rem' : '3rem',
                          border: hl ? '3px solid var(--color-denso-red)' : '3px solid var(--color-denso-blue)',
                          boxShadow: hl
                            ? '0 4px 20px rgba(228, 33, 31, 0.4)'
                            : '0 4px 12px rgba(30, 63, 143, 0.15)',
                        }}
                      >
                        <Icon
                          style={{
                            width: hl ? '1.5rem' : '1.25rem',
                            height: hl ? '1.5rem' : '1.25rem',
                            color: hl ? 'var(--color-denso-red)' : 'var(--color-denso-blue)',
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Card */}
                    <div className={`md:w-1/2 w-full pl-20 md:pl-0 flex ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                      <motion.div
                        className="p-6 rounded-2xl border transition-all duration-300 w-full max-w-sm"
                        style={{
                          background: hl ? 'var(--color-denso-white)' : 'rgba(255,255,255,0.7)',
                          borderColor: hl ? 'rgba(228, 33, 31, 0.15)' : 'rgba(30, 63, 143, 0.1)',
                          boxShadow: hl ? '0 8px 30px rgba(228, 33, 31, 0.08)' : '0 4px 20px rgba(30, 63, 143, 0.05)',
                        }}
                        whileHover={{ scale: 1.03, y: -4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <p
                          className="font-display font-bold text-[1.15rem] mb-2"
                          style={{ color: 'var(--color-denso-slate-dark)' }}
                        >
                          {item.title}
                        </p>
                        <p
                          className="font-sans text-sm leading-relaxed"
                          style={{ color: 'var(--color-denso-slate-mid)' }}
                        >
                          {item.description}
                        </p>
                      </motion.div>
                    </div>
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

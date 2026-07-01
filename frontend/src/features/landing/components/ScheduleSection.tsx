import { motion } from 'framer-motion';
import {
  DoorOpen, Mic2, Gamepad2, UtensilsCrossed,
  Music, Gift, Package, PartyPopper, type LucideIcon,
  Clock
} from 'lucide-react';
import { useIntersection } from '../../../hooks/useIntersection';
import { fadeInUp, staggerContainer } from '../../../lib/animations';
import { SCHEDULE } from '../../../constants/event';
import { cn } from '../../../lib/cn';

const iconMap: Record<string, LucideIcon> = {
  DoorOpen, Mic2, Gamepad2, UtensilsCrossed,
  Music, Gift, Package, PartyPopper,
};

const HIGHLIGHTED = new Set(['07:00', '08:30', '14:30', '16:00']);

export function ScheduleSection() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.08 });

  return (
    <section
      ref={ref}
      id="schedule"
      className="relative py-24 md:py-32 bg-white overflow-hidden"
      aria-label="Event schedule"
    >
      {/* ── Artistic Flourishes ── */}
      <div className="absolute top-[20%] left-[-5%] w-[300px] h-[300px] bg-denso-amber/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-denso-navy/5 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isVisible ? 'animate' : 'initial'}
        >
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            className="text-center space-y-4 mb-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-denso-navy/5 border border-denso-navy/10 text-xs font-display font-bold uppercase tracking-[0.15em] text-denso-navy">
              <Clock className="w-4 h-4" />
              Rundown Acara
            </span>
            <h2 className="font-display font-extrabold text-denso-slate text-4xl md:text-5xl tracking-tight">
              Jadwal <span className="text-transparent bg-clip-text bg-gradient-to-r from-denso-navy to-denso-navy-mid">Hari-H</span>
            </h2>
            <p className="font-sans text-lg text-denso-slate-light max-w-2xl mx-auto">
              Satu hari penuh kegiatan seru, makan bersama, dan hadiah menarik yang tak terlupakan.
            </p>
          </motion.div>

          {/* Staggered Alternating Timeline */}
          <div className="relative">
            {/* Center Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-denso-amber via-denso-navy-light to-transparent transform -translate-x-1/2" />

            <div className="space-y-8 md:space-y-16">
              {SCHEDULE.map((item, index) => {
                const Icon = iconMap[item.icon] || DoorOpen;
                const isHighlighted = HIGHLIGHTED.has(item.time);
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={item.time}
                    variants={fadeInUp}
                    className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-0 ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Empty Space for Alternating Layout */}
                    <div className="hidden md:block md:w-1/2" />

                    {/* Center Node */}
                    <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 z-20">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-transform duration-500 hover:scale-110 hover:rotate-12',
                          isHighlighted
                            ? 'bg-gradient-to-br from-denso-amber to-denso-amber-deep text-white'
                            : 'bg-white text-denso-navy border-denso-gray-100 shadow-sm'
                        )}
                      >
                        <Icon className={cn('w-5 h-5', isHighlighted ? 'text-white' : 'text-denso-navy/70')} />
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className={`w-full pl-16 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                      <motion.div
                        className={cn(
                          'p-6 md:p-8 rounded-[2rem] border transition-all duration-300 relative group',
                          isHighlighted
                            ? 'bg-gradient-to-br from-white to-denso-amber-pale/30 border-denso-amber/30 shadow-[0_8px_30px_rgba(245,158,11,0.12)]'
                            : 'bg-white border-denso-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-denso-gray-200'
                        )}
                        whileHover={{ y: -5 }}
                      >
                        <span
                          className={cn(
                            'inline-block mb-3 font-display font-extrabold text-2xl tabular-nums tracking-tight',
                            isHighlighted ? 'text-denso-amber-deep' : 'text-denso-navy'
                          )}
                        >
                          {item.time}
                        </span>
                        <h3 className="font-display font-bold text-xl text-denso-slate mb-2">
                          {item.title}
                        </h3>
                        <p className="font-sans text-denso-slate-light leading-relaxed">
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

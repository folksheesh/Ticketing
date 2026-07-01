import { motion } from 'framer-motion';
import { useIntersection } from '../../../hooks/useIntersection';
import { fadeInUp, staggerContainer } from '../../../lib/animations';
import { cn } from '../../../lib/cn';
import { HeartHandshake } from 'lucide-react';

const SPONSORS = [
  { name: 'Denso Corporation',  tier: 'platinum' },
  { name: 'Toyota Group',       tier: 'platinum' },
  { name: 'Astra International',tier: 'gold' },
  { name: 'Bank Mandiri',       tier: 'gold' },
  { name: 'Telkomsel',          tier: 'gold' },
  { name: 'Pertamina',          tier: 'silver' },
  { name: 'Garuda Indonesia',   tier: 'silver' },
  { name: 'BCA',                tier: 'silver' },
] as const;

export function SponsorsSection() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden bg-white"
      aria-label="Sponsors and partners"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isVisible ? 'animate' : 'initial'}
        >
          <motion.div
            variants={fadeInUp}
            className="text-center space-y-4 mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-denso-navy/5 border border-denso-navy/10 text-xs font-display font-bold uppercase tracking-[0.15em] text-denso-navy">
              <HeartHandshake className="w-4 h-4" />
              Didukung Oleh
            </span>
            <h2 className="font-display font-extrabold text-denso-slate text-4xl md:text-5xl tracking-tight">
              Mitra <span className="text-transparent bg-clip-text bg-gradient-to-r from-denso-navy to-denso-navy-light">Kami</span>
            </h2>
            <p className="font-sans text-lg text-denso-slate-light max-w-2xl mx-auto">
              Terima kasih kepada seluruh mitra dan sponsor yang telah mendukung terselenggaranya acara ini.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee Animation */}
      <div className="relative mt-8 max-w-[100vw] overflow-hidden">
        {/* Beautiful Gradient Masks for smooth fade out */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="flex animate-marquee hover:[animation-play-state:paused] py-4">
          {[...SPONSORS, ...SPONSORS, ...SPONSORS].map((sponsor, index) => (
            <div
              key={`${sponsor.name}-${index}`}
              className={cn(
                'flex-shrink-0 mx-4 px-8 py-5 rounded-3xl border bg-white',
                'flex flex-col items-center justify-center min-w-[220px]',
                'transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transform hover:-translate-y-1 group',
                sponsor.tier === 'platinum'
                  ? 'border-denso-navy/15 hover:border-denso-navy/40'
                  : sponsor.tier === 'gold'
                    ? 'border-denso-amber/25 hover:border-denso-amber/50'
                    : 'border-denso-gray-100 hover:border-denso-gray-300'
              )}
            >
              <div className="w-12 h-12 rounded-2xl mb-3 flex items-center justify-center bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity"
                style={{
                  backgroundImage: sponsor.tier === 'platinum' ? 'linear-gradient(to bottom right, #0054A6, #1A6FBF)' : sponsor.tier === 'gold' ? 'linear-gradient(to bottom right, #F59E0B, #D97706)' : 'linear-gradient(to bottom right, #CBD5E1, #94A3B8)'
                }}
              >
                <span className="font-display font-bold text-white text-xl">
                  {sponsor.name.charAt(0)}
                </span>
              </div>
              <span
                className={cn(
                  'font-display text-sm font-bold tracking-wide text-center',
                  sponsor.tier === 'platinum'
                    ? 'text-denso-navy'
                    : sponsor.tier === 'gold'
                      ? 'text-denso-amber-deep'
                      : 'text-denso-slate-light'
                )}
              >
                {sponsor.name}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-denso-gray-400 mt-1">
                {sponsor.tier}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

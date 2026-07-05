import { motion } from 'framer-motion';
import { useIntersection } from '../../../hooks/useIntersection';
import { fadeInUp, staggerContainer } from '../../../lib/animations';

const SPONSORS = [
  { name: 'Denso Corporation',   tier: 'platinum' },
  { name: 'Toyota Group',        tier: 'platinum' },
  { name: 'Astra International', tier: 'gold' },
  { name: 'Bank Mandiri',        tier: 'gold' },
  { name: 'Telkomsel',           tier: 'gold' },
  { name: 'Pertamina',           tier: 'silver' },
  { name: 'Garuda Indonesia',    tier: 'silver' },
  { name: 'BCA',                 tier: 'silver' },
] as const;

const tierStyle: Record<string, { card: React.CSSProperties; text: React.CSSProperties }> = {
  platinum: {
    card: { background: '#FFFFFF', border: '1px solid #DC003225' },
    text: { color: '#DC0032', fontWeight: 700 },
  },
  gold: {
    card: { background: '#FFFFFF', border: '1px solid #4A565E18' },
    text: { color: '#4A565E', fontWeight: 600 },
  },
  silver: {
    card: { background: '#F5F7F8', border: '1px solid #4A565E10' },
    text: { color: '#6B7882', fontWeight: 500 },
  },
};

export function SponsorsSection() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative section-padding overflow-hidden"
      style={{ background: '#FFFFFF' }}
      aria-label="Sponsors and partners"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isVisible ? 'animate' : 'initial'}
        >
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 space-y-3"
          >
            <p
              className="text-xs font-display font-semibold uppercase tracking-widest"
              style={{ color: '#DC0032' }}
            >
              Didukung Oleh
            </p>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#4A565E' }}
            >
              Mitra <span style={{ color: '#DC0032' }}>Kami</span>
            </h2>
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative mt-4">
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #FFFFFF, transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #FFFFFF, transparent)' }}
        />

        <div className="flex animate-marquee">
          {[...SPONSORS, ...SPONSORS].map((sponsor, index) => (
            <div
              key={`${sponsor.name}-${index}`}
              className="flex-shrink-0 mx-3 px-7 py-4 rounded-2xl flex items-center justify-center min-w-[180px] transition-shadow duration-300 hover:shadow-card"
              style={tierStyle[sponsor.tier].card}
            >
              <span
                className="font-display text-sm tracking-wide"
                style={tierStyle[sponsor.tier].text}
              >
                {sponsor.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

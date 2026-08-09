import { motion } from 'framer-motion';
import { BuntingGarland } from '../../../components/atoms/BuntingGarland';

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
    card: {
      background: 'var(--color-denso-white)',
      border: '1px solid rgba(30, 63, 143, 0.2)',
      boxShadow: '0 2px 12px rgba(30, 63, 143, 0.08)',
    },
    text: { color: 'var(--color-denso-blue)', fontWeight: 700 },
  },
  gold: {
    card: {
      background: 'var(--color-denso-white)',
      border: '1px solid rgba(228, 33, 31, 0.12)',
    },
    text: { color: 'var(--color-denso-red)', fontWeight: 600 },
  },
  silver: {
    card: {
      background: 'var(--color-denso-paper)',
      border: '1px solid rgba(30, 63, 143, 0.08)',
    },
    text: { color: 'var(--color-denso-slate-mid)', fontWeight: 500 },
  },
};

export function SponsorsSection() {
  return (
    <section
      className="relative section-padding overflow-hidden"
      style={{ background: 'var(--color-denso-white)' }}
      aria-label="Sponsors and partners"
    >
      {/* Bunting decoration at top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <BuntingGarland width={1200} flagCount={14} droop={0.25} height={45} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-3"
        >
          <p
            className="text-xs font-display font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-denso-blue)' }}
          >
            Didukung Oleh
          </p>
          <h2
            className="font-display font-extrabold"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--color-denso-slate)' }}
          >
            Mitra <span style={{ color: 'var(--color-denso-red)' }}>Kami</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative mt-4">
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--color-denso-white), transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--color-denso-white), transparent)' }}
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

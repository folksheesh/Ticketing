import { motion, useReducedMotion } from 'framer-motion';
import { UtensilsCrossed, Gamepad2, Store, Baby, Music } from 'lucide-react';
import { BuntingGarland } from '../../../components/atoms/BuntingGarland';
import { StringLights } from '../../../components/atoms/StringLights';

const STALLS = [
  {
    icon: UtensilsCrossed,
    title: 'Jajanan & Street Food',
    description: 'Jajanan pasar, makanan khas nusantara, dan minuman segar.',
    accentColor: 'var(--color-denso-red)',
    bgColor: 'var(--color-denso-red-pale)',
  },
  {
    icon: Gamepad2,
    title: 'Games & Doorprize',
    description: 'Permainan seru berhadiah untuk semua usia.',
    accentColor: 'var(--color-denso-blue)',
    bgColor: 'var(--color-denso-blue-pale)',
  },
  {
    icon: Store,
    title: 'UMKM & Vendor',
    description: 'Produk lokal berkualitas dari pengusaha UMKM binaan.',
    accentColor: 'var(--color-denso-red)',
    bgColor: 'var(--color-denso-red-pale)',
  },
  {
    icon: Baby,
    title: 'Kids Zone',
    description: 'Area bermain aman dan menyenangkan untuk si kecil.',
    accentColor: 'var(--color-denso-blue)',
    bgColor: 'var(--color-denso-blue-pale)',
  },
  {
    icon: Music,
    title: 'Live Music & Stage',
    description: 'Penampilan musik live dan hiburan panggung sepanjang hari.',
    accentColor: 'var(--color-denso-red)',
    bgColor: 'var(--color-denso-red-pale)',
  },
] as const;

const containerVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.8, y: 30 },
  animate: { opacity: 1, scale: 1, y: 0 },
};

/**
 * "What to Expect" bazaar preview section.
 * Tent-shaped cards previewing the bazaar experience.
 * Concentrated bunting + string lights for market atmosphere.
 */
export function BazaarPreviewSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative section-padding overflow-hidden"
      style={{ background: 'var(--color-denso-white)' }}
      aria-label="What to expect at the bazaar"
    >
      {/* Background wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center bottom, var(--color-denso-sky-light) 0%, transparent 60%)',
          opacity: 0.4,
        }}
      />

      {/* Bunting at top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <BuntingGarland width={1400} flagCount={16} droop={0.3} height={55} />
      </div>

      {/* String lights below bunting */}
      <div className="absolute top-12 left-0 right-0 pointer-events-none" aria-hidden="true">
        <StringLights width={1400} bulbCount={20} height={40} droop={0.25} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-3"
        >
          <p
            className="text-xs font-display font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-denso-blue)' }}
          >
            Apa yang Menanti?
          </p>
          <h2
            className="font-display font-extrabold"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--color-denso-slate)' }}
          >
            Serunya{' '}
            <span style={{ color: 'var(--color-denso-red)' }}>Pesta Rakyat</span>
          </h2>
          <p className="font-sans max-w-lg mx-auto" style={{ color: 'var(--color-denso-slate-mid)' }}>
            Nikmati suasana bazar meriah dengan berbagai stan makanan, permainan, dan hiburan untuk seluruh keluarga.
          </p>
        </motion.div>

        {/* Stall cards */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5"
        >
          {STALLS.map((stall, index) => (
            <motion.div
              key={stall.title}
              variants={cardVariants}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: index * 0.08,
              }}
              whileHover={prefersReduced ? {} : { y: -6, scale: 1.03 }}
              className="relative flex flex-col items-center text-center p-5 rounded-2xl cursor-default transition-shadow duration-300"
              style={{
                background: 'var(--color-denso-white)',
                border: '1px solid rgba(30, 63, 143, 0.1)',
                boxShadow: '0 2px 12px rgba(30, 63, 143, 0.06)',
              }}
            >
              {/* Tent peak decoration */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '14px solid transparent',
                  borderRight: '14px solid transparent',
                  borderBottom: `14px solid ${stall.accentColor}`,
                }}
                aria-hidden="true"
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: stall.bgColor }}
              >
                <stall.icon
                  className="w-7 h-7"
                  style={{ color: stall.accentColor }}
                />
              </div>

              <h3
                className="font-display font-bold text-sm mb-1.5"
                style={{ color: 'var(--color-denso-slate)' }}
              >
                {stall.title}
              </h3>
              <p
                className="font-sans text-xs leading-relaxed"
                style={{ color: 'var(--color-denso-slate-mid)' }}
              >
                {stall.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

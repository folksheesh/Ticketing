import { motion } from 'framer-motion';
import { UserPlus, Users, QrCode, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Daftar',
    description: 'Isi data karyawan dan buat profil acaramu dalam beberapa menit.',
    accent: 'red' as const,
  },
  {
    icon: Users,
    title: 'Tambah Keluarga',
    description: 'Daftarkan pasangan dan anak-anakmu. Kategori usia otomatis terisi.',
    accent: 'blue' as const,
  },
  {
    icon: QrCode,
    title: 'Ambil Tiket QR',
    description: 'Terima QR code unik untuk masuk, makan siang, dan pengambilan souvenir.',
    accent: 'blue' as const,
  },
  {
    icon: CheckCircle2,
    title: 'Nikmati Acaranya',
    description: 'Scan QR di setiap pos dan habiskan hari yang luar biasa bersama keluarga.',
    accent: 'red' as const,
  },
] as const;

const accentStyles = {
  red: {
    bg: 'var(--color-denso-red)',
    iconColor: 'var(--color-denso-white)',
    shadow: '0 4px 20px rgba(228, 33, 31, 0.28)',
    numberBorder: 'var(--color-denso-red)',
    numberColor: 'var(--color-denso-red)',
  },
  blue: {
    bg: 'var(--color-denso-blue)',
    iconColor: 'var(--color-denso-white)',
    shadow: '0 4px 20px rgba(30, 63, 143, 0.28)',
    numberBorder: 'var(--color-denso-blue)',
    numberColor: 'var(--color-denso-blue)',
  },
};

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export function TimelineSection() {
  return (
    <section
      id="timeline"
      className="relative section-padding"
      style={{ background: 'var(--color-denso-white)' }}
      aria-label="Registration process"
    >
      {/* Subtle sky blue radial wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center, var(--color-denso-sky-light) 0%, transparent 65%)',
          opacity: 0.25,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Header */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 space-y-3"
          >
            <p
              className="text-xs font-display font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-denso-blue)' }}
            >
              Cara Daftar
            </p>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--color-denso-slate)' }}
            >
              Empat Langkah{' '}
              <span style={{ color: 'var(--color-denso-red)' }}>Mudah</span>
            </h2>
            <p className="font-sans max-w-md mx-auto" style={{ color: 'var(--color-denso-slate-mid)' }}>
              Dari pendaftaran hingga hari-H — semua serba digital.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting track (desktop) — animated draw-in */}
            <motion.div
              className="hidden lg:block absolute top-[2.75rem] h-px pointer-events-none"
              style={{
                left: 'calc(12.5% + 2rem)',
                right: 'calc(12.5% + 2rem)',
                background: 'linear-gradient(to right, var(--color-denso-red), var(--color-denso-blue), var(--color-denso-red))',
                opacity: 0.25,
              }}
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              {STEPS.map((step, index) => {
                const styles = accentStyles[step.accent];
                return (
                  <motion.div
                    key={step.title}
                    variants={fadeUp}
                    transition={{ duration: 0.45, delay: index * 0.1 + 0.1 }}
                    className="relative flex flex-col items-center text-center"
                  >
                    {/* Icon circle */}
                    <motion.div
                      className="relative z-10 rounded-full flex items-center justify-center mb-5 flex-shrink-0"
                      style={{
                        width: '5.5rem',
                        height: '5.5rem',
                        background: styles.bg,
                        boxShadow: styles.shadow,
                      }}
                      whileHover={{ scale: 1.07 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <step.icon
                        className="w-8 h-8"
                        style={{ color: styles.iconColor }}
                      />
                      {/* Step number */}
                      <span
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-display font-bold flex items-center justify-center"
                        style={{
                          background: 'var(--color-denso-white)',
                          color: styles.numberColor,
                          border: `2px solid ${styles.numberBorder}`,
                          fontSize: '0.7rem',
                        }}
                      >
                        {index + 1}
                      </span>
                    </motion.div>

                    <h3
                      className="font-display font-bold text-lg mb-2"
                      style={{ color: 'var(--color-denso-slate)' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="font-sans text-sm leading-relaxed"
                      style={{ color: 'var(--color-denso-slate-mid)' }}
                    >
                      {step.description}
                    </p>
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

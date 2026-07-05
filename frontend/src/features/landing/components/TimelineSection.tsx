import { motion } from 'framer-motion';
import { UserPlus, Users, QrCode, CheckCircle2 } from 'lucide-react';
import { useIntersection } from '../../../hooks/useIntersection';
import { fadeInUp, staggerContainer } from '../../../lib/animations';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Daftar',
    description: 'Isi data karyawan dan buat profil acaramu dalam beberapa menit.',
    accent: true,
  },
  {
    icon: Users,
    title: 'Tambah Keluarga',
    description: 'Daftarkan pasangan dan anak-anakmu. Kategori usia otomatis terisi.',
    accent: false,
  },
  {
    icon: QrCode,
    title: 'Ambil Tiket QR',
    description: 'Terima QR code unik untuk masuk, makan siang, dan pengambilan souvenir.',
    accent: false,
  },
  {
    icon: CheckCircle2,
    title: 'Nikmati Acaranya',
    description: 'Scan QR di setiap pos dan habiskan hari yang luar biasa bersama keluarga.',
    accent: true,
  },
] as const;

export function TimelineSection() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      id="timeline"
      className="relative section-padding"
      style={{ background: '#FFFFFF' }}
      aria-label="Registration process"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isVisible ? 'animate' : 'initial'}
        >
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 space-y-3"
          >
            <p
              className="text-xs font-display font-semibold uppercase tracking-widest"
              style={{ color: '#DC0032' }}
            >
              Cara Daftar
            </p>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: '#4A565E' }}
            >
              Empat Langkah{' '}
              <span style={{ color: '#DC0032' }}>Mudah</span>
            </h2>
            <p className="font-sans max-w-md mx-auto" style={{ color: '#6B7882' }}>
              Dari pendaftaran hingga hari-H — semua serba digital.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting track (desktop) */}
            <div
              className="hidden lg:block absolute top-[2.75rem] h-px pointer-events-none"
              style={{
                left: 'calc(12.5% + 2rem)',
                right: 'calc(12.5% + 2rem)',
                background: 'linear-gradient(to right, #DC0032, #4A565E, #DC0032)',
                opacity: 0.2,
              }}
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              {STEPS.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  transition={{ duration: 0.45, delay: index * 0.1 + 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Icon circle */}
                  <motion.div
                    className="relative z-10 w-22 h-22 rounded-full flex items-center justify-center mb-5 flex-shrink-0"
                    style={{
                      width: '5.5rem',
                      height: '5.5rem',
                      background: step.accent ? '#DC0032' : '#FFFFFF',
                      border: step.accent ? 'none' : '2px solid #4A565E20',
                      boxShadow: step.accent
                        ? '0 4px 20px rgba(220,0,50,0.28)'
                        : '0 2px 12px rgba(74,86,94,0.10)',
                    }}
                    whileHover={{ scale: 1.07 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <step.icon
                      className="w-8 h-8"
                      style={{ color: step.accent ? '#FFFFFF' : '#DC0032' }}
                    />
                    {/* Step number */}
                    <span
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-display font-bold flex items-center justify-center bg-white"
                      style={{
                        color: '#DC0032',
                        border: '2px solid #DC0032',
                        fontSize: '0.7rem',
                      }}
                    >
                      {index + 1}
                    </span>
                  </motion.div>

                  <h3
                    className="font-display font-bold text-lg mb-2"
                    style={{ color: '#4A565E' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="font-sans text-sm leading-relaxed"
                    style={{ color: '#6B7882' }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { MapPin, Car, Clock, Utensils, ExternalLink } from 'lucide-react';
import { WaveDivider } from '../../../components/atoms/WaveDivider';
import { EVENT_CONFIG } from '../../../constants/event';

const FACILITIES = [
  { icon: Car,      label: 'Parkir Luas',      desc: 'Akses parkir mudah & memadai', accent: 'red' as const },
  { icon: Clock,    label: 'Full Day Event',    desc: '07.00 – 16.00 WIB', accent: 'blue' as const },
  { icon: Utensils, label: 'Makan Siang',       desc: 'Menu ramah keluarga', accent: 'red' as const },
  { icon: MapPin,   label: 'Mudah Dijangkau',   desc: 'Dekat dengan Pintu Tol Cibubur', accent: 'blue' as const },
] as const;

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
};

const fadeLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
};

const fadeRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
};

export function VenueSection() {
  return (
    <section
      id="venue"
      className="relative section-padding"
      style={{ background: 'var(--color-denso-white)' }}
      aria-label="Event venue"
    >
      {/* Top wave divider */}
      <div className="absolute top-0 left-0 right-0" aria-hidden="true">
        <WaveDivider color="var(--color-denso-sky-light)" height={40} flip />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="text-center mb-14 space-y-3"
          >
            <p
              className="text-xs font-display font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-denso-blue)' }}
            >
              Lokasi Acara
            </p>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--color-denso-slate)' }}
            >
              Tempat{' '}
              <span style={{ color: 'var(--color-denso-red)' }}>Kita Bertemu</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Map placeholder */}
            <motion.div
              variants={fadeLeft}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/3]"
              style={{
                background: 'var(--color-denso-blue-pale)',
                border: '1px solid rgba(30, 63, 143, 0.1)',
              }}
            >
              {/* Skyline silhouette decoration */}
              <svg className="absolute bottom-0 left-0 right-0 w-full opacity-20" viewBox="0 0 400 100" fill="none" preserveAspectRatio="none" style={{ height: '60px' }}>
                <path
                  d="M0,100 L0,60 L30,60 L30,40 L45,40 L45,30 L60,30 L60,40 L80,40 L80,50 L100,50 L100,35 L115,20 L130,35 L130,50 L160,50 L160,60 L200,60 L200,40 L215,25 L230,40 L230,55 L260,55 L260,35 L275,20 L290,35 L290,55 L330,55 L330,60 L370,60 L370,45 L385,30 L400,45 L400,100 Z"
                  fill="var(--color-denso-sky)"
                />
              </svg>

              {/* Decorative circles */}
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 300" fill="none">
                <circle cx="300" cy="80" r="50" stroke="var(--color-denso-blue)" strokeWidth="1" />
                <circle cx="100" cy="200" r="35" stroke="var(--color-denso-sky)" strokeWidth="0.8" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center space-y-4 px-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{
                      background: 'var(--color-denso-blue)',
                      boxShadow: '0 4px 20px rgba(30, 63, 143, 0.3)',
                    }}
                  >
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg" style={{ color: 'var(--color-denso-slate)' }}>
                      {EVENT_CONFIG.venue.name}
                    </p>
                    <p className="font-sans text-sm mt-1" style={{ color: 'var(--color-denso-slate-mid)' }}>
                      {EVENT_CONFIG.venue.address}
                    </p>
                  </div>
                  <a
                    href={EVENT_CONFIG.venue.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold transition-colors"
                    style={{ color: 'var(--color-denso-blue)' }}
                  >
                    Buka di Google Maps
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              variants={fadeRight}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3
                  className="font-display font-bold text-2xl mb-1.5"
                  style={{ color: 'var(--color-denso-slate)' }}
                >
                  {EVENT_CONFIG.venue.name}
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--color-denso-slate-mid)' }}>
                  {EVENT_CONFIG.venue.address}
                </p>
              </div>

              {/* Facilities grid */}
              <div className="grid grid-cols-2 gap-3">
                {FACILITIES.map((facility, index) => (
                  <motion.div
                    key={facility.label}
                    variants={fadeUp}
                    transition={{ duration: 0.4, delay: index * 0.08 + 0.4 }}
                    className="p-4 rounded-2xl transition-shadow duration-300 hover:shadow-card"
                    style={{
                      background: 'var(--color-denso-white)',
                      border: '1px solid rgba(30, 63, 143, 0.08)',
                      boxShadow: '0 2px 10px rgba(30, 63, 143, 0.06)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
                      style={{
                        background: facility.accent === 'red'
                          ? 'var(--color-denso-red-pale)'
                          : 'var(--color-denso-blue-pale)',
                      }}
                    >
                      <facility.icon
                        className="w-4 h-4"
                        style={{
                          color: facility.accent === 'red'
                            ? 'var(--color-denso-red)'
                            : 'var(--color-denso-blue)',
                        }}
                      />
                    </div>
                    <p className="font-display font-semibold text-sm" style={{ color: 'var(--color-denso-slate)' }}>
                      {facility.label}
                    </p>
                    <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--color-denso-slate-mid)' }}>
                      {facility.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Contact strip */}
              <div
                className="p-4 rounded-2xl"
                style={{
                  background: 'var(--color-denso-blue-pale)',
                  border: '1px solid rgba(30, 63, 143, 0.15)',
                }}
              >
                <p className="font-sans text-sm" style={{ color: 'var(--color-denso-slate)' }}>
                  Ada pertanyaan? Hubungi kami di{' '}
                  <a
                    href="mailto:event@denso.co.id"
                    className="font-semibold hover:underline"
                    style={{ color: 'var(--color-denso-blue)' }}
                  >
                    event@denso.co.id
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { MapPin, Car, Clock, Utensils, ExternalLink } from 'lucide-react';
import { useIntersection } from '../../../hooks/useIntersection';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '../../../lib/animations';
import { EVENT_CONFIG } from '../../../constants/event';

const FACILITIES = [
  { icon: Car,      label: 'Parkir Gratis',    desc: '2.000+ tempat parkir' },
  { icon: Clock,    label: 'Full Day Event',    desc: '07.00 – 16.00 WIB' },
  { icon: Utensils, label: 'Makan Siang',       desc: 'Menu ramah keluarga' },
  { icon: MapPin,   label: 'Mudah Dijangkau',   desc: 'Bus antar-jemput tersedia' },
] as const;

export function VenueSection() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      id="venue"
      className="relative section-padding"
      style={{ background: '#FFFFFF' }}
      aria-label="Event venue"
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
            className="text-center mb-14 space-y-3"
          >
            <p
              className="text-xs font-display font-semibold uppercase tracking-widest"
              style={{ color: '#DC0032' }}
            >
              Lokasi Acara
            </p>
            <h2
              className="font-display font-extrabold"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: '#4A565E' }}
            >
              Tempat{' '}
              <span style={{ color: '#DC0032' }}>Kita Bertemu</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Map placeholder */}
            <motion.div
              variants={fadeInLeft}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/3]"
              style={{
                background: '#F5F7F8',
                border: '1px solid #4A565E10',
              }}
            >
              {/* Subtle arc decoration */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 400 300" fill="none">
                <circle cx="400" cy="0"   r="200" stroke="#DC0032" strokeWidth="1.5" />
                <circle cx="0"   cy="300" r="180" stroke="#4A565E" strokeWidth="1" />
                <circle cx="200" cy="150" r="100" stroke="#4A565E" strokeWidth="0.8" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center space-y-4 px-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: '#DC0032', boxShadow: '0 4px 20px rgba(220,0,50,0.28)' }}
                  >
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg" style={{ color: '#4A565E' }}>
                      {EVENT_CONFIG.venue.name}
                    </p>
                    <p className="font-sans text-sm mt-1" style={{ color: '#6B7882' }}>
                      {EVENT_CONFIG.venue.address}
                    </p>
                  </div>
                  <a
                    href={EVENT_CONFIG.venue.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold transition-colors"
                    style={{ color: '#DC0032' }}
                  >
                    Buka di Google Maps
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              variants={fadeInRight}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3
                  className="font-display font-bold text-2xl mb-1.5"
                  style={{ color: '#4A565E' }}
                >
                  {EVENT_CONFIG.venue.name}
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: '#6B7882' }}>
                  {EVENT_CONFIG.venue.address}
                </p>
              </div>

              {/* Facilities grid */}
              <div className="grid grid-cols-2 gap-3">
                {FACILITIES.map((facility, index) => (
                  <motion.div
                    key={facility.label}
                    variants={fadeInUp}
                    transition={{ duration: 0.4, delay: index * 0.08 + 0.4 }}
                    className="p-4 rounded-2xl transition-shadow duration-300"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #4A565E12',
                      boxShadow: '0 2px 10px rgba(74,86,94,0.06)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
                      style={{ background: '#DC00320F' }}
                    >
                      <facility.icon className="w-4 h-4" style={{ color: '#DC0032' }} />
                    </div>
                    <p className="font-display font-semibold text-sm" style={{ color: '#4A565E' }}>
                      {facility.label}
                    </p>
                    <p className="font-sans text-xs mt-0.5" style={{ color: '#6B7882' }}>
                      {facility.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Contact strip */}
              <div
                className="p-4 rounded-2xl"
                style={{ background: '#DC00320A', border: '1px solid #DC003220' }}
              >
                <p className="font-sans text-sm" style={{ color: '#4A565E' }}>
                  Ada pertanyaan? Hubungi kami di{' '}
                  <a
                    href="mailto:event@denso.co.id"
                    className="font-semibold hover:underline"
                    style={{ color: '#DC0032' }}
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

import { motion } from 'framer-motion';
import { MapPin, Car, Clock, Utensils, ExternalLink, Navigation } from 'lucide-react';
import { useIntersection } from '../../../hooks/useIntersection';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '../../../lib/animations';
import { EVENT_CONFIG } from '../../../constants/event';
import { cn } from '../../../lib/cn';

const FACILITIES = [
  { icon: Car,      label: 'Parkir Gratis',   desc: 'Kapasitas 2.000+ kendaraan' },
  { icon: Clock,    label: 'Full Day Event',   desc: 'Pukul 07.00 – 16.00 WIB' },
  { icon: Utensils, label: 'Makan Siang',      desc: 'Bebas pilih menu spesial' },
  { icon: Navigation, label: 'Akses Mudah',  desc: 'Tersedia bus shuttle' },
] as const;

export function VenueSection() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      id="venue"
      className="relative py-24 md:py-32 bg-[#F8F9FA] overflow-hidden"
      aria-label="Event venue"
    >
      {/* ── Artistic Backdrop ── */}
      <div className="absolute top-[20%] right-0 w-[40vw] h-[40vw] rounded-full bg-denso-amber/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-denso-navy/5 blur-[120px] pointer-events-none" />
      
      {/* ── Pattern overlay ── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #0054A6 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-denso-navy/5 border border-denso-navy/10 text-xs font-display font-bold uppercase tracking-[0.15em] text-denso-navy">
              Lokasi Acara
            </span>
            <h2 className="font-display font-extrabold text-denso-slate text-4xl md:text-5xl tracking-tight">
              Tempat <span className="text-transparent bg-clip-text bg-gradient-to-r from-denso-amber to-denso-amber-deep">Kita Bertemu</span>
            </h2>
            <p className="font-sans text-lg text-denso-slate-light max-w-2xl mx-auto">
              Berpusat di tempat yang luas, nyaman, dan strategis untuk mengakomodasi seluruh keluarga besar Denso.
            </p>
          </motion.div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* ── Left: Interactive Map Card ── */}
            <motion.div
              variants={fadeInLeft}
              className="lg:col-span-7 relative"
            >
              <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white p-2 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-white">
                <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-gradient-to-br from-denso-mist to-[#E2E8F0]">
                  {/* Abstract Map Art */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 400 300" fill="none" className="absolute inset-0 w-full h-full opacity-20">
                      <path d="M0 150 Q 100 50, 200 150 T 400 150" stroke="#0054A6" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                      <circle cx="350" cy="50" r="150" stroke="#F59E0B" strokeWidth="1.5" />
                      <circle cx="50" cy="250" r="100" stroke="#0054A6" strokeWidth="1" />
                    </svg>
                    
                    {/* Pulsing Location Pin */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="absolute inset-0 bg-denso-amber rounded-full animate-ping opacity-20" />
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-denso-amber to-denso-amber-deep flex items-center justify-center shadow-[0_10px_30px_rgba(245,158,11,0.4)] transform hover:scale-110 transition-transform duration-300">
                        <MapPin className="w-10 h-10 text-white" />
                      </div>
                      <div className="mt-4 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white">
                        <p className="font-display font-bold text-denso-navy text-lg text-center leading-tight">{EVENT_CONFIG.venue.name}</p>
                        <p className="font-sans text-xs text-denso-slate-light text-center mt-1">{EVENT_CONFIG.venue.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Right: Details & Facilities ── */}
            <motion.div
              variants={fadeInRight}
              className="lg:col-span-5 space-y-8"
            >
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-denso-gray-100">
                <h3 className="font-display font-bold text-denso-slate text-2xl md:text-3xl mb-3">
                  {EVENT_CONFIG.venue.name}
                </h3>
                <p className="font-sans text-denso-slate-light leading-relaxed text-base mb-6">
                  {EVENT_CONFIG.venue.address}
                </p>
                
                <a
                  href={EVENT_CONFIG.venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full gap-2 px-6 py-4 rounded-xl bg-denso-navy/5 text-denso-navy font-semibold hover:bg-denso-navy hover:text-white transition-all duration-300 group"
                >
                  <MapPin className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  Buka di Google Maps
                  <ExternalLink className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100" />
                </a>
              </div>

              {/* Facilities Grid */}
              <div className="grid grid-cols-2 gap-4">
                {FACILITIES.map((facility, index) => (
                  <motion.div
                    key={facility.label}
                    variants={fadeInUp}
                    className="p-5 rounded-[1.5rem] bg-white border border-denso-gray-100 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-denso-gray-200 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-denso-amber/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-denso-amber transition-all duration-300">
                      <facility.icon className="w-5 h-5 text-denso-amber-deep group-hover:text-white transition-colors" />
                    </div>
                    <p className="font-display font-bold text-denso-slate text-sm mb-1">{facility.label}</p>
                    <p className="font-sans text-xs text-denso-slate-light leading-snug">{facility.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

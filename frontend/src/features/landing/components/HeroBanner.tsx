import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { RippleButton } from '../../../components/atoms/RippleButton';
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight } from '../../../lib/animations';
import { ROUTES } from '../../../constants/routes';
import { EVENT_CONFIG } from '../../../constants/event';
import { cn } from '../../../lib/cn';

export function HeroBanner() {
  const dateStr = EVENT_CONFIG.date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-denso-cream pt-32 pb-24"
      aria-label="Hero banner"
    >
      {/* ── Aesthetic Background Elements ── */}
      {/* Abstract Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-denso-navy/5 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-denso-amber/10 blur-[100px] pointer-events-none animate-float-slow" />
      <div className="absolute top-[30%] right-[15%] w-[20vw] h-[20vw] rounded-full bg-denso-info/5 blur-[80px] pointer-events-none animate-float-delayed" />
      
      {/* Dynamic Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #0054A6 1px, transparent 1px), linear-gradient(to bottom, #0054A6 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* ── Left Content: Typography & CTAs ── */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="lg:col-span-7 space-y-10"
          >
            {/* Elegant Event Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-denso-amber/20 shadow-sm">
              <Sparkles className="w-4 h-4 text-denso-amber" />
              <span className="text-sm font-display font-bold tracking-widest uppercase text-denso-amber-deep">
                PT Denso Indonesia · 2026
              </span>
            </motion.div>

            {/* Massive Headline */}
            <motion.div variants={fadeInUp} className="space-y-2">
              <h1 className="font-display font-extrabold tracking-tight leading-[1.05]">
                <span className="block text-denso-slate text-6xl md:text-8xl drop-shadow-sm">
                  Family
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-denso-amber to-denso-amber-deep text-6xl md:text-8xl drop-shadow-sm pb-2">
                  Gathering
                </span>
                <span className="block text-denso-navy text-6xl md:text-8xl drop-shadow-sm">
                  2026
                </span>
              </h1>
            </motion.div>

            {/* Luxurious Tagline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-denso-slate-light font-sans font-light leading-relaxed max-w-2xl"
            >
              Satu hari penuh momen kebersamaan. 
              <span className="font-semibold text-denso-navy mx-1">15.000 karyawan</span> 
              dan keluarga bersatu dalam satu perayaan spektakuler.
            </motion.p>

            {/* CTA Group with Glass Effects */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-5 pt-4">
              <Link to={ROUTES.REGISTER} className="w-full sm:w-auto">
                <button className="group relative w-full flex justify-center items-center gap-3 px-8 py-4 bg-denso-amber text-denso-navy-dark rounded-2xl font-bold text-lg overflow-hidden shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.45)] transition-all duration-300 transform hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-denso-amber to-denso-amber-deep opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">Daftar Sekarang</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <a href="#schedule" className="w-full sm:w-auto">
                <button className="w-full flex justify-center items-center gap-3 px-8 py-4 bg-white text-denso-slate rounded-2xl font-semibold text-lg border border-denso-gray-100 shadow-sm hover:shadow-md hover:bg-denso-gray-50 transition-all duration-300 transform hover:-translate-y-1">
                  Lihat Jadwal
                </button>
              </a>
            </motion.div>

            {/* Elegant Info Strip */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-denso-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-denso-amber/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-denso-amber-deep" />
                </div>
                <div>
                  <p className="text-xs font-bold text-denso-slate-muted uppercase tracking-wider mb-0.5">Tanggal</p>
                  <p className="text-sm font-semibold text-denso-slate">{dateStr}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-denso-navy/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-denso-navy" />
                </div>
                <div>
                  <p className="text-xs font-bold text-denso-slate-muted uppercase tracking-wider mb-0.5">Lokasi</p>
                  <p className="text-sm font-semibold text-denso-slate">{EVENT_CONFIG.venue.name}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Content: Artistic Abstract Composition ── */}
          <motion.div
            variants={fadeInRight}
            initial="initial"
            animate="animate"
            className="hidden lg:flex lg:col-span-5 items-center justify-center relative h-[600px] w-full"
          >
            {/* Main Glass Card */}
            <div className="relative w-full aspect-square max-w-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/80 to-white/40 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 ease-out z-20 flex flex-col items-center justify-center p-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-denso-amber to-denso-amber-deep flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.3)] mb-6">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-7xl font-display font-extrabold text-denso-navy mb-2">15K+</h3>
                <p className="text-lg font-medium text-denso-slate-light text-center">
                  Karyawan & Keluarga <br/> Siap Hadir
                </p>
              </div>

              {/* Decorative Secondary Cards */}
              <div className="absolute -bottom-8 -left-12 w-48 h-48 bg-denso-navy rounded-[2rem] shadow-xl z-10 transform -rotate-12 animate-float" />
              <div className="absolute -top-10 -right-8 w-32 h-32 bg-denso-amber rounded-full shadow-lg z-30 transform rotate-12 animate-float-delayed flex items-center justify-center">
                 <Sparkles className="w-12 h-12 text-white opacity-80" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

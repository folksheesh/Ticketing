import { motion } from 'framer-motion';
import { UserPlus, Users, QrCode, CheckCircle2 } from 'lucide-react';
import { useIntersection } from '../../../hooks/useIntersection';
import { fadeInUp, staggerContainer } from '../../../lib/animations';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Daftar',
    description: 'Isi data karyawan dan buat profil acaramu dalam beberapa menit.',
  },
  {
    icon: Users,
    title: 'Tambah Keluarga',
    description: 'Daftarkan pasangan dan anak-anakmu. Kategori usia otomatis terisi.',
  },
  {
    icon: QrCode,
    title: 'Ambil Tiket QR',
    description: 'Terima QR code unik untuk masuk, makan siang, dan pengambilan souvenir.',
  },
  {
    icon: CheckCircle2,
    title: 'Nikmati Acaranya',
    description: 'Scan QR di setiap pos dan habiskan hari yang luar biasa bersama keluarga.',
  },
] as const;

export function TimelineSection() {
  const [ref, isVisible] = useIntersection<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      id="timeline"
      className="relative py-24 md:py-32 bg-[#F8F9FA] overflow-hidden"
      aria-label="Registration process"
    >
      {/* ── Background Aesthetics ── */}
      <div className="absolute top-0 right-[-10%] w-[40vw] h-[40vw] rounded-full bg-denso-amber/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-denso-navy/5 blur-[100px] pointer-events-none" />
      
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-denso-amber/10 border border-denso-amber/20 text-xs font-display font-bold uppercase tracking-[0.15em] text-denso-amber-deep">
              Cara Daftar
            </span>
            <h2 className="font-display font-extrabold text-denso-slate text-4xl md:text-5xl tracking-tight">
              Empat Langkah <span className="text-transparent bg-clip-text bg-gradient-to-r from-denso-amber to-denso-amber-deep">Mudah</span>
            </h2>
            <p className="font-sans text-lg text-denso-slate-light max-w-2xl mx-auto">
              Dari pendaftaran hingga hari-H, nikmati proses digital yang mulus dan tanpa hambatan.
            </p>
          </motion.div>

          {/* Timeline Grid (Zig-Zag on Desktop) */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-[50%] left-0 right-0 h-1 bg-gradient-to-r from-denso-amber via-denso-amber to-denso-navy transform -translate-y-1/2 opacity-20" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {STEPS.map((step, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={step.title}
                    variants={fadeInUp}
                    className={`relative flex flex-col items-center text-center ${isEven ? 'lg:-mt-12' : 'lg:mt-12'}`}
                  >
                    {/* Glass Card Container */}
                    <div className="group relative w-full bg-white rounded-3xl p-8 border border-denso-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 transform hover:-translate-y-2 z-10 flex flex-col items-center">
                      
                      {/* Step Number Badge */}
                      <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-to-br from-denso-amber to-denso-amber-deep text-white font-display font-bold flex items-center justify-center shadow-lg border-2 border-white">
                        {index + 1}
                      </div>

                      {/* Icon Circle */}
                      <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-500 ${
                          index < 2
                            ? 'bg-denso-amber/10 text-denso-amber-deep'
                            : 'bg-denso-navy/10 text-denso-navy'
                        }`}
                      >
                        <step.icon className="w-10 h-10" />
                      </div>

                      <h3 className="font-display font-bold text-denso-slate text-xl mb-3">
                        {step.title}
                      </h3>
                      <p className="font-sans text-denso-slate-light text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
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

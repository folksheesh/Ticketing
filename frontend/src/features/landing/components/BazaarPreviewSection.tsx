import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { UtensilsCrossed, Gamepad2, Store, Sparkles, HelpCircle } from 'lucide-react';
import { BuntingGarland } from '../../../components/atoms/BuntingGarland';
import { StringLights } from '../../../components/atoms/StringLights';

const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

/**
 * "What to Expect" section revamped.
 * 3 Main pillars: Mystery Guest Star, Grand Doorprize, Bazaar & Hiburan.
 */
export function BazaarPreviewSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative section-padding overflow-hidden"
      style={{ background: 'var(--color-denso-white)' }}
      aria-label="Tiga Hal Utama"
    >
      {/* Background washes */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center bottom, var(--color-denso-sky-light) 0%, transparent 60%)',
          opacity: 0.4,
        }}
      />

      {/* Decorative Garlands */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <BuntingGarland width={1400} flagCount={16} droop={0.3} height={55} />
      </div>
      <div className="absolute top-12 left-0 right-0 pointer-events-none" aria-hidden="true">
        <StringLights width={1400} bulbCount={20} height={40} droop={0.25} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 space-y-3"
        >
          <p
            className="text-xs font-display font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-denso-blue)' }}
          >
            Tiga Hal Utama
          </p>
          <h2
            className="font-display font-extrabold"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--color-denso-slate)' }}
          >
            Apa yang <span style={{ color: 'var(--color-denso-red)' }}>Menanti?</span>
          </h2>
          <p className="font-sans max-w-xl mx-auto text-sm sm:text-base" style={{ color: 'var(--color-denso-slate-mid)' }}>
            Persiapkan diri Anda untuk kejutan luar biasa. Kami telah menyiapkan 3 suguhan utama yang akan membuat Family Gathering tahun ini tak terlupakan.
          </p>
        </motion.div>

        {/* 3 Pillar Cards */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {/* 1. MYSTERY GUEST STAR */}
          <motion.div
            variants={cardVariants}
            whileHover={prefersReduced ? {} : { y: -8 }}
            className="relative flex flex-col p-6 sm:p-8 rounded-3xl overflow-hidden cursor-default transition-all duration-300 group"
            style={{
              background: 'var(--color-denso-white)',
              border: '1px solid rgba(30, 63, 143, 0.1)',
              boxShadow: '0 12px 30px rgba(30, 63, 143, 0.08)'
            }}
          >
            {/* Backlit Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
               <motion.div 
                 animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }} 
                 transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                 className="w-48 h-48 rounded-full blur-[40px]" 
                 style={{ background: 'var(--color-denso-red-soft)' }} 
               />
            </div>
            
            <div className="relative h-48 sm:h-56 w-full flex items-center justify-center mb-4">
               {/* Singer Silhouette */}
               <motion.div 
                 animate={{ 
                   y: [0, -10, 0],
                   rotate: [-2, 2, -2],
                   filter: ['blur(4px)', 'blur(7px)', 'blur(4px)']
                 }}
                 transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                 className="relative z-10 flex items-center justify-center text-black opacity-90"
               >
                 <svg width="180" height="180" viewBox="0 0 400 400" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    {/* Left Arm (Raised in the air - rockstar pose!) */}
                    <path d="M 170 210 L 120 150 L 130 90" fill="none" stroke="currentColor" stroke-width="24" stroke-linejoin="round" stroke-linecap="round" />
                    <circle cx="130" cy="90" r="14" />
                  
                    {/* Torso / Body */}
                    <path d="M 130 400 C 130 300, 170 220, 190 220 C 230 220, 260 300, 270 400 Z" />
                    
                    {/* Chest / Shoulders */}
                    <circle cx="190" cy="220" r="45" />
                    
                    {/* Neck */}
                    <path d="M 195 210 L 210 160" fill="none" stroke="currentColor" stroke-width="26" stroke-linecap="round" />
                    
                    {/* Head */}
                    <circle cx="225" cy="120" r="35" />
                    {/* Nose */}
                    <polygon points="245,100 275,105 255,120" />
                    {/* Jaw / Chin */}
                    <polygon points="230,130 265,140 220,150" />
                    
                    {/* Hair (Spiky, blowing back) */}
                    <polygon points="220,85 180,50 205,85 150,70 190,100 140,110 185,125 210,135 220,135" />
                    
                    {/* Right Arm holding Mic */}
                    <path d="M 190 220 L 240 185 L 275 190" fill="none" stroke="currentColor" stroke-width="26" stroke-linejoin="round" stroke-linecap="round" />
                    <circle cx="275" cy="190" r="14" />
                    
                    {/* Microphone */}
                    {/* Handle */}
                    <path d="M 265 215 L 285 160" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" />
                    {/* Mic Ball */}
                    <circle cx="290" cy="150" r="16" />
                    
                    {/* Mic Cable swooping down */}
                    <path d="M 260 225 C 240 280, 290 320, 250 400" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
                 </svg>
               </motion.div>
               
               {/* Floating Question Marks */}
               <motion.div 
                 animate={{ y: [0, -15, 0], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                 transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                 className="absolute top-4 left-6"
                 style={{ color: 'var(--color-denso-slate-mid)' }}
               >
                 <HelpCircle size={28} />
               </motion.div>
               <motion.div 
                 animate={{ y: [0, -20, 0], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                 transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                 className="absolute top-8 right-6"
                 style={{ color: 'var(--color-denso-slate-soft)' }}
               >
                 <HelpCircle size={40} />
               </motion.div>
               <motion.div 
                 animate={{ y: [0, -12, 0], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                 transition={{ duration: 2.8, repeat: Infinity, delay: 1 }}
                 className="absolute bottom-8 left-10"
                 style={{ color: 'var(--color-denso-slate-mid)' }}
               >
                 <HelpCircle size={24} />
               </motion.div>
            </div>

            <div className="relative z-10 text-center mt-auto">
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 border" style={{ background: 'var(--color-denso-red-pale)', color: 'var(--color-denso-red-dark)', borderColor: 'var(--color-denso-red-light)' }}>
                Top Secret
              </div>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl mb-2" style={{ color: 'var(--color-denso-slate)' }}>
                Mystery Guest Star
              </h3>
              <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--color-denso-slate-mid)' }}>
                Penampilan spesial dari artis papan atas yang akan mengguncang panggung. Siapkan diri Anda untuk sing-along bersama!
              </p>
            </div>
          </motion.div>

          {/* 2. PESTA RAKYAT BAZAAR */}
          <motion.div
            variants={cardVariants}
            whileHover={prefersReduced ? {} : { y: -8 }}
            className="relative flex flex-col p-6 sm:p-8 rounded-3xl overflow-hidden cursor-default transition-all duration-300 group"
            style={{
              background: 'var(--color-denso-white)',
              border: '1px solid rgba(30, 63, 143, 0.1)',
              boxShadow: '0 12px 30px rgba(30, 63, 143, 0.08)'
            }}
          >
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-[0.03]">
              <Store size={160} style={{ color: 'var(--color-denso-blue)' }} />
            </div>

            <div className="relative h-48 sm:h-56 w-full flex items-center justify-center mb-4">
              <div className="grid grid-cols-2 gap-4 w-full px-4">
                <motion.div whileHover={{ scale: 1.05 }} className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2" style={{ background: 'var(--color-denso-red-pale)' }}>
                  <UtensilsCrossed size={36} style={{ color: 'var(--color-denso-red)' }} />
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--color-denso-red-dark)' }}>Kuliner</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2" style={{ background: 'var(--color-denso-blue-pale)' }}>
                  <Gamepad2 size={36} style={{ color: 'var(--color-denso-blue)' }} />
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--color-denso-blue-dark)' }}>Wahana</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2" style={{ background: 'var(--color-denso-sky-light)' }}>
                  <Store size={36} style={{ color: 'var(--color-denso-blue-dark)' }} />
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--color-denso-navy-deep)' }}>Bazaar</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2" style={{ background: 'var(--color-denso-slate-mist)' }}>
                  <Sparkles size={36} style={{ color: 'var(--color-denso-slate-dark)' }} />
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--color-denso-slate-dark)' }}>Hiburan</span>
                </motion.div>
              </div>
            </div>

            <div className="relative z-10 text-center mt-auto">
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 border" style={{ background: 'var(--color-denso-sky-light)', color: 'var(--color-denso-blue-dark)', borderColor: 'var(--color-denso-sky)' }}>
                Seharian Penuh
              </div>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl mb-2" style={{ color: 'var(--color-denso-slate)' }}>
                Pesta Rakyat
              </h3>
              <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--color-denso-slate-mid)' }}>
                Jajanan kuliner lengkap, booth UMKM, arena bermain, dan berbagai kompetisi berhadiah seru untuk seluruh anggota keluarga.
              </p>
            </div>
          </motion.div>

          {/* 3. GRAND DOORPRIZE */}
          <motion.div
            variants={cardVariants}
            whileHover={prefersReduced ? {} : { y: -8 }}
            className="relative flex flex-col p-6 sm:p-8 rounded-3xl overflow-hidden cursor-default transition-all duration-300 group md:col-span-2 lg:col-span-1"
            style={{
              background: 'var(--color-denso-white)',
              border: '1px solid rgba(30, 63, 143, 0.1)',
              boxShadow: '0 12px 30px rgba(30, 63, 143, 0.08)'
            }}
          >
            {/* Backlit Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
               <motion.div 
                 animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }} 
                 transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                 className="w-48 h-48 rounded-full blur-[40px]" 
                 style={{ background: 'var(--color-denso-blue-soft)' }} 
               />
            </div>

            <div className="relative h-48 sm:h-56 w-full flex items-center justify-center mb-4">
               {/* Silhouettes of Prizes (Black with blur) */}
               <motion.div 
                 animate={{ y: [0, -6, 0], filter: ['blur(3px)', 'blur(5px)', 'blur(3px)'] }}
                 transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                 className="absolute top-4 left-8 z-10 text-black opacity-90"
               >
                 <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                 </svg>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, -10, 0], filter: ['blur(4px)', 'blur(6px)', 'blur(4px)'] }}
                 transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                 className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-black opacity-90"
               >
                 <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                   <path d="M21 3H3C1.9 3 1 3.9 1 5v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                 </svg>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, -8, 0], filter: ['blur(2px)', 'blur(5px)', 'blur(2px)'] }}
                 transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                 className="absolute bottom-6 left-[45%] -translate-x-1/2 z-20 text-black opacity-90"
               >
                 <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                   <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-5 20c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                 </svg>
               </motion.div>

               {/* Sparkles */}
               <motion.div animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-4 right-8" style={{ color: 'var(--color-denso-slate-soft)' }}>
                 <Sparkles size={28} />
               </motion.div>
               <motion.div animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }} className="absolute bottom-16 left-8" style={{ color: 'var(--color-denso-slate-soft)' }}>
                 <Sparkles size={22} />
               </motion.div>
               <motion.div animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1 }} className="absolute bottom-10 right-14" style={{ color: 'var(--color-denso-slate-soft)' }}>
                 <Sparkles size={20} />
               </motion.div>
            </div>

            <div className="relative z-10 text-center mt-auto">
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 border" style={{ background: 'var(--color-denso-red-pale)', color: 'var(--color-denso-red-dark)', borderColor: 'var(--color-denso-red-light)' }}>
                Penuh Kejutan
              </div>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl mb-2" style={{ color: 'var(--color-denso-slate)' }}>
                Grand Doorprize
              </h3>
              <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--color-denso-slate-mid)' }}>
                Berbagai hadiah eksklusif dan bernilai fantastis menanti Anda yang beruntung. Jangan lewatkan momen pengundiannya!
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

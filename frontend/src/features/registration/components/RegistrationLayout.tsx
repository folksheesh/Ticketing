import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect } from 'react';
import { useRegistrationStore } from '../store/useRegistrationStore';
import { PersonalDataStep } from './PersonalDataStep';
import { FamilyDataStep } from './FamilyDataStep';
import { TicketResultStep } from './TicketResultStep';
import { Logo } from '../../../components/atoms/Logo';

/* ─── Step metadata ─────────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, title: 'Data Pribadi',  short: '01' },
  { id: 2, title: 'Data Keluarga', short: '02' },
  { id: 3, title: 'E-Ticket',      short: '03' },
];



export function RegistrationLayout() {
  const { currentStep, personalData } = useRegistrationStore();
  const isSingle = personalData.maritalStatus === 'Single';

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);
    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
    };
  }, []);

  return (
    /*
     * The page is placed inside <MainLayout> which adds a fixed header (pt-20).
     * We use min-h-screen so the two panels always fill the viewport,
     * and overflow-hidden on the wrapper prevents double scrollbars.
     */
    <div
      className="flex flex-col lg:flex-row min-h-screen min-h-0"
      style={{ height: 'var(--app-height, 100vh)', minHeight: 'var(--app-height, 100vh)', overflow: 'hidden', position: 'relative' }}
    >
      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL  — branding + photo (desktop only)
      ══════════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-[42%] xl:w-[38%] flex-col relative overflow-hidden flex-shrink-0 min-h-0"
        style={{ background: '#DC0032', minHeight: '100dvh', position: 'sticky', top: 0 }}
      >
        {/* Photo — fills the panel, darkened with an overlay */}
        <div className="absolute inset-0">
          <img
            /*
             * Replace this src with the uploaded party photo once it's
             * saved to src/assets/party.jpg — then import it and use
             * the module URL here.
             *
             * The image below is a placeholder sourced from Unsplash
             * (celebration / crowd category, free to use).
             * Swap it with your actual image to remove the network dep.
             */
            src="https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=900&auto=format&fit=crop&q=80"
            alt="Family Gathering"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* Gradient overlay: heavy red tint at bottom, lighter at top */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(220,0,50,0.62) 0%, rgba(140,0,30,0.88) 100%)',
            }}
          />
        </div>

        {/* Content sits above the overlay */}
        <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-14">

          {/* Top: Denso logo — white on red background */}
          <Logo size="md" onDark />

          {/* Middle: headline only */}
          <div>
            <h1
              className="font-display font-extrabold text-white leading-[1.1]"
              style={{ fontSize: 'clamp(2rem, 3.2vw, 3rem)' }}
            >
              Denso<br />
              Family<br />
              Gathering<br />
              <span style={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>2026</span>
            </h1>
          </div>

          {/* Bottom: footer note */}
          <p className="font-sans text-[11px] text-white/35 font-medium tracking-wide">
            © 2026 PT Denso Indonesia
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL  — single scroll container
      ══════════════════════════════════════════════════════════ */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden panel-scroll min-h-0"
        style={{
          background: '#F5F7F8',
          height: '100%',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
        tabIndex={-1}
      >
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-7 lg:py-8 flex flex-col">

          {/* Mobile header */}
          <div className="lg:hidden text-center mb-6">
            <h2 className="font-display font-extrabold" style={{ fontSize: '1.5rem', color: '#4A565E' }}>
              Registrasi Tiket
            </h2>
            <p className="font-sans text-sm mt-1" style={{ color: '#6B7882' }}>
              Lengkapi data Anda untuk mendapatkan e-ticket.
            </p>
          </div>

          {/* ── Stepper ── */}
          <div className="mb-6">
            <div className="relative flex items-center justify-between">
              <div className="absolute h-px top-5" style={{ left: '2rem', right: '2rem', background: '#CDD4D8', zIndex: 0 }} />
              <div
                className="absolute h-px top-5 transition-all duration-500 ease-out"
                style={{
                  left: '2rem',
                  width: `calc(${((currentStep - 1) / (STEPS.length - 1)) * 100}% * (100% - 4rem) / 100%)`,
                  background: '#DC0032',
                  zIndex: 1,
                }}
              />
              {STEPS.map((step) => {
                const done    = currentStep > step.id;
                const active  = currentStep === step.id;
                const skipped = step.id === 2 && isSingle;
                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center gap-2" style={{ opacity: skipped ? 0.35 : 1 }}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all duration-300"
                      style={{
                        background: done ? '#DC0032' : '#FFFFFF',
                        border: done ? 'none' : active ? '2.5px solid #DC0032' : '2px solid #CDD4D8',
                        color: done ? '#FFFFFF' : active ? '#DC0032' : '#9AAAB3',
                        boxShadow: active ? '0 0 0 4px rgba(220,0,50,0.12)' : 'none',
                      }}
                    >
                      {done ? <Check style={{ width: 18, height: 18 }} /> : step.id}
                    </div>
                    <span
                      className="font-sans text-[11px] font-semibold uppercase tracking-wider text-center whitespace-nowrap"
                      style={{ color: active ? '#DC0032' : done ? '#4A565E' : '#9AAAB3' }}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Form card ── */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 4px 32px rgba(74,86,94,0.09)',
              border: '1px solid rgba(74,86,94,0.08)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {currentStep === 1 && <PersonalDataStep />}
                {currentStep === 2 && <FamilyDataStep />}
                {currentStep === 3 && <TicketResultStep />}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

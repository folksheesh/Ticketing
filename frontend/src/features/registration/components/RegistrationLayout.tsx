import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck } from 'lucide-react';
import { useRegistrationStore } from '../store/useRegistrationStore';
import { PersonalDataStep } from './PersonalDataStep';
import { FamilyDataStep } from './FamilyDataStep';
import { TicketResultStep } from './TicketResultStep';
import { cn } from '../../../lib/cn';

const STEPS = [
  { id: 1, title: 'Data Pribadi' },
  { id: 2, title: 'Data Keluarga' },
  { id: 3, title: 'E-Ticket' },
];

export function RegistrationLayout() {
  const { currentStep, personalData } = useRegistrationStore();
  const isSingle = personalData.maritalStatus === 'Single';
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans overflow-hidden">
      
      {/* ── Left Panel (Branding & Hero) ── */}
      <div className="lg:w-[45%] xl:w-[40%] bg-denso-navy relative flex flex-col justify-between p-8 lg:p-12 overflow-hidden shrink-0">
        
        {/* Decorative Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse duration-10000" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-denso-amber rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse duration-7000" />
        
        {/* Top Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-white/10">
              <ShieldCheck className="w-7 h-7 text-denso-navy" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-xl leading-tight tracking-wide">DENSO</p>
              <p className="text-xs text-white/60 font-medium tracking-widest uppercase mt-0.5">Indonesia</p>
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-white leading-[1.1] tracking-tight">
            Family Gathering <br />
            <span className="text-denso-amber drop-shadow-lg">2025</span>
          </h1>
          <p className="mt-5 text-blue-100/90 text-base lg:text-lg max-w-md leading-relaxed font-medium">
            Mari bergabung bersama keluarga besar DENSO dalam acara tahunan penuh kegembiraan, kebersamaan, dan puluhan doorprize menarik!
          </p>
        </div>
        
        {/* Hero Image */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-10 min-h-[300px]">
          <img 
            src="/hero.png" 
            alt="Family Gathering Illustration" 
            className="w-full max-w-md object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        
        {/* Footer */}
        <div className="relative z-10 text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
           <span>© 2025 PT Denso Indonesia</span>
        </div>
      </div>

      {/* ── Right Panel (Form Area) ── */}
      <div className="flex-1 overflow-y-auto bg-slate-50 relative">
        <div className="max-w-2xl mx-auto py-12 px-6 lg:px-12 lg:py-20 min-h-full flex flex-col justify-center">
          
          {/* Header Mobile */}
          <div className="lg:hidden text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Registrasi Tiket</h2>
            <p className="text-slate-500 mt-2 text-sm">Lengkapi data Anda untuk mendapatkan e-ticket.</p>
          </div>

          {/* Stepper */}
          <div className="mb-12 relative max-w-md mx-auto w-full">
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            
            <div className="relative z-10 flex justify-between items-start">
              {STEPS.map((step, index) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                const isDisabled = step.id === 2 && isSingle;

                return (
                  <div key={step.id} className={cn("flex flex-col items-center w-24", isDisabled && "opacity-30")}>
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 relative bg-white",
                        isCompleted ? "border-2 border-emerald-500 text-emerald-500 shadow-sm" : 
                        isCurrent ? "border-2 border-blue-600 text-blue-600 shadow-md ring-4 ring-blue-50" : 
                        "border-2 border-slate-200 text-slate-400"
                      )}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                    </div>
                    <span className={cn(
                      "mt-3 text-[10px] font-bold uppercase tracking-wider text-center transition-colors",
                      isCurrent ? "text-blue-600" : isCompleted ? "text-slate-700" : "text-slate-400"
                    )}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Active Progress Bar */}
            <div 
              className="absolute top-5 left-8 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500 ease-out" 
              style={{ width: `calc(${((currentStep - 1) / (STEPS.length - 1)) * 100}%)` }}
            />
          </div>
          
          {/* Form Container */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
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

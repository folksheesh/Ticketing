import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
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

  // If user is Single, they skip step 2. We handle this dynamically.
  const isSingle = personalData.maritalStatus === 'Single';
  
  const displaySteps = STEPS.map(step => {
    if (step.id === 2 && isSingle) {
      return { ...step, disabled: true };
    }
    return step;
  });

  return (
    <div className="min-h-screen bg-denso-cream pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display font-extrabold text-3xl text-denso-slate">
            Registrasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-denso-navy to-denso-navy-light">Peserta</span>
          </h1>
          <p className="font-sans text-denso-slate-light mt-2">
            Lengkapi data Anda untuk mendapatkan akses tiket digital.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-denso-gray-100 -translate-y-1/2 z-0 rounded-full" />
          
          <div className="relative z-10 flex justify-between items-center">
            {STEPS.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isDisabled = step.id === 2 && isSingle;

              return (
                <div key={step.id} className={cn("flex flex-col items-center", isDisabled && "opacity-40")}>
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all duration-300",
                      isCompleted ? "bg-denso-success text-white shadow-sm" : 
                      isCurrent ? "bg-denso-amber text-denso-navy-dark shadow-[0_4px_12px_rgba(245,158,11,0.3)] ring-4 ring-denso-cream" : 
                      "bg-white text-denso-gray-400 border border-denso-gray-200"
                    )}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <span className={cn(
                    "mt-3 text-xs font-semibold uppercase tracking-wider",
                    isCurrent ? "text-denso-slate" : "text-denso-gray-400"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Active Progress Bar */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-denso-amber -translate-y-1/2 z-0 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Form Area */}
        <div className="bg-white rounded-[2rem] shadow-card border border-denso-gray-100 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
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
  );
}

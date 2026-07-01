import { create } from 'zustand';
import type { RegistrationState } from '../types';

const initialPersonalData = {
  fullName: '',
  nik: '',
  division: '',
  email: '',
  phone: '',
  tshirtSize: '' as const,
  maritalStatus: '' as const,
};

const initialFamilyData = {
  hasSpouse: false,
  spouseName: '',
  spouseTshirtSize: '' as const,
  hasChildren: false,
  children: [],
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  currentStep: 1,
  personalData: initialPersonalData,
  familyData: initialFamilyData,

  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({ 
    currentStep: state.currentStep + 1 
  })),
  
  prevStep: () => set((state) => ({ 
    currentStep: Math.max(1, state.currentStep - 1) 
  })),

  setPersonalData: (data) => set((state) => ({
    personalData: { ...state.personalData, ...data }
  })),

  setFamilyData: (data) => set((state) => ({
    familyData: { ...state.familyData, ...data }
  })),

  reset: () => set({
    currentStep: 1,
    personalData: initialPersonalData,
    familyData: initialFamilyData,
  }),
}));
